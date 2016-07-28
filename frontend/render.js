function renderLearnSpellList() {
  var spellMarkup = '';
  SPELL_LIST.sort();
  for (var i = 0; i < SPELL_LIST.length; i++) {
    spellMarkup += '<div>';
    spellMarkup += '<p class=\'learn-it\'>' + SPELL_LIST[i] + '</p>';
    spellMarkup += '<button class=\'learn-it\'>Learn it</button>';
    spellMarkup += '</div>';
  }
  $('#spell-learn-list').html(spellMarkup);
}

function renderRunes() {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  var runeMarkup = '';
  for (var i = 0; i < alphabet.length; i++) {
    var letter = alphabet[i];
    runeMarkup += '<div class=\'rune\' id=\'rune-' + letter + '\'>' + letter +
      ' ' + CHARACTER.runes[letter] + '</div>';
  }
  runeMarkup += '<div class=\'rune\' id=\'rune-\'>\' \' ' + CHARACTER.runes[' ']
    + '</div>';
  $('#runes').html(runeMarkup);
}

function renderMana() {
  $('#mana-bar-1-red').html(CHARACTER.mana.red);
  $('#mana-bar-2-orange').html(CHARACTER.mana.orange);
  $('#mana-bar-3-yellow').html(CHARACTER.mana.yellow);
  $('#mana-bar-4-green').html(CHARACTER.mana.blue);
  $('#mana-bar-5-blue').html(CHARACTER.mana.green);
  $('#mana-bar-6-indigo').html(CHARACTER.mana.indigo);
  $('#mana-bar-7-violet').html(CHARACTER.mana.violet);
  $('#mana-bar-8-black').html(CHARACTER.mana.black);
  $('#mana-bar-9-gray').html(CHARACTER.mana.gray);
  $('#mana-bar-10-white').html(CHARACTER.mana.white);
}

function renderInitialChunk() {
  $('#map').css('width', CHUNK_SIZE * 10);
  $('#map').html(genChunkHTML(CHUNKS[getChunkCoords()]));
}

function stitchChunks() {
  var chunk = buildBlankChunk();
  var row = CURRENT_BLOCK.row;
  var col = CURRENT_BLOCK.col;
  var currentChunk = CHUNKS[getChunkCoords()];
  var downChunk = CHUNKS[getIncrementedChunkCoords(0, 1)];
  var rightChunk = CHUNKS[getIncrementedChunkCoords(1, 0)];
  var downRightChunk = CHUNKS[getIncrementedChunkCoords(1, 1)];

  for (var i = 0; i < CHUNK_SIZE; i++) {
    for (var j = 0; j < CHUNK_SIZE; j++) {
      var adjustedRow = i + row;
      var adjustedCol = j + col;
      if (adjustedRow < CHUNK_SIZE && adjustedCol < CHUNK_SIZE) {
        chunk[i][j] = currentChunk[adjustedRow][adjustedCol];
      } else if (adjustedRow >= CHUNK_SIZE && adjustedCol < CHUNK_SIZE) {
        chunk[i][j] = downChunk[adjustedRow - CHUNK_SIZE][adjustedCol];
      } else if (adjustedRow < CHUNK_SIZE && adjustedCol >= CHUNK_SIZE) {
        chunk[i][j] = rightChunk[adjustedRow][adjustedCol - CHUNK_SIZE];
      } else if (adjustedRow >= CHUNK_SIZE && adjustedCol >= CHUNK_SIZE) {
        chunk[i][j] =
          downRightChunk[adjustedRow - CHUNK_SIZE][adjustedCol - CHUNK_SIZE];
      }
    } //end for i loop
  } //end for j loop
  $('#map').html(genChunkHTML(chunk));
}

function buildBlankChunk() {
  var chunk = [];
  for (var i = 0; i < CHUNK_SIZE; i++) {
    chunk.push([]);
    for (var j = 0; j < CHUNK_SIZE; j++) {
      chunk[i].push(null);
    }
  }
  return chunk;
}

function genChunkHTML(chunk) {
  chunkHTML = '';
  var terrainCodesToNames = {0: 'water', 1: 'grass', 2: 'sand'};
  for (var row = 0; row < CHUNK_SIZE; row++) {
    for (var col = 0; col < CHUNK_SIZE; col++) {
      var terrain = terrainCodesToNames[chunk[row][col]];
      if (row === MID && col === MID) { //draw player in center of map
        chunkHTML += '<div class=\"player-character\"></div>';
      } else {
        chunkHTML += '<div class=' + terrain + '></div>';
      } //end if player or terrain
    } //end for col
  } //end for row
  return chunkHTML;
}
