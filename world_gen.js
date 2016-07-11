function genMap(presetPotentialTiles) {
  gridSize = 40;
  var grid = build_grid(gridSize);

  console.log("#############");
  console.log(presetPotentialTiles['list[]']);
  console.log("#############");

  var filled = new Set();
  var potentialTerrains = {"water": new Set(), "grass": new Set(),
    "sand": new Set()};
  try {
    loadPresetPotentialTiles(presetPotentialTiles['list[]'], potentialTerrains);
  } catch (e) {
    console.log(e);
  }
  for (var key in potentialTerrains) {
    if (potentialTerrains.hasOwnProperty(key)) {
       setSpawns(potentialTerrains[key], gridSize);
    }
  }
  populateMap(potentialTerrains, filled, grid);
  return grid;
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

function loadPresetPotentialTiles(presetPotentialTiles, potentialTerrains) {
  console.log(potentialTerrains["water"]);
  for (var i = 0; i < presetPotentialTiles.length; i++) {
    var parsedPresetPotentialTiles = presetPotentialTiles[i].split(" ");
    var row = parsedPresetPotentialTiles[0];
    var col = parsedPresetPotentialTiles[1];
    var terrain = parsedPresetPotentialTiles[2];
    potentialTerrains[terrain].add(row + " " + col);
  }
  console.log(potentialTerrains["water"]);
}

//TODO replace this hardcoding with user-supplied parameters
function setSpawns(potentialTiles, gridSize) {
  var spawnCount = randInt(10) + 1;
  for (var i = 0; i < spawnCount; i++) {
    var spawn = randInt(gridSize - 1).toString() + " " +
      randInt(gridSize - 1).toString();
    potentialTiles.add(spawn);
  }
}

function populateMap(potentials, filled, grid) {
  var terrainNamesToCodes = {
    'water': 0, 'grass': 1, 'sand': 2
  };
  while (potentialsRemaining(potentials)) {
    for (var key in potentials) {
      if (potentials.hasOwnProperty(key)) {
        if (potentials[key].size > 0) {
          addTile(potentials[key], filled, grid, terrainNamesToCodes[key]);
        }
      }
    }
  } //end while
}

function potentialsRemaining(potentials) {
  for (var key in potentials) {
    if (potentials.hasOwnProperty(key)) {
      if (potentials[key].size > 0) {
        return true;
      }
    }
  }
  return false;
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

exports.addTileNumberToGrid = addTileNumberToGrid;
exports.chooseTileCoords = chooseTileCoords;
exports.genMap = genMap;
exports.getRow = getRow;
