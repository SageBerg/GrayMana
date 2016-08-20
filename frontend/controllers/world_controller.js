app.controller('worldController', function($scope, $http) {
  $scope.world = {
    chunkSize: 40,
    chunks: {},

    //represent the player's view, not necessarily where their character is
    currentBlock: {row: 20, col: 20},
    currentChunk: {x: 0, y: 0}
  };

  $scope.getChunkCoords = function() {
    return $scope.world.currentChunk.x + ' ' + $scope.world.currentChunk.y;
  };

  $scope.getIncrementedChunkCoords = function(xInc, yInc) {
    return ($scope.world.currentChunk.x + xInc) + ' ' +
      ($scope.world.currentChunk.y + yInc);
  };

  $scope.changeCurrentBlock = function(row, col) {
    $scope.world.currentBlock.row += row;
    $scope.world.currentBlock.col += col;
    $scope.changeCurrentChunkY();
    $scope.changeCurrentChunkX();
  };

  $scope.changeCurrentChunkY = function() {
    if ($scope.world.currentBlock.row < 0) {
      $scope.world.currentChunk.y -= 1;
      $scope.world.currentBlock.row = $scope.world.chunkSize - 1;
    } else if ($scope.world.currentBlock.row > $scope.world.chunkSize - 1) {
      $scope.world.currentChunk.y += 1;
      $scope.world.currentBlock.row = 0;
    }
  };

  $scope.changeCurrentChunkX = function() {
    if ($scope.world.currentBlock.col < 0) {
      $scope.world.currentChunk.x -= 1;
      $scope.world.currentBlock.col = $scope.world.chunkSize - 1;
    } else if ($scope.world.currentBlock.col > $scope.world.chunkSize - 1) {
      $scope.world.currentChunk.x += 1;
      $scope.world.currentBlock.col = 0;
    }
  };

  $scope.getRequestedChunkCoords = function(rowInc, colInc) {
    if ($scope.world.currentBlock.row + rowInc < 0) {
      return $scope.getIncrementedChunkCoords(colInc, rowInc);
    } else if ($scope.world.currentBlock.row + rowInc >= $scope.world.chunkSize) {
      return $scope.getIncrementedChunkCoords(colInc, rowInc);
    } else if ($scope.world.currentBlock.col + colInc < 0) {
      return $scope.getIncrementedChunkCoords(colInc, rowInc);
    } else if ($scope.world.currentBlock.col + colInc >= $scope.world.chunkSize) {
      return $scope.getIncrementedChunkCoords(colInc, rowInc);
    } else {
      return $scope.getChunkCoords();
    }
  };

  $scope.stitchChunksPrep = function() {
    var current = $scope.getChunkCoords();
    var xPlus = $scope.getIncrementedChunkCoords(1, 0);
    var yPlus = $scope.getIncrementedChunkCoords(0, 1);
    var xyPlus = $scope.getIncrementedChunkCoords(1, 1);

    if ($scope.world.chunks[current] === undefined) {
      $scope.loadChunk(current, $scope.stitchChunksPrep);
    } else if ($scope.world.chunks[yPlus] === undefined) {
      $scope.loadChunk(yPlus, $scope.stitchChunksPrep);
    } else if ($scope.world.chunks[xPlus] === undefined) {
      $scope.loadChunk(xPlus, $scope.stitchChunksPrep);
    } else if ($scope.world.chunks[xyPlus] === undefined) {
      $scope.loadChunk(xyPlus, $scope.stitchChunksPrep);
    } else {
      $scope.stitchChunks();
    }
  };

  $scope.stitchChunks = function() {
    var chunk = $scope.buildBlankChunk();
    var currentChunk = $scope.world.chunks[$scope.getChunkCoords()];
    var downChunk = $scope.world.chunks[$scope.getIncrementedChunkCoords(0, 1)];
    var rightChunk = $scope.world.chunks[$scope.getIncrementedChunkCoords(1, 0)];
    var downRightChunk = $scope.world.chunks[$scope.getIncrementedChunkCoords(1, 1)];

    for (var i = 0; i < $scope.world.chunkSize; i++) {
      for (var j = 0; j < $scope.world.chunkSize; j++) {
        var adjustedRow = i + $scope.world.currentBlock.row;
        var adjustedCol = j + $scope.world.currentBlock.col;
        if (adjustedRow < $scope.world.chunkSize && adjustedCol < $scope.world.chunkSize) {
          chunk[i][j] = currentChunk[adjustedRow][adjustedCol];
        } else if (adjustedRow >= $scope.world.chunkSize && adjustedCol < $scope.world.chunkSize) {
          chunk[i][j] = downChunk[adjustedRow - $scope.world.chunkSize][adjustedCol];
        } else if (adjustedRow < $scope.world.chunkSize && adjustedCol >= $scope.world.chunkSize) {
          chunk[i][j] = rightChunk[adjustedRow][adjustedCol - $scope.world.chunkSize];
        } else if (adjustedRow >= $scope.world.chunkSize && adjustedCol >= $scope.world.chunkSize) {
          chunk[i][j] = downRightChunk[adjustedRow - $scope.world.chunkSize][adjustedCol - $scope.world.chunkSize];
        }
      } //end for i loop
    } //end for j loop
    $('#map').html($scope.genChunkHTML(chunk));
  };

  $scope.buildBlankChunk = function() {
    var chunk = [];
    for (var i = 0; i < $scope.world.chunkSize; i++) {
      chunk.push([]);
      for (var j = 0; j < $scope.world.chunkSize; j++) {
        chunk[i].push(null);
      }
    }
    return chunk;
  };

  $scope.loadChunk = function(chunkCoords, callback) {
    if ($scope.world.chunks[chunkCoords] === undefined) {
      $http({
        method: 'POST',
        url: 'chunk.json',
        data: {'token': window.sessionStorage.accessToken, 'chunkCoords': chunkCoords},
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(res) {
        $scope.world.chunks[chunkCoords] = res.data;
        callback(); //can use to render chunk
      });
    }
  };

  $scope.move = function(rowInc, colInc) {
    //refreshToken(); //while the players is active keep the token refreshed

    var chunkY = $scope.world.currentChunk.y + rowInc;
    var chunkX = $scope.world.currentChunk.x + colInc;
    var reqChunkCoords = $scope.getRequestedChunkCoords();

    var reqRow = ($scope.world.currentBlock.row + rowInc) % $scope.world.chunkSize;
    var reqCol = ($scope.world.currentBlock.col + colInc) % $scope.world.chunkSize;

    if (reqRow < 0) {
      reqRow += $scope.world.chunkSize;
    }
    if (reqCol < 0) {
      reqCol += $scope.world.chunkSize;
    }

    $http({
      method: 'POST',
      url: 'move',
      data: {
        token: window.sessionStorage.accessToken,
        chunkCoords: reqChunkCoords,
        row: reqRow,
        col: reqCol
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      if (res.data) {
        $scope.changeCurrentBlock(rowInc, colInc);
        $scope.stitchChunksPrep();
      } else {
        console.log('move not permitted');
      }
    });
  };

  $scope.renderInitialChunk = function() {
    $('#map').css('width', $scope.world.chunkSize * 10);
    $('#map').html($scope.genChunkHTML($scope.world.chunks[$scope.getChunkCoords()]));
  };

  $scope.genChunkHTML = function(chunk) {
    chunkHTML = '';
    var terrainCodesToNames = {0: 'water', 1: 'grass', 2: 'sand'};
    for (var row = 0; row < $scope.world.chunkSize; row++) {
      for (var col = 0; col < $scope.world.chunkSize; col++) {
        var terrain = terrainCodesToNames[chunk[row][col]];
        if (row === $scope.MID && col === $scope.MID) { //draw player in center of map
          chunkHTML += '<div class=\"player-character\"></div>';
        } else {
          chunkHTML += '<div class=' + terrain + '></div>';
        } //end if player or terrain
      } //end for col
    } //end for row
    return chunkHTML;
  };

  try {
    $scope.MID = Math.floor($scope.world.chunkSize / 2);
  } catch (exception) {
    console.log(exception);
  }

  $scope.$on('loadInitialChunk', function(event) {
    $scope.loadChunk($scope.getChunkCoords(), $scope.renderInitialChunk);
  });

  $scope.$on('moveLeft', function(event) {
    $scope.printPlayerLocation();
    $scope.move(0, -1);
  });

  $scope.$on('moveUp', function(event) {
    $scope.printPlayerLocation();
    $scope.move(-1, 0);
  });

  $scope.$on('moveRight', function(event) {
    $scope.printPlayerLocation();
    $scope.move(0, 1);
  });

  $scope.$on('moveDown', function(event) {
    $scope.printPlayerLocation();
    $scope.move(1, 0);
  });

  $scope.printPlayerLocation = function() {};

});
