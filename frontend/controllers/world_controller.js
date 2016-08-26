app.controller('worldController', function($scope, $http) {

  $scope.world = {
    chunkSize: 0,
    chunks: {},
    currentLocation: {x: 0, y: 0}
  };

  $scope.requestAndSetChunkSize = function(callback) {
    $http({
      method: 'POST',
      url: 'chunkSize.json',
      data: {'token': window.sessionStorage.accessToken},
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      $scope.world.chunkSize = res.data;
      callback();
    });
  };

  $scope.requestAndSetChunkSize(function() {
    $scope.mid = Math.ceil($scope.world.chunkSize / 2);
  });

  $scope.getCurrentChunkCoords = function(xInc, yInc) {
    var chunkX = Math.floor($scope.world.currentLocation.x / $scope.world.chunkSize) + xInc;
    var chunkY = Math.floor($scope.world.currentLocation.y / $scope.world.chunkSize) + yInc;
    return chunkX + ' ' + chunkY;
  };

  $scope.loadNearbyChunks = function() {
    var current = $scope.getCurrentChunkCoords(0, 0);
    var xPlus = $scope.getCurrentChunkCoords(1, 0);
    var yPlus = $scope.getCurrentChunkCoords(0, 1);
    var xyPlus = $scope.getCurrentChunkCoords(1, 1);
    var xMinus = $scope.getCurrentChunkCoords(-1, 0);
    var yMinus = $scope.getCurrentChunkCoords(0, -1);
    var xyMinus = $scope.getCurrentChunkCoords(-1, -1);
    var xMinusYPlus = $scope.getCurrentChunkCoords(-1, 1);
    var xPlusYMinus = $scope.getCurrentChunkCoords(1, -1);

    if ($scope.world.chunks[current] === undefined) {
      $scope.loadChunk(current, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[yPlus] === undefined) {
      $scope.loadChunk(yPlus, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[xPlus] === undefined) {
      $scope.loadChunk(xPlus, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[xyPlus] === undefined) {
      $scope.loadChunk(xyPlus, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[yMinus] === undefined) {
      $scope.loadChunk(yMinus, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[xMinus] === undefined) {
      $scope.loadChunk(xMinus, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[xyMinus] === undefined) {
      $scope.loadChunk(xyMinus, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[xPlusYMinus] === undefined) {
      $scope.loadChunk(xPlusYMinus, $scope.loadNearbyChunks);
    } else if ($scope.world.chunks[xMinusYPlus] === undefined) {
      $scope.loadChunk(xMinusYPlus, $scope.loadNearbyChunks);
    } else {
      $scope.getMapView();
    }
  };

  $scope.getPixel = function (x, y) {
    var chunkX = Math.floor(x / $scope.world.chunkSize);
    var chunkY = Math.floor(y / $scope.world.chunkSize);

    var row = y % $scope.world.chunkSize;
    var col = x % $scope.world.chunkSize;

    if (row < 0) {
      row += $scope.world.chunkSize;
    }
    if (col < 0) {
      col += $scope.world.chunkSize;
    }

    console.log(chunkX + ' ' + chunkY);
    return $scope.world.chunks[chunkX + ' ' + chunkY][row][col];
  };

  $scope.getMapView = function() {
    var chunk = $scope.buildBlankChunk();
    for (var i = 0; i < $scope.world.chunkSize; i++) {
      for (var j = 0; j < $scope.world.chunkSize; j++) {
        chunk[i][j] = $scope.getPixel(i + $scope.world.currentLocation.x - ($scope.mid -1),
                                      j + $scope.world.currentLocation.y - ($scope.mid -1));
      }
    }
    $('#map').html($scope.genChunkHTML(chunk));
  }

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
        callback();
      });
    }
  };

  $scope.move = function(rowInc, colInc) {

    $scope.world.currentLocation.x += colInc;
    $scope.world.currentLocation.y += rowInc;

    $http({
      method: 'POST',
      url: 'move',
      data: {
        token: window.sessionStorage.accessToken,
        chunkCoords: '',
        row: 0,
        col: 0
      },
      headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).then(function(res) {
      if (res.data) {
        $scope.loadNearbyChunks();
      } else {
        console.log('move not permitted');
      }
    });
  };

  $scope.genChunkHTML = function(chunk) {
    chunkHTML = '';
    var terrainCodesToNames = {0: 'water', 1: 'grass', 2: 'sand'};
    for (var row = 0; row < $scope.world.chunkSize; row++) {
      for (var col = 0; col < $scope.world.chunkSize; col++) {
        var terrain = terrainCodesToNames[chunk[row][col]];
        if (row === ($scope.mid - 1) && col === ($scope.mid - 1) ) { //draw player in center of map
          chunkHTML += '<div class=\"player-character\"></div>';
        } else {
          chunkHTML += '<div class=' + terrain + '></div>';
        } //end if player or terrain
      } //end for col
    } //end for row
    return chunkHTML;
  };

  $scope.$on('loadInitialChunk', function(event) {
    $('#map').css('width', $scope.world.chunkSize * 10);
    $scope.loadNearbyChunks();
  });

  $scope.$on('moveLeft', function(event) {
    $scope.move(-1, 0);
  });

  $scope.$on('moveUp', function(event) {
    $scope.move(0, -1);
  });

  $scope.$on('moveRight', function(event) {
    $scope.move(1, 0);
  });

  $scope.$on('moveDown', function(event) {
    $scope.move(0, 1);
  });

});
