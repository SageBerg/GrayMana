function getRequestedChunkCoords(rowInc, colInc) {
  if (world.currentBlock.row + rowInc < 0) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else if (world.currentBlock.row + rowInc >= world.chunkSize) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else if (world.currentBlock.col + colInc < 0) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else if (world.currentBlock.col + colInc >= world.chunkSize) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else {
    return getChunkCoords();
  }
}

function stitchChunksPrep() {
  var current = getChunkCoords();
  var xPlus = getIncrementedChunkCoords(1, 0);
  var yPlus = getIncrementedChunkCoords(0, 1);
  var xyPlus = getIncrementedChunkCoords(1, 1);

  if (CHUNKS[current] === undefined) {
    loadChunk(current, stitchChunksPrep);
  } else if (CHUNKS[yPlus] === undefined) {
    loadChunk(yPlus, stitchChunksPrep);
  } else if (CHUNKS[xPlus] === undefined) {
    loadChunk(xPlus, stitchChunksPrep);
  } else if (CHUNKS[xyPlus] === undefined) {
    loadChunk(xyPlus, stitchChunksPrep);
  } else {
    stitchChunks();
  }
}

function loadChunk(chunkCoords, callback) {
  if (CHUNKS[chunkCoords] === undefined) {
    $.post('chunk.json', {'token': window.sessionStorage.accessToken,
      'chunkCoords': chunkCoords},
    function(res) {
      CHUNKS[chunkCoords] = res;
      callback(); //can use to render chunk
    });
  }
}

function move(rowInc, colInc) {
  refreshToken(); //while the players is active keep the token refreshed

  var chunkY = world.currentChunk.y + rowInc;
  var chunkX = world.currentChunk.x + colInc;
  var reqChunkCoords = getRequestedChunkCoords();

  var reqRow = (world.currentBlock.row + rowInc) % world.chunkSize;
  var reqCol = (world.currentBlock.col + colInc) % world.chunkSize;

  if (reqRow < 0) {
    reqRow += world.chunkSize;
  }
  if (reqCol < 0) {
    reqCol += world.chunkSize;
  }

  $.post('move', {chunkCoords: reqChunkCoords, row: reqRow,
    col: reqCol, token: window.sessionStorage.accessToken},
    function(res) {
    if (res) {
      changeCurrentBlock(rowInc, colInc);
      stitchChunksPrep();
    } else {
      console.log('move not permitted');
    } //end if move allowed
  }); //end post
}
