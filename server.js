//var React = require('react');
//var ReactDomServer = require('react-dom/server');
var express = require('express');
var http = require('http');

var app = express();
var server = http.createServer(app);
server.listen(3001);
app.use(express.static(__dirname));

app.get('/map.json', respondWithMap);

function respondWithMap(req, res) {
  res.json(genMap());
}

function genMap() {
  gridSize = 100;
  grid = [];
  for (var i = 0; i < gridSize; i++) {
    grid.push([]);
    for (var j = 0; j < gridSize; j++) {
      grid[i].push(null);
    }
  }

  filled = new Set();
  potentialWater = new Set();
  potentialGrass = new Set();

  grassSpawns = Math.floor((Math.random() * 10) + 1);
  waterSpawns = Math.floor((Math.random() * 10) + 1);

  for (var i = 0; i < grassSpawns; i++) {
     var spawn = Math.floor(Math.random() * (gridSize - 1)).toString() + " " +
       Math.floor(Math.random() * (gridSize - 1)).toString();
     potentialGrass.add(spawn);
  }

  for (var i = 0; i < waterSpawns; i++) {
     var spawn = Math.floor(Math.random() * (gridSize - 1)).toString() + " " +
       Math.floor(Math.random() * (gridSize - 1)).toString();
     potentialWater.add(spawn);
  }

  while (potentialGrass.size > 0 || potentialWater.size > 0) {
    if (potentialGrass.size > 0) {
      grassCoords = chooseAndRemoveTileCoords(potentialGrass);
      addTileNumberToGrid(grid, 1, grassCoords);
      filled.add(grassCoords);
      addPotentials(gridSize, filled, grassCoords, potentialGrass);
    }

    if (potentialWater.size > 0) {
      waterCoords = chooseAndRemoveTileCoords(potentialWater);
      addTileNumberToGrid(grid, 0, waterCoords);
      filled.add(waterCoords);
      addPotentials(gridSize, filled, waterCoords, potentialWater);
    }
  }
  return genMapView(grid);
}

function chooseAndRemoveTileCoords(potentialTiles) {
  size = potentialTiles.size;
  index = Math.floor(Math.random() * size);
  var i = 0;
  for (tileCoords of potentialTiles) {
    if (i === index) {
      potentialTiles.delete(tileCoords);
      return tileCoords
    }
    i++
  }
}

function addTileNumberToGrid(grid, tileNumber, tileCoords) {
  grid[getRow(tileCoords)][getCol(tileCoords)] = tileNumber;
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

function genMapView(grid) {
  map_html = "";
  for (row of grid) {
    for (item of row) {
      switch (item) {
        case 0:
          map_html += "<div class='water'></div>";
          break;
        case 1:
          map_html += "<div class='grass'></div>";
          break;
        default:
          map_html += "<div class='tile'>n</div>"
      }
    }
  }
  return map_html;
}
