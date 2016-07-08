var CURRENT_CHUNK = {"row": 49, "col": 49};
var CURRENT_BLOCK = {"row": 0, "col": 0};
var CHUNKS = [];
for (var i = 0; i < 100; i++) {
  CHUNKS.push([]);
  for (var j = 0; j < 100; j++) {
    rowOfBlocks = [];
    CHUNKS[CHUNKS.length - 1].push(rowOfBlocks);
  }
}

bindKeys();

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
  //get a new chunk if needed
  //rerender the view
}

function changeCurrentBlock(row, col) {
  CURRENT_BLOCK.row += row;
  CURRENT_BLOCK.col += col;
  if (CURRENT_BLOCK.row < 0) {

  }
  console.log(CURRENT_BLOCK);
}

function changeCurrentChunk(row, col) {

}


$.get("map.json", handleChunk);

function stichMaps() {
  if (true) {
  }
}

// should put the new chunk into CHUNKS at the correct coords
function handleChunk(res) {
  $("#map").html(res);
}
