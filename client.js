var CHUNK_SIZE = 100;
var CURRENT_CHUNK = {"row": 49, "col": 49};
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
  loadChunk();
  bindKeys();
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
  loadChunk();
  renderMap();
}

function changeCurrentBlock(row, col) {
  CURRENT_BLOCK.row += row;
  CURRENT_BLOCK.col += col;
  changeCurrentChunk("row");
  changeCurrentChunk("col");
  console.log("CURRENT_BLOCK: " + CURRENT_BLOCK.row + " " + CURRENT_BLOCK.col);
  console.log("CURRENT_CHUNK: " + CURRENT_CHUNK.row + " " + CURRENT_CHUNK.col);
  console.log("\n");
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

function loadChunk() {
  if (CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col] === null) {
    console.log("fetching chunk");
    $.get("map.json", handleChunk);
  }
}

function handleChunk(res) {
  var grid = res;
  CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col] = grid;
  renderMap();
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
        if (r === CURRENT_BLOCK.row && c === CURRENT_BLOCK.col) {
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

function renderMap() {
  var grid = CHUNKS[CURRENT_CHUNK.row][CURRENT_CHUNK.col];
  $("#map").html(genMapHTML(grid));
}
