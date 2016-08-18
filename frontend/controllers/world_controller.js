app.controller('worldController', function($scope) {
  $scope.world = {
    chunkSize: 40,
    chunks: {},

    //represent the player's view, not necessarily where their character is
    currentBlock: {row: 0, col: 0},
    currentChunk: {x: 0, y: 0}
  };

  $scope.getChunkCoords = function() {
    return world.currentChunk.x + ' ' + world.currentChunk.y;
  };

  $scope.getIncrementedChunkCoords = function(xInc, yInc) {
    return (world.currentChunk.x + xInc) + ' ' +
      (world.currentChunk.y + yInc);
  };

  $scope.changeCurrentBlock = function(row, col) {
    world.currentBlock.row += row;
    world.currentBlock.col += col;
    changeCurrentChunkY();
    changeCurrentChunkX();
  };

  $scope.changeCurrentChunkY = function() {
    if (world.currentBlock.row < 0) {
      world.currentChunk.y -= 1;
      world.currentBlock.row = world.chunkSize - 1;
    } else if (world.currentBlock.row > world.chunkSize - 1) {
      world.currentChunk.y += 1;
      world.currentBlock.row = 0;
    }
  };

  $scope.changeCurrentChunkX = function() {
    if (world.currentBlock.col < 0) {
      world.currentChunk.x -= 1;
      world.currentBlock.col = world.chunkSize - 1;
    } else if (world.currentBlock.col > world.chunkSize - 1) {
      world.currentChunk.x += 1;
      world.currentBlock.col = 0;
    }
  };
});
