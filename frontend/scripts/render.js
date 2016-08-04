function renderDamage() {
  for (var i = 0; i < COLORS.length; i++) {
    $('#damage-1-red').css('width', character.damage['red'] + '%');
    $('#damage-2-orange').css('width', character.damage['orange']  + '%');
    $('#damage-3-yellow').css('width', character.damage['yellow']  + '%');
    $('#damage-4-green').css('width', character.damage['green']  + '%');
    $('#damage-5-blue').css('width', character.damage['blue'] + '%');
    $('#damage-6-indigo').css('width', character.damage['indigo'] + '%');
    $('#damage-7-violet').css('width', character.damage['violet'] + '%');
    $('#damage-8-black').css('width', character.damage['black'] + '%');
    $('#damage-9-gray').css('width', character.damage['gray' + '%']);
    $('#damage-10-white').css('width', character.damage['white'] + '%');
  }
}

function renderLearnSpellList() {
  var spellMarkup = '';
  var learnableSpells = [];
  var notYetLearnableSpells = [];

  for (var i = 0; i < SPELL_LIST.length; i++) {
    var spell = SPELL_LIST[i];
    if (isLearnable(spell)) {
      learnableSpells.push(spell);
    } else {
      notYetLearnableSpells.push(spell);
    }
  }
  learnableSpells.sort();
  notYetLearnableSpells.sort();

  for (var i = 0; i < learnableSpells.length; i++) {
    var spell = learnableSpells[i];
    spellMarkup += '<div>';
    spellMarkup += '<p class=\'inline-block\'>' + spell + '</p>';
    spellMarkup += '<button class=\'learn-it\'>Learn it</button>';
    spellMarkup += '</div>';
  }

  //don't include the break if there aren't two groups
  if (learnableSpells.length > 0 && notYetLearnableSpells.length > 0) {
    spellMarkup += '<br>';
  }

  for (var i = 0; i < notYetLearnableSpells.length; i++) {
    var spell = notYetLearnableSpells[i];
    spellMarkup += '<div>';
    spellMarkup += '<p class=\'inline-block\'>' + spell + '</p>';
    spellMarkup += '<button class=\'learn-it\' disabled=true>Learn it</button>';
    spellMarkup += '</div>';
  }

  $('#spell-learn-list').html(spellMarkup);
}

function isLearnable(spellName) {
  var spellName = spellName.toLowerCase();
  var runesCopy = $.extend({}, character.runes);
  for (var i = 0; i < spellName.length; i++) {
    if (runesCopy[spellName[i]] === 0) {
      return false;
    } else {
      runesCopy[spellName[i]] -= 1;
    }
  }
  return true;
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
  $('#map').css('width', world.chunkSize * 10);
  $('#map').html(genChunkHTML(world.chunks[getChunkCoords()]));
}

function stitchChunks() {
  var chunk = buildBlankChunk();
  var row = world.currentBlock.row;
  var col = world.currentBlock.col;
  var currentChunk = world.chunks[getChunkCoords()];
  var downChunk = world.chunks[getIncrementedChunkCoords(0, 1)];
  var rightChunk = world.chunks[getIncrementedChunkCoords(1, 0)];
  var downRightChunk = world.chunks[getIncrementedChunkCoords(1, 1)];

  for (var i = 0; i < world.chunkSize; i++) {
    for (var j = 0; j < world.chunkSize; j++) {
      var adjustedRow = i + row;
      var adjustedCol = j + col;
      if (adjustedRow < world.chunkSize && adjustedCol < world.chunkSize) {
        chunk[i][j] = currentChunk[adjustedRow][adjustedCol];
      } else if (adjustedRow >= world.chunkSize && adjustedCol < world.chunkSize) {
        chunk[i][j] = downChunk[adjustedRow - world.chunkSize][adjustedCol];
      } else if (adjustedRow < world.chunkSize && adjustedCol >= world.chunkSize) {
        chunk[i][j] = rightChunk[adjustedRow][adjustedCol - world.chunkSize];
      } else if (adjustedRow >= world.chunkSize && adjustedCol >= world.chunkSize) {
        chunk[i][j] =
          downRightChunk[adjustedRow - world.chunkSize][adjustedCol - world.chunkSize];
      }
    } //end for i loop
  } //end for j loop
  $('#map').html(genChunkHTML(chunk));
}

function buildBlankChunk() {
  var chunk = [];
  for (var i = 0; i < world.chunkSize; i++) {
    chunk.push([]);
    for (var j = 0; j < world.chunkSize; j++) {
      chunk[i].push(null);
    }
  }
  return chunk;
}

function genChunkHTML(chunk) {
  chunkHTML = '';
  var terrainCodesToNames = {0: 'water', 1: 'grass', 2: 'sand'};
  for (var row = 0; row < world.chunkSize; row++) {
    for (var col = 0; col < world.chunkSize; col++) {
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
