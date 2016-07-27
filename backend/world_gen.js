var WorldGen = function(chunkSize, chunks, database) {
  this.chunkSize = chunkSize
  this.chunks = chunks;
  this.database = database;
};

WorldGen.prototype.genChunk = function(chunkCoords) {
  var presetPotentialTiles = this.getPresetPotentialTiles(chunkCoords);
  var chunkSize = 40;
  var chunk = this.build_chunk(chunkSize);

  var filled = new Set();
  var potentialTerrains = {'water': new Set(), 'grass': new Set(),
    'sand': new Set()};
  try {
    this.loadPresetPotentialTiles(presetPotentialTiles, potentialTerrains);
  } catch (e) {
    console.log(e);
  }
  for (var key in potentialTerrains) {
    if (potentialTerrains.hasOwnProperty(key)) {
       this.setSpawns(potentialTerrains[key], chunkSize);
    }
  }
  this.populateChunk(potentialTerrains, filled, chunk);
  this.database.saveChunkToDB(chunkCoords, chunk);
  return chunk;
}

WorldGen.prototype.build_chunk = function(chunkSize) {
  chunk = [];
  for (var i = 0; i < chunkSize; i++) {
    chunk.push([]);
    for (var j = 0; j < chunkSize; j++) {
      chunk[i].push(null);
    }
  }
  return chunk;
}

WorldGen.prototype.loadPresetPotentialTiles = function(presetPotentialTiles,
  potentialTerrains) {
  for (var i = 0; i < presetPotentialTiles.length; i++) {
    var parsedPresetPotentialTiles = presetPotentialTiles[i].split(' ');
    var row = parsedPresetPotentialTiles[0];
    var col = parsedPresetPotentialTiles[1];
    var terrain = parsedPresetPotentialTiles[2];
    potentialTerrains[terrain].add(row + ' ' + col);
  }
}

//TODO replace this hardcoding with user-supplied parameters
WorldGen.prototype.setSpawns = function(potentialTiles, chunkSize) {
  var spawnCount = this.randInt(10) + 1;
  for (var i = 0; i < spawnCount; i++) {
    var spawn = this.randInt(chunkSize - 1).toString() + ' ' +
      this.randInt(chunkSize - 1).toString();
    potentialTiles.add(spawn);
  }
}

WorldGen.prototype.populateChunk = function(potentials, filled, chunk) {
  var terrainNamesToCodes = {'water': 0, 'grass': 1, 'sand': 2};
  while (this.potentialsRemaining(potentials)) {
    for (var key in potentials) {
      if (potentials.hasOwnProperty(key)) {
        if (potentials[key].size > 0) {
          this.addTile(potentials[key], filled, chunk, terrainNamesToCodes[key]);
        }
      } //end if
    } //end for
  } //end while
}


WorldGen.prototype.potentialsRemaining = function(potentials) {
  for (var key in potentials) {
    if (potentials.hasOwnProperty(key)) {
      if (potentials[key].size > 0) {
        return true;
      }
    }
  }
  return false;
}

WorldGen.prototype.randInt = function(upperBound) {
  return Math.floor(Math.random() * upperBound);
}

WorldGen.prototype.addTile = function(potentialTiles, filled, chunk,
  terrain_id_number) {
  var tileCoords = this.chooseTileCoords(potentialTiles);
  potentialTiles.delete(tileCoords);
  chunk = this.addTileNumberToChunk(chunk, terrain_id_number, tileCoords);
  filled.add(tileCoords);
  this.addPotentials(chunk.length, filled, tileCoords, potentialTiles);
}

WorldGen.prototype.chooseTileCoords = function(potentialTiles) {
  size = potentialTiles.size;
  index = this.randInt(size);
  var i = 0;
  for (tileCoords of potentialTiles) {
    if (i === index) {
      return tileCoords
    }
    i++
  }
}

WorldGen.prototype.addTileNumberToChunk = function(chunk, tileNumber,
  tileCoords) {
  chunk[this.getRow(tileCoords)][this.getCol(tileCoords)] = tileNumber;
  return chunk;
}

WorldGen.prototype.getRow = function(coords) {
  return parseInt(coords.split(' ')[0])
}

WorldGen.prototype.getCol = function(coords) {
  return parseInt(coords.split(' ')[1])
}

WorldGen.prototype.addPotentials = function(chunkSize, filled, tileCoords,
  potentialTiles) {
  var row = this.getRow(tileCoords);
  var col = this.getCol(tileCoords);

  var moves = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (move of moves) {
    var modCoords = this.coordInc(row, col, move[0], move[1])
    this.addPotential(modCoords, filled, chunkSize, potentialTiles);
  }
}

WorldGen.prototype.coordInc = function(row, col, rowMod, colMod) {
  return (row + rowMod).toString() + ' ' + (col + colMod).toString();
}

WorldGen.prototype.addPotential = function(modCoords, filled, chunkSize,
  potentialTiles) {
  if (!filled.has(modCoords) && this.getRow(modCoords) >= 0 &&
    this.getRow(modCoords) < chunkSize &&
    this.getCol(modCoords) >= 0 &&
    this.getCol(modCoords) < chunkSize) {
    potentialTiles.add(modCoords);
  }
}

WorldGen.prototype.getPresetPotentialTiles = function(chunkCoords) {
  var presetPotentialTiles = [];

  var x = parseInt(chunkCoords.split(' ')[0]);
  var y = parseInt(chunkCoords.split(' ')[1]);

  var upInfluencerChunk = x + ' ' + (y - 1);
  var downInfluencerChunk = x + ' ' + (y + 1);
  var rightInfluencerChunk = (x + 1) + ' ' + y;
  var leftInfluencerChunk = (x - 1) + ' ' + y;

  this.upPresetPotentialTiles(upInfluencerChunk, presetPotentialTiles);
  this.downPresetPotentialTiles(downInfluencerChunk, presetPotentialTiles);
  this.rightPresetPotentialTiles(rightInfluencerChunk, presetPotentialTiles);
  this.leftPresetPotentialTiles(leftInfluencerChunk, presetPotentialTiles);

  return presetPotentialTiles;
}

WorldGen.prototype.upPresetPotentialTiles = function(upInfluencerChunk,
  presetPotentialTiles) {
  if (this.chunks[upInfluencerChunk] !== undefined) {
    var relevantRow = this.chunks[upInfluencerChunk][this.chunkSize - 1];
    this.addPresetPotentialTiles(relevantRow, presetPotentialTiles, '\"0 \" + i');
  }
}

WorldGen.prototype.downPresetPotentialTiles = function(downInfluencerChunk,
  presetPotentialTiles) {
  if (this.chunks[downInfluencerChunk] !== undefined) {
    var relevantRow = this.chunks[downInfluencerChunk][0];
    this.addPresetPotentialTiles(relevantRow, presetPotentialTiles,
      '(this.chunkSize - 1).toString() + \" \" + i');
  }
}

WorldGen.prototype.rightPresetPotentialTiles = function(rightInfluencerChunk,
  presetPotentialTiles) {
  if (this.chunks[rightInfluencerChunk] !== undefined) {
    var relevantCol = [];
    for (var i = 0; i < this.chunkSize; i++) {
      try {
        relevantCol.push(this.chunks[rightInfluencerChunk][i][0]);
      } catch(exception) {
        console.log(exception);
      }
    }
    this.addPresetPotentialTiles(relevantCol, presetPotentialTiles,
      'i + \" \" + (this.chunkSize - 1).toString()');
  }
}

WorldGen.prototype.leftPresetPotentialTiles = function(leftInfluencerChunk,
  presetPotentialTiles) {
  if (this.chunks[leftInfluencerChunk] !== undefined) {
    var relevantCol = [];
    for (var i = 0; i < this.chunkSize; i++) {
      try {
        relevantCol.push(this.chunks[leftInfluencerChunk][i][this.chunkSize - 1]
        );
      } catch(exception) {
        console.log(exception);
      }
    }
    this.addPresetPotentialTiles(relevantCol, presetPotentialTiles, 'i + \" 0\"');
  }
}

WorldGen.prototype.addPresetPotentialTiles = function(tileArray,
  presetPotentialTiles, evalString) {
  for (var i = 0; i < tileArray.length; i++) {
    switch (tileArray[i]) {
      case 0:
        presetPotentialTiles.push(eval(evalString) + ' water');
        break;
      case 1:
        presetPotentialTiles.push(eval(evalString) + ' grass');
        break;
      case 2:
        presetPotentialTiles.push(eval(evalString) + ' sand');
        break;
      default:
        console.log('invalid tilecode ' + tileArray[i] + 'found');
    } //end switch
  } //end for
}

exports.WorldGen = WorldGen;
