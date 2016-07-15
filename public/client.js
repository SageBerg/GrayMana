var CHUNK_SIZE = 40;
var CHUNKS = {}; //the client's representation of the game map
var CURRENT_CHUNK = {"x": 0, "y": 0}; //the region of the map the player is on
var CURRENT_BLOCK = {"row": 0, "col": 0}; //player's locaiton within region

function login() {
  $.post("login", {username: $("#username").val(),
    password: $("#password").val()}, handleLogin);
}

function handleLogin(res) {
  window.sessionStorage.accessToken = res.token;
  $.post('map.json', {"token": window.sessionStorage.accessToken}, setup);
  $("#login_div").html(""); //removes login view
}

function setup() {
  loadInitialChunk(getChunkCoords(), renderInitialMap);
  bindKeys();
}

function getChunkCoords() {
  return CURRENT_CHUNK.x + " " + CURRENT_CHUNK.y;
}

function getIncrementedChunkCoords(xInc, yInc) {
  return (CURRENT_CHUNK.x + xInc) + " " + (CURRENT_CHUNK.y + yInc);
}

function loadInitialChunk(chunkCoords, callback) {
  if (CHUNKS[chunkCoords] === undefined) {
    $.post("map.json", {"token": window.sessionStorage.accessToken,
      "chunkCoords": getChunkCoords()},
    function(res) {
      CHUNKS[chunkCoords] = res;
      callback(); //can use to render map
    });
  }
}

function renderInitialMap() {
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
  stitchChunksPrep();
}

function changeCurrentBlock(row, col) {
  CURRENT_BLOCK.row += row;
  CURRENT_BLOCK.col += col;
  changeCurrentChunkY();
  changeCurrentChunkX();
}

function loadInfluencedChunk(chunkCoords, callback) {
  var presetPotentialTiles = getPresetPotentialTiles(chunkCoords);
  $.post("influenced_map.json", {"token": window.sessionStorage.accessToken,
    "presetPotentialTiles": presetPotentialTiles}, function(res) {
    CHUNKS[chunkCoords] = res;
    callback();
  });
}

function changeCurrentChunkY() {
  if (CURRENT_BLOCK.row < 0) {
    CURRENT_CHUNK.y -= 1;
    CURRENT_BLOCK.row = CHUNK_SIZE - 1;
  } else if (CURRENT_BLOCK.row > CHUNK_SIZE - 1) {
    CURRENT_CHUNK.y += 1;
    CURRENT_BLOCK.row = 0;
  }
}

function changeCurrentChunkX() {
  if (CURRENT_BLOCK.col < 0) {
    CURRENT_CHUNK.x -= 1;
    CURRENT_BLOCK.col = CHUNK_SIZE - 1;
  } else if (CURRENT_BLOCK.col > CHUNK_SIZE - 1) {
    CURRENT_CHUNK.x += 1;
    CURRENT_BLOCK.col = 0;
  }
}

function getPresetPotentialTiles(chunkCoords) {
  var presetPotentialTiles = [];

  var x = parseInt(chunkCoords.split(" ")[0]);
  var y = parseInt(chunkCoords.split(" ")[1]);

  var upInfluencerChunk = x + " " + (y - 1);
  var downInfluencerChunk = x + " " + (y + 1);
  var rightInfluencerChunk = (x + 1) + " " + y;
  var leftInfluencerChunk = (x - 1) + " " + y;

  upPresetPotentialTiles(upInfluencerChunk, presetPotentialTiles);
  downPresetPotentialTiles(downInfluencerChunk, presetPotentialTiles);
  rightPresetPotentialTiles(rightInfluencerChunk, presetPotentialTiles);
  leftPresetPotentialTiles(leftInfluencerChunk, presetPotentialTiles);

  return presetPotentialTiles;
}

function upPresetPotentialTiles (upInfluencerChunk, presetPotentialTiles) {
  if (CHUNKS[upInfluencerChunk] !== undefined) {
    var relevantRow = CHUNKS[upInfluencerChunk][CHUNK_SIZE - 1];
    addPresetPotentialTiles(relevantRow, presetPotentialTiles, "\"0 \" + i");
  }
}

function downPresetPotentialTiles (downInfluencerChunk, presetPotentialTiles) {
  if (CHUNKS[downInfluencerChunk] !== undefined) {
    var relevantRow = CHUNKS[downInfluencerChunk][0];
    addPresetPotentialTiles(relevantRow, presetPotentialTiles,
      "(CHUNK_SIZE - 1).toString() + \" \" + i");
  }
}

function rightPresetPotentialTiles (rightInfluencerChunk,
  presetPotentialTiles) {
  if (CHUNKS[rightInfluencerChunk] !== undefined) {
    var relevantCol = [];
    for (var i = 0; i < CHUNK_SIZE; i++) {
      try {
        relevantCol.push(CHUNKS[rightInfluencerChunk][i][0]);
      } catch(exception) {
        console.log(exception);
      }
    }
    addPresetPotentialTiles(relevantCol, presetPotentialTiles,
      "i + \" \" + (CHUNK_SIZE - 1).toString()");
  }
}

function leftPresetPotentialTiles (leftInfluencerChunk, presetPotentialTiles) {
  if (CHUNKS[leftInfluencerChunk] !== undefined) {
    var relevantCol = [];
    for (var i = 0; i < CHUNK_SIZE; i++) {
      try {
        relevantCol.push(CHUNKS[leftInfluencerChunk][i][CHUNK_SIZE - 1]);
      } catch(exception) {
        console.log(exception);
      }
    }
    addPresetPotentialTiles(relevantCol, presetPotentialTiles, "i + \" 0\"");
  }
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
  var terrainCodesToNames = {0: 'water', 1: 'grass', 2: 'sand'};
  var mid = Math.floor(CHUNK_SIZE / 2);
  for (var row = 0; row < CHUNK_SIZE; row++) {
    for (var col = 0; col < CHUNK_SIZE; col++) {
      var terrain = terrainCodesToNames[grid[row][col]];
      if (row === mid && col === mid) { //draw player in center of map
        mapHTML += "<div class='playerCharacter'></div>"
      } else {
        mapHTML += "<div class='" + terrain + "'></div>"
      } //end if player or terrain
    } //end for col
  } //end for row
  return mapHTML;
}

function stitchChunksPrep() {
  var current = getChunkCoords();
  var xPlus = getIncrementedChunkCoords(1, 0);
  var yPlus = getIncrementedChunkCoords(0, 1);
  var xyPlus = getIncrementedChunkCoords(1, 1);

  if (CHUNKS[current] === undefined) {
    loadInfluencedChunk(current, stitchChunksPrep);
  } else if (CHUNKS[yPlus] === undefined) {
    loadInfluencedChunk(yPlus, stitchChunksPrep);
  } else if (CHUNKS[xPlus] === undefined) {
    loadInfluencedChunk(xPlus, stitchChunksPrep);
  } else if (CHUNKS[xyPlus] === undefined) {
    loadInfluencedChunk(xyPlus, stitchChunksPrep);
  } else {
    stitchChunks();
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
