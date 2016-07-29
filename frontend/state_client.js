var CHUNK_SIZE = 40;
var CHUNKS = {}; //the client's representation of the game map

var CURRENT_CHUNK = {x: 0, y: 0}; //the region of the map the player is on
var CURRENT_BLOCK = {row: 0, col: 0}; //player's locaiton within region

var MID = Math.floor(CHUNK_SIZE / 2);
var COLORS = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet',
  'black', 'gray', 'white'];

var HUD_STATE = {
  selectedManaSlot: 10,
  selectedSpellSlot: 10
}

var SELECTED_SPELL_SLOT = 10;
var SELECTED_MANA_SLOT = 10;

var CHARACTER = {
  damage: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
    violet: 0, black: 0, gray: 0, white: 0},
  life: 100,
  mana: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, violet: 0,
    black: 0, gray: 0, white: 0},
  runes: {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0,
    l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0,
    x: 0, y: 0, z: 0, ' ': 0},
  state: 'active', //things like 'casting', 'sleeping', 'manatating', 'dead'
  spellsKnown: {}
};

function getChunkCoords() {
  return CURRENT_CHUNK.x + ' ' + CURRENT_CHUNK.y;
}

function getIncrementedChunkCoords(xInc, yInc) {
  return (CURRENT_CHUNK.x + xInc) + ' ' + (CURRENT_CHUNK.y + yInc);
}

function changeCurrentBlock(row, col) {
  CURRENT_BLOCK.row += row;
  CURRENT_BLOCK.col += col;
  changeCurrentChunkY();
  changeCurrentChunkX();
}

function changeCurrentChunkY() {
  if (CURRENT_BLOCK.row < 0) {
    CURRENT_CHUNK.y -= 1;
    CURRENT_BLOCK.row = CHUNK_SIZE - 1;
  } else if (CURRENT_BLOCK.row > CHUNK_SIZE - 1) {
    CURRENT_CHUNK.y += 1;
    CURRENT_BLOCK.row = 0;
  }
}

function changeCurrentChunkX() {
  if (CURRENT_BLOCK.col < 0) {
    CURRENT_CHUNK.x -= 1;
    CURRENT_BLOCK.col = CHUNK_SIZE - 1;
  } else if (CURRENT_BLOCK.col > CHUNK_SIZE - 1) {
    CURRENT_CHUNK.x += 1;
    CURRENT_BLOCK.col = 0;
  }
}

function incAllMana() {
  for (var i = 0; i < COLORS.length; i++) {
    var color = COLORS[i];
    if (CHARACTER.mana[color] < 1000) {
      CHARACTER.mana[color] += 1;
    }
  }
}

function getTreasure() {
  getMana();
  getRunes();
  renderMana();
}

function getRunes() {
  var treasureGen = new TreasureGen();
  var runeDrop = treasureGen.runeDrop();
  for (var i = 0; i < runeDrop.length; i++) {
    CHARACTER.runes[runeDrop[i]] += 1;
  }
}

function getMana() {
  var treasureGen = new TreasureGen();
  var manaBundle = treasureGen.manaDrop();
  CHARACTER.mana[manaBundle.manaColor] += manaBundle.manaAmount;
}

function takeDamage(amount, color) {
  CHARACTER.damage[color] += amount;
  deathCheck();
}

function deathCheck() {
  if (CHARACTER.damage > CHARACTER.life) {
    console.log('Ya dead!')
    clearDamage();
    printDeathMessage(color);
  }
}

function clearDamage() {
  CHARACTER.mana = {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
    violet: 0, black: 0, gray: 0, white: 0};
}

function printDeathMessage(color) {
  switch (color) {
    case 'red':
      console.log('Toxicity overwhelmed your system.');
      break;

    case 'orange':
      console.log('Changes in pressure overwhelmed your system.');
      break;

    case 'yellow':
      console.log('Changes in thermal condition overwhelmed your system.');
      break;

    case 'green':
      console.log('You died from lack of food.');
      break;

    case 'blue':
      console.log('You died from lack of air.');
      break;

    case 'indigo':
      console.log('Died from lack of sleep.');
      break;

    case 'violet':
      console.log('You died of loneliness.');
      break;

    case 'black':
      console.log('You died of bordem.');
      break;

    case 'gray':
      console.log('Stress overwhelmed your system.');
      break;

    case 'white':
      console.log('You died from your injuries.');
      break;
  }
}
