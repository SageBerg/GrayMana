function renderLearnSpellList() {
  var spellMarkup = '';
  SPELL_LIST.sort();
  for (var i = 0; i < SPELL_LIST.length; i++) {
    spellMarkup += '<div>';
    spellMarkup += '<p class=\'learn-it\'>' + SPELL_LIST[i] + '</p>';
    spellMarkup += '<button class=\'learn-it\'>Learn it</button>';
    spellMarkup += '</div>';
  }
  $('#spell_learn_list').html(spellMarkup);
}

function renderRunes() {
  var alphabet = 'abcdefghijklmnopqrstuvwxyz';
  var runeMarkup = '';
  for (var i = 0; i < alphabet.length; i++) {
    var letter = alphabet[i];
    runeMarkup += '<div class=\'rune\' id=\'rune_' + letter + '\'>' + letter +
      ' ' + RUNES[letter] + '</div>';
  }
  runeMarkup += '<div class=\'rune\' id=\'rune_\'>\' \' ' + RUNES[' '] +
    '</div>';
  $('#runes').html(runeMarkup);
}

function renderMana() {
  $('#mana_bar_1_red').html(RED_MANA);
  $('#mana_bar_2_orange').html(ORANGE_MANA);
  $('#mana_bar_3_yellow').html(YELLOW_MANA);
  $('#mana_bar_4_green').html(BLUE_MANA);
  $('#mana_bar_5_blue').html(GREEN_MANA);
  $('#mana_bar_6_indigo').html(INDIGO_MANA);
  $('#mana_bar_7_violet').html(VIOLET_MANA);
  $('#mana_bar_8_black').html(BLACK_MANA);
  $('#mana_bar_9_gray').html(GRAY_MANA);
  $('#mana_bar_10_white').html(WHITE_MANA);
}

function renderInitialMap() {
  $('#map').css('width', CHUNK_SIZE * 10);
  $('#map').html(genMapHTML(CHUNKS[getChunkCoords()]));
}

function stitchChunks() {
  var grid = buildBlankGrid();
  var row = CURRENT_BLOCK.row;
  var col = CURRENT_BLOCK.col;
  var currentGrid = CHUNKS[getChunkCoords()];
  var downGrid = CHUNKS[getIncrementedChunkCoords(0, 1)];
  var rightGrid = CHUNKS[getIncrementedChunkCoords(1, 0)];
  var downRightGrid = CHUNKS[getIncrementedChunkCoords(1, 1)];

  for (var i = 0; i < CHUNK_SIZE; i++) {
    for (var j = 0; j < CHUNK_SIZE; j++) {
      var adjustedRow = i + row;
      var adjustedCol = j + col;
      if (adjustedRow < CHUNK_SIZE && adjustedCol < CHUNK_SIZE) {
        grid[i][j] = currentGrid[adjustedRow][adjustedCol];
      } else if (adjustedRow >= CHUNK_SIZE && adjustedCol < CHUNK_SIZE) {
        grid[i][j] = downGrid[adjustedRow - CHUNK_SIZE][adjustedCol];
      } else if (adjustedRow < CHUNK_SIZE && adjustedCol >= CHUNK_SIZE) {
        grid[i][j] = rightGrid[adjustedRow][adjustedCol - CHUNK_SIZE];
      } else if (adjustedRow >= CHUNK_SIZE && adjustedCol >= CHUNK_SIZE) {
        grid[i][j] =
          downRightGrid[adjustedRow - CHUNK_SIZE][adjustedCol - CHUNK_SIZE];
      }
    } //end for i loop
  } //end for j loop
  $('#map').html(genMapHTML(grid));
}

function buildBlankGrid() {
  var grid = [];
  for (var i = 0; i < CHUNK_SIZE; i++) {
    grid.push([]);
    for (var j = 0; j < CHUNK_SIZE; j++) {
      grid[i].push(null);
    }
  }
  return grid;
}

function genMapHTML(grid) {
  mapHTML = '';
  var terrainCodesToNames = {0: 'water', 1: 'grass', 2: 'sand'};
  for (var row = 0; row < CHUNK_SIZE; row++) {
    for (var col = 0; col < CHUNK_SIZE; col++) {
      var terrain = terrainCodesToNames[grid[row][col]];
      if (row === MID && col === MID) { //draw player in center of map
        mapHTML += '<div class=\"playerCharacter\"></div>';
      } else {
        mapHTML += '<div class=' + terrain + '></div>';
      } //end if player or terrain
    } //end for col
  } //end for row
  return mapHTML;
}