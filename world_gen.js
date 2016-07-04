function genMap() {
  gridSize = 100;
  grid = build_grid(gridSize);

  filled = new Set();
  potentialWater = new Set();
  potentialGrass = new Set();

  setSpawns(potentialGrass, gridSize);
  setSpawns(potentialWater, gridSize);
  //TODO add different spawn rates for tiles
  while (potentialGrass.size > 0 || potentialWater.size > 0) {
    if (potentialGrass.size > 0) {
      addTile(potentialGrass, filled, grid, 1);
    }
    if (potentialWater.size > 0) {
      addTile(potentialWater, filled, grid, 0);
    }
  }
  return genMapHTML(grid);
}

function build_grid(gridSize) {
  grid = [];
  for (var i = 0; i < gridSize; i++) {
    grid.push([]);
    for (var j = 0; j < gridSize; j++) {
      grid[i].push(null);
    }
  }
  return grid;
}

//TODO replace this hardcoding with user supplied parameters
function setSpawns(potentialTiles, gridSize) {
  spawnCount = randInt(10) + 1;
  for (var i = 0; i < spawnCount; i++) {
    var spawn = randInt(gridSize - 1).toString() + " " +
      randInt(gridSize - 1).toString();
    potentialTiles.add(spawn);
  }
}

function randInt(upperBound) {
  return Math.floor(Math.random() * upperBound);
}

function addTile(potentialTiles, filled, grid, terrain_id_number) {
  var tileCoords = chooseTileCoords(potentialTiles);
  potentialTiles.delete(tileCoords);
  grid = addTileNumberToGrid(grid, terrain_id_number, tileCoords);
  filled.add(tileCoords);
  addPotentials(grid.length, filled, tileCoords, potentialTiles);
}

function chooseTileCoords(potentialTiles) {
  size = potentialTiles.size;
  index = randInt(size);
  var i = 0;
  for (tileCoords of potentialTiles) {
    if (i === index) {
      return tileCoords
    }
    i++
  }
}

function addTileNumberToGrid(grid, tileNumber, tileCoords) {
  grid[getRow(tileCoords)][getCol(tileCoords)] = tileNumber;
  return grid;
}

function getRow(coords) {
  return parseInt(coords.split(" ")[0])
}

function getCol(coords) {
  return parseInt(coords.split(" ")[1])
}

function addPotentials(gridSize, filled, tileCoords, potentialTiles) {
  var row = getRow(tileCoords);
  var col = getCol(tileCoords);

  var moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (move of moves) {
    var modCoords = coordInc(row, col, move[0], move[1])
    addPotential(modCoords, filled, gridSize, potentialTiles);
  }
}

function coordInc(row, col, rowMod, colMod) {
  return (row + rowMod).toString() + " " + (col + colMod).toString();
}

function addPotential(modCoords, filled, gridSize, potentialTiles) {
  if (!filled.has(modCoords) && getRow(modCoords) >= 0 &&
                                getRow(modCoords) < gridSize &&
                                getCol(modCoords) >= 0 &&
                                getCol(modCoords) < gridSize) {
    potentialTiles.add(modCoords);
  }
}

function genMapHTML(grid) {
  mapHTML = "";
  var terrainCodesToNames = {
    0: 'water', 1: 'grass'
  };
  for (row of grid) {
    for (terrainCode of row) {
      var terrain = terrainCodesToNames[terrainCode];
      if (terrain !== 'undefined') {
        mapHTML += "<div class='" + terrain + "'></div>"
      } else {
        mapHTML += "<div class='tile'>n</div>"
      }
    }
  }
  return mapHTML;
}

exports.addTileNumberToGrid = addTileNumberToGrid;
exports.chooseTileCoords = chooseTileCoords;
exports.genMap = genMap;
exports.getMapHTML = genMapHTML;
exports.getRow = getRow;
