var CHUNK_SIZE = 20;
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

setup();

function setup() {
  loadChunk(CURRENT_CHUNK.row, CURRENT_CHUNK.col);
  bindKeys();
  setTimeout(renderMap, 700);
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
  changeCurrentBlock(rowInc, colInc);
  if (CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col] === null) {
    loadChunk(CURRENT_CHUNK.row, CURRENT_CHUNK.col);
    setTimeout(function() {
      waitForStichPrep();
    }, 700);
  } else {
      waitForStichPrep();
  }
}

function waitForStichPrep() {
  var grid = stitchChunksPrep(buildBlankGrid())
  if (CHUNKS[CURRENT_CHUNK.row - 1][CURRENT_CHUNK.col] === null ||
      CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col + 1] === null ||
      CHUNKS[CURRENT_CHUNK.row - 1][CURRENT_CHUNK.col + 1] === null) {
    setTimeout(function() {
      $("#map").html(genMapHTML(grid));
    }, 1000);
  } else {
    $("#map").html(genMapHTML(grid));
  }
}

function changeCurrentBlock(row, col) {
  CURRENT_BLOCK.row += row;
  CURRENT_BLOCK.col += col;
  changeCurrentChunk("row");
  changeCurrentChunk("col");
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

function loadChunk(row, col) {
  if (CHUNKS[row][col] === null) {
    $.get("map.json", function(res) {
      CHUNKS[row][col] = res;
    });
  }
}

function renderMap() {
  $("#map").css("width", CHUNK_SIZE * 10);
  $("#map").html(genMapHTML(CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col]));
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
        if (r === Math.floor(CHUNK_SIZE / 2) && c === Math.floor(CHUNK_SIZE / 2)) { //draw player in center of map
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

function stitchChunksPrep(grid) {
  if (CHUNKS[CURRENT_CHUNK.row - 1][CURRENT_CHUNK.col] === null ||
      CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col + 1] === null ||
      CHUNKS[CURRENT_CHUNK.row - 1][CURRENT_CHUNK.col + 1] === null) {
    loadChunk(CURRENT_CHUNK.row - 1, CURRENT_CHUNK.col);
    loadChunk(CURRENT_CHUNK.row, CURRENT_CHUNK.col + 1);
    loadChunk(CURRENT_CHUNK.row - 1, CURRENT_CHUNK.col + 1);
    setTimeout(function() {
      stitchChunks(grid);
    }, 1000);
  } else {
    stitchChunks(grid);
  }
  return grid;
}

function stitchChunks(grid) {
  var row = CURRENT_BLOCK.row;
  var col = CURRENT_BLOCK.col;
  var currentGrid = CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col];
  var downGrid = CHUNKS[CURRENT_CHUNK.row + 1][CURRENT_CHUNK.col];
  var rightGrid = CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col + 1];
  var downRightGrid = CHUNKS[CURRENT_CHUNK.row + 1][CURRENT_CHUNK.col + 1];
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
        grid[i][j] = downRightGrid[adjustedRow - CHUNK_SIZE][adjustedCol - CHUNK_SIZE];
      }
    } //end for i loop
  } //end for j loop
  return grid;
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
