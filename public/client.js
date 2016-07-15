var CHUNK_SIZE = 40;
var CURRENT_CHUNK = {"row": Math.floor(CHUNK_SIZE / 2),
  "col": Math.floor(CHUNK_SIZE / 2)};
var CURRENT_BLOCK = {"row": 0, "col": 0};
var CHUNKS = [];
for (var i = 0; i < CHUNK_SIZE; i++) {
  var rowOfChunks = [];
  CHUNKS.push(rowOfChunks);
  for (var j = 0; j < CHUNK_SIZE; j++) {
    gridOfBlocks = null;
    CHUNKS[CHUNKS.length - 1].push(gridOfBlocks);
  }
}

function login() {
  $.post("login", {username: $("#username").val(),
    password: $("#password").val()}, handleLogin);
}

function handleLogin(res) {
  window.sessionStorage.accessToken = res.token;
  $.post('map.json', {"token": window.sessionStorage.accessToken}, setup);
  $("#login_div").html(""); //remove login view
}

function setup() {
  loadChunk(CURRENT_CHUNK.row, CURRENT_CHUNK.col, renderMap);
  bindKeys();
}

function loadChunk(row, col, callback) {
  if (CHUNKS[row][col] === null) {
    $.post("map.json", {"token": window.sessionStorage.accessToken},
    function(res) {
      CHUNKS[row][col] = res;
      callback(); //can use to render map
    });
  }
}

function renderMap() {
  $("#map").css("width", CHUNK_SIZE * 10);
  $("#map").html(genMapHTML(CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col]));
}

function bindKeys() {
  $(document).keydown(function(event) {
    switch(event.which) {
      case 37: //left
        move(0, -1);
        break;

      case 38: //up
        move(-1, 0);
        break;

      case 39: //right
        move(0, 1)
        break;

      case 40: //down
        move(1, 0);
        break;

      default:
        return;
    }
    event.preventDefault(); //prevent scrolling
  });
}

function move(rowInc, colInc) {
  var chunkRow = CURRENT_CHUNK.row + rowInc;
  var chunkCol = CURRENT_CHUNK.col + colInc;
  if (chunkBoundsCheck(chunkRow, chunkCol)) {
    changeCurrentBlock(rowInc, colInc);
    if (CHUNKS[chunkRow][chunkCol] === null) {
      loadInfluencedChunk(chunkRow, chunkCol, stitchChunksPrep);
    } else {
      stitchChunksPrep();
    }
  } else {
    console.log("move not permitted");
  } //end bounds check if
}

function chunkBoundsCheck(row, col) {
  return row >= 0 && row < CHUNK_SIZE - 1 && col >= 0 && col < CHUNK_SIZE - 1;
}

function changeCurrentBlock(row, col) {
  CURRENT_BLOCK.row += row;
  CURRENT_BLOCK.col += col;
  changeCurrentChunk("row");
  changeCurrentChunk("col");
}

function loadInfluencedChunk(row, col, callback) {
  var presetPotentialTiles = getPresetPotentialTiles(row, col);
  $.post("influenced_map.json", {"token": window.sessionStorage.accessToken,
    "presetPotentialTiles": presetPotentialTiles}, function(res) {
    CHUNKS[row][col] = res;
    $.post("refresh_token", {"token": window.sessionStorage.accessToken},
      function(res) {
        window.sessionStorage.accessToken = res.token;
    });
    callback();
  });
}

function changeCurrentChunk(rowOrCol) {
  if (CURRENT_BLOCK[rowOrCol] < 0) {
    CURRENT_CHUNK[rowOrCol] -= 1;
    CURRENT_BLOCK[rowOrCol] = CHUNK_SIZE - 1;
  } else if (CURRENT_BLOCK[rowOrCol] > CHUNK_SIZE - 1) {
    CURRENT_CHUNK[rowOrCol] += 1;
    CURRENT_BLOCK[rowOrCol] = 0;
  }
}

function getPresetPotentialTiles(row, col) {
  //var presetPotentialTiles = {"list": []};
  var presetPotentialTiles = [];

  if (row - 1 >= 0 && CHUNKS[row - 1][col] !== null) {
    var relevantRow = CHUNKS[row - 1][col][CHUNK_SIZE - 1];
    addPresetPotentialTiles(relevantRow, presetPotentialTiles, "\"0 \" + i");
  }

  if (row + 1 < CHUNK_SIZE && CHUNKS[row + 1][col] !== null) {
    var relevantRow = CHUNKS[row + 1][col][0];
    addPresetPotentialTiles(relevantRow, presetPotentialTiles,
      "(CHUNK_SIZE - 1).toString() + \" \" + i");
  }

  if (col + 1 < CHUNK_SIZE && CHUNKS[row][col + 1] !== null) {
    var relevantCol = [];
    for (var i = 0; i < CHUNK_SIZE; i++) {
      try {
        relevantCol.push(CHUNKS[row][col + 1][i][0]);
      } catch(exception) {
        console.log(exception);
      }
    }
    addPresetPotentialTiles(relevantCol, presetPotentialTiles,
      "i + \" \" + (CHUNK_SIZE - 1).toString()");
  }

  if (col - 1 >= 0 && CHUNKS[row][col - 1] !== null) {
    var relevantCol = [];
    for (var i = 0; i < CHUNK_SIZE; i++) {
      try {
        relevantCol.push(CHUNKS[row][col - 1][i][CHUNK_SIZE - 1]);
      } catch(exception) {
        console.log(exception);
      }
    }
    addPresetPotentialTiles(relevantCol, presetPotentialTiles, "i + \" 0\"");
  }

  return presetPotentialTiles;
}

function addPresetPotentialTiles(tileArray, presetPotentialTiles, evalString) {
  for (var i = 0; i < tileArray.length; i++) {
    switch (tileArray[i]) {
      case 0:
        presetPotentialTiles.push(eval(evalString) + " water");
        break;
      case 1:
        presetPotentialTiles.push(eval(evalString) + " grass");
        break;
      case 2:
        presetPotentialTiles.push(eval(evalString) + " sand");
        break;
      default:
        console.log("error: invalid tilecode " + tileArray[i] + "found");
    } //end switch
  } //end for
}

function genMapHTML(grid) {
  mapHTML = "";
  var terrainCodesToNames = {
    0: 'water', 1: 'grass', 2: 'sand'
  };
  var r = 0;
  for (row of grid) {
    var c = 0;
    for (terrainCode of row) {
      var terrain = terrainCodesToNames[terrainCode];
      if (terrain !== 'undefined') {
        if (r === Math.floor(CHUNK_SIZE / 2) &&
            c === Math.floor(CHUNK_SIZE / 2)) { //draw player in center of map
          mapHTML += "<div class='playerCharacter'></div>"
        } else {
          mapHTML += "<div class='" + terrain + "'></div>"
        }
      } else {
        mapHTML += "<div class='tile'>n</div>"
      }
      c++;
    }
    r++;
  }
  return mapHTML;
}

function stitchChunksPrep() {
  if (CHUNKS[CURRENT_CHUNK.row + 1][CURRENT_CHUNK.col] === null) {
    loadInfluencedChunk(CURRENT_CHUNK.row + 1, CURRENT_CHUNK.col, loadRightGrid);
  } else if (CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col + 1] === null) {
    loadInfluencedChunk(CURRENT_CHUNK.row, CURRENT_CHUNK.col + 1, loadDownRightGrid);
  } else if (CHUNKS[CURRENT_CHUNK.row + 1][CURRENT_CHUNK.col + 1] === null) {
    loadInfluencedChunk(CURRENT_CHUNK.row + 1, CURRENT_CHUNK.col + 1, stitchChunks);
  } else {
    stitchChunks();
  }
}

function loadRightGrid() {
  if (CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col + 1] === null) {
    loadInfluencedChunk(CURRENT_CHUNK.row, CURRENT_CHUNK.col + 1, loadDownRightGrid);
  }
}

function loadDownRightGrid() {
  if (CHUNKS[CURRENT_CHUNK.row + 1][CURRENT_CHUNK.col + 1] === null) {
    loadInfluencedChunk(CURRENT_CHUNK.row + 1, CURRENT_CHUNK.col + 1, stitchChunks);
  }
}

function stitchChunks() {
  var grid = buildBlankGrid();
  var row = CURRENT_BLOCK.row;
  var col = CURRENT_BLOCK.col;
  var currentGrid = CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col];
  var downGrid = CHUNKS[CURRENT_CHUNK.row + 1][CURRENT_CHUNK.col];
  var rightGrid = CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col + 1];
  var downRightGrid = CHUNKS[CURRENT_CHUNK.row + 1][CURRENT_CHUNK.col + 1];

  if (currentGrid === null) {
    console.log("tried to render currentGrid too early");
    return;
  } else if (downGrid === null) {
    console.log("tried to render downGrid too early");
    return;
  } else if (rightGrid === null) {
    console.log("tried to render rightGrid too early");
    return;
  } else if (downRightGrid === null) {
    console.log("tried to render downRightGrid too early");
    return;
  }

  for (var i = 0; i < CHUNK_SIZE; i++) {
    for (var j = 0; j < CHUNK_SIZE; j++) {
      var adjustedRow = i + row;
      var adjustedCol = j + col;
      if (adjustedRow < CHUNK_SIZE && adjustedCol < CHUNK_SIZE) {
        grid[i][j] = currentGrid[adjustedRow][adjustedCol];
      } else if (adjustedRow >= CHUNK_SIZE && adjustedCol < CHUNK_SIZE) {
        grid[i][j] = downGrid[adjustedRow - CHUNK_SIZE][adjustedCol];
      } else if (adjustedRow < CHUNK_SIZE && adjustedCol >= CHUNK_SIZE) {
        grid[i][j] = rightGrid[adjustedRow][adjustedCol - CHUNK_SIZE];
      } else if (adjustedRow >= CHUNK_SIZE && adjustedCol >= CHUNK_SIZE) {
        grid[i][j] =
          downRightGrid[adjustedRow - CHUNK_SIZE][adjustedCol - CHUNK_SIZE];
      }
    } //end for i loop
  } //end for j loop
  $("#map").html(genMapHTML(grid));
}

function buildBlankGrid() {
  var grid = [];
  for (var i = 0; i < CHUNK_SIZE; i++) {
    grid.push([]);
    for (var j = 0; j < CHUNK_SIZE; j++) {
      grid[i].push(null);
    }
  }
  return grid;
}
