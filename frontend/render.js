function renderDamage() {
  for (var i = 0; i < COLORS.length; i++) {
    $('#damge-1-red').css('width', character.damage['red'] + '%');
    $('#damge-2-orange').css('width', character.damage['orange']  + '%');
    $('#damge-3-yellow').css('width', character.damage['yellow']  + '%');
    $('#damge-4-green').css('width', character.damage['green']  + '%');
    $('#damge-5-blue').css('width', character.damage['blue'] + '%');
    $('#damge-6-indigo').css('width', character.damage['indigo'] + '%');
    $('#damge-7-violet').css('width', character.damage['violet'] + '%');
    $('#damge-8-black').css('width', character.damage['black'] + '%');
    $('#damge-9-gray').css('width', character.damage['gray' + '%']);
    $('#damge-10-white').css('width', character.damage['white'] + '%');
  }
}

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
  var alphabet = 'abcdefghijklmnopqrstuvwxyz ';
  var runeMarkup = '';
  for (var i = 0; i < alphabet.length; i++) {
    var letter = alphabet[i];
    var numberOfRunes = character.runes[letter];
    if (numberOfRunes > 0) {
      if (letter === ' ') {
        runeMarkup += '<div class=\'rune\' id=\'rune-' + letter + '\'>' +
          '\' \'' + ' ' + numberOfRunes + '</div>';
      } else {
        runeMarkup += '<div class=\'rune\' id=\'rune-' + letter + '\'>' +
          letter + ' ' + numberOfRunes + '</div>';
      }
    } else {
      if (letter === ' ') {
        runeMarkup += '<div class=\'rune-faded\' id=\'rune-' + letter + '\'>' +
          '\' \'' + ' ' + numberOfRunes + '</div>';
      } else {
        runeMarkup += '<div class=\'rune-faded\' id=\'rune-' + letter + '\'>' +
          letter + ' ' + numberOfRunes + '</div>';
      }
    }
  }
  $('#runes').html(runeMarkup);
}

function renderMana() {
  $('#mana-bar-1-red').html(character.mana.red);
  $('#mana-bar-2-orange').html(character.mana.orange);
  $('#mana-bar-3-yellow').html(character.mana.yellow);
  $('#mana-bar-4-green').html(character.mana.blue);
  $('#mana-bar-5-blue').html(character.mana.green);
  $('#mana-bar-6-indigo').html(character.mana.indigo);
  $('#mana-bar-7-violet').html(character.mana.violet);
  $('#mana-bar-8-black').html(character.mana.black);
  $('#mana-bar-9-gray').html(character.mana.gray);
  $('#mana-bar-10-white').html(character.mana.white);
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
