function genMap() {
  gridSize = 100;
  grid = build_grid(gridSize);

  filled = new Set();
  potentialWater = new Set();
  potentialGrass = new Set();

  setSpawns(potentialGrass, gridSize);
  setSpawns(potentialWater, gridSize);
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

function setSpawns(potentialTiles, gridSize) {
  spawnCount = Math.floor((Math.random() * 10) + 1);
  for (var i = 0; i < spawnCount; i++) {
    var spawn = Math.floor(Math.random() * (gridSize - 1)).toString() + " " +
      Math.floor(Math.random() * (gridSize - 1)).toString();
    potentialTiles.add(spawn);
  }
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

function addTile(potentialTiles, filled, grid, terrain_id_number) {
  if (potentialTiles.size > 0) {
    var tileCoords = chooseTileCoords(potentialTiles);
    potentialTiles.delete(tileCoords);
    grid = addTileNumberToGrid(grid, terrain_id_number, tileCoords);
    filled.add(tileCoords);
    addPotentials(grid.length, filled, tileCoords, potentialTiles);
  }
}

function chooseTileCoords(potentialTiles) {
  size = potentialTiles.size;
  index = Math.floor(Math.random() * size);
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
  if (!filled.has((row + 1).toString() + " " + col.toString()) && row + 1 < gridSize) {
    potentialTiles.add((row + 1).toString() + " " + col.toString());
  }
  if (!filled.has((row - 1).toString() + " " + col.toString()) && row - 1 >= 0) {
    potentialTiles.add((row - 1).toString() + " " + col.toString());
  }
  if (!filled.has(row.toString() + " " + (col + 1).toString()) && col + 1 < gridSize) {
    potentialTiles.add(row.toString() + " " + (col + 1).toString());
  }
  if (!filled.has(row.toString() + " " + (col - 1).toString()) && col - 1 >= 0) {
    potentialTiles.add(row.toString() + " " + (col - 1).toString());
  }
}

function genMapHTML(grid) {
  mapHTML = "";
  for (row of grid) {
    for (item of row) {
      switch (item) {
        case 0:
          mapHTML += "<div class='water'></div>";
          break;
        case 1:
          mapHTML += "<div class='grass'></div>";
          break;
        default:
          mapHTML += "<div class='tile'>n</div>"
      }
    }
  }
  return mapHTML;
}

exports.addTileNumberToGrid = addTileNumberToGrid;
exports.genMap = genMap;
exports.getRow = getRow;
