function genMap(chunkCoords) {
  var presetPotentialTiles = getPresetPotentialTiles(chunkCoords);
  gridSize = 40;
  var grid = build_grid(gridSize);

  var filled = new Set();
  var potentialTerrains = {"water": new Set(), "grass": new Set(),
    "sand": new Set()};
  try {
    loadPresetPotentialTiles(presetPotentialTiles, potentialTerrains);
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
  for (var i = 0; i < presetPotentialTiles.length; i++) {
    var parsedPresetPotentialTiles = presetPotentialTiles[i].split(" ");
    var row = parsedPresetPotentialTiles[0];
    var col = parsedPresetPotentialTiles[1];
    var terrain = parsedPresetPotentialTiles[2];
    potentialTerrains[terrain].add(row + " " + col);
  }
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
  var terrainNamesToCodes = {'water': 0, 'grass': 1, 'sand': 2};
  while (potentialsRemaining(potentials)) {
    for (var key in potentials) {
      if (potentials.hasOwnProperty(key)) {
        if (potentials[key].size > 0) {
          addTile(potentials[key], filled, grid, terrainNamesToCodes[key]);
        }
      } //end if
    } //end for
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

exports.addTileNumberToGrid = addTileNumberToGrid;
exports.chooseTileCoords = chooseTileCoords;
exports.genMap = genMap;
exports.getRow = getRow;
