var CHUNK_SIZE = 40;
var CHUNKS = {};
var CURRENT_CHUNK = {"x": 0, "y": 0};
var CURRENT_BLOCK = {"row": 0, "col": 0};

function login() {
  $.post("login", {username: $("#username").val(),
    password: $("#password").val()}, handleLogin);
}

function handleLogin(res) {
  console.log(res.token);
  window.sessionStorage.accessToken = res.token;
  $.post('map.json', {"token": window.sessionStorage.accessToken}, setup);
  $("#login_div").html(""); //remove login view
}

function setup() {
  loadChunk(getChunkCoords(), renderMap);
  bindKeys();
}

function getChunkCoords() {
  return CURRENT_CHUNK.x + " " + CURRENT_CHUNK.y;
}

function getIncrementedChunkCoords(xInc, yInc) {
  return (CURRENT_CHUNK.x + xInc) + " " + (CURRENT_CHUNK.y + yInc);
}

function loadChunk(chunkCoords, callback) {
  if (CHUNKS[chunkCoords] === undefined) {
    $.post("map.json", {"token": window.sessionStorage.accessToken},
    function(res) {
      CHUNKS[chunkCoords] = res;
      callback(); //can use to render map
    });
  }
}

function renderMap() {
  $("#map").css("width", CHUNK_SIZE * 10);
  $("#map").html(genMapHTML(CHUNKS[getChunkCoords()]));
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
  //while the players is active keep the token refreshed
  $.post("refresh_token", {"token": window.sessionStorage.accessToken},
    function(res) {
      window.sessionStorage.accessToken = res.token;
  });

  var chunkY = CURRENT_CHUNK.y + rowInc;
  var chunkX = CURRENT_CHUNK.x + colInc;
  changeCurrentBlock(rowInc, colInc);
  if (CHUNKS[chunkX + " " + chunkY] === undefined) {
    loadInfluencedChunk(chunkX + " " + chunkY, stitchChunksPrep);
  } else {
    stitchChunksPrep();
  }
}

function changeCurrentBlock(row, col) {
  CURRENT_BLOCK.row += row;
  CURRENT_BLOCK.col += col;
  changeCurrentChunkY(row);
  changeCurrentChunkX(col);
}

function loadInfluencedChunk(chunkCoords, callback) {
  var presetPotentialTiles = [] //getPresetPotentialTiles(row, col);
  $.post("influenced_map.json", {"token": window.sessionStorage.accessToken,
    "presetPotentialTiles": presetPotentialTiles}, function(res) {
    CHUNKS[chunkCoords] = res;
    callback();
  });
}

function changeCurrentChunkY(row) {
  if (CURRENT_BLOCK[row] < 0) {
    CURRENT_CHUNK.y -= 1;
    CURRENT_BLOCK[row] = CHUNK_SIZE - 1;
  } else if (CURRENT_BLOCK[row] > CHUNK_SIZE - 1) {
    CURRENT_CHUNK.y += 1;
    CURRENT_BLOCK[row] = 0;
  }
}

function changeCurrentChunkX(col) {
  if (CURRENT_BLOCK[col] < 0) {
    CURRENT_CHUNK.x -= 1;
    CURRENT_BLOCK[col] = CHUNK_SIZE - 1;
  } else if (CURRENT_BLOCK[col] > CHUNK_SIZE - 1) {
    CURRENT_CHUNK.x += 1;
    CURRENT_BLOCK[col] = 0;
  }
}

function getPresetPotentialTiles(row, col) {
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
  var xPlus = getIncrementedChunkCoords(1, 0);
  var yPlus = getIncrementedChunkCoords(0, 1);
  var xyPlus = getIncrementedChunkCoords(1, 1);

  if (CHUNKS[yPlus] === undefined) {
    loadInfluencedChunk(yPlus, loadRightGrid);
  } else if (CHUNKS[xPlus] === undefined) {
    loadInfluencedChunk(xPlus, loadDownRightGrid);
  } else if (CHUNKS[xyPlus] === undefined) {
    loadInfluencedChunk(xyPlus, stitchChunks);
  } else {
    stitchChunks();
  }
}

function loadRightGrid() {
  var xPlus = getIncrementedChunkCoords(1, 0);
  if (CHUNKS[xPlus] === null) {
    loadInfluencedChunk(xPlus, loadDownRightGrid);
  }
}

function loadDownRightGrid() {
  var xyPlus = getIncrementedChunkCoords(1, 1);
  if (CHUNKS[xyPlus] === null) {
    loadInfluencedChunk(xyPlus, stitchChunks);
  }
}

function stitchChunks() {
  var grid = buildBlankGrid();
  var row = CURRENT_BLOCK.row;
  var col = CURRENT_BLOCK.col;
  var currentGrid = CHUNKS[getChunkCoords()];
  var downGrid = CHUNKS[getIncrementedChunkCoords(0, 1)];
  var rightGrid = CHUNKS[getIncrementedChunkCoords(1, 0)];
  var downRightGrid = CHUNKS[getIncrementedChunkCoords(1, 1)];

  if (currentGrid === undefined) {
    console.log("tried to render currentGrid too early");
    return;
  } else if (downGrid === undefined) {
    console.log("tried to render downGrid too early");
    return;
  } else if (rightGrid === undefined) {
    console.log("tried to render rightGrid too early");
    return;
  } else if (downRightGrid === undefined) {
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
