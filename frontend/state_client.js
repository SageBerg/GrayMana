var HUDState = {
  selectedManaSlot: 10,
  selectedSpellSlot: 10
}

var world = {
  chunkSize: 40,
  chunks: {},
  currentBlock: {row: 0, col: 0},
  currentChunk: {x: 0, y: 0}
};

var character = {
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
  return world.currentChunk.x + ' ' + world.currentChunk.y;
}

function getIncrementedChunkCoords(xInc, yInc) {
  return (world.currentChunk.x + xInc) + ' ' + (world.currentChunk.y + yInc);
}

function changeCurrentBlock(row, col) {
  world.currentBlock.row += row;
  world.currentBlock.col += col;
  changeCurrentChunkY();
  changeCurrentChunkX();
}

function changeCurrentChunkY() {
  if (world.currentBlock.row < 0) {
    world.currentChunk.y -= 1;
    world.currentBlock.row = world.chunkSize - 1;
  } else if (world.currentBlock.row > world.chunkSize - 1) {
    world.currentChunk.y += 1;
    world.currentBlock.row = 0;
  }
}

function changeCurrentChunkX() {
  if (world.currentBlock.col < 0) {
    world.currentChunk.x -= 1;
    world.currentBlock.col = world.chunkSize - 1;
  } else if (world.currentBlock.col > world.chunkSize - 1) {
    world.currentChunk.x += 1;
    world.currentBlock.col = 0;
  }
}

function incAllMana() {
  for (var i = 0; i < COLORS.length; i++) {
    var color = COLORS[i];
    if (character.mana[color] < 1000) {
      character.mana[color] += 1;
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
    character.runes[runeDrop[i]] += 1;
  }
}

function getMana() {
  var treasureGen = new TreasureGen();
  var manaBundle = treasureGen.manaDrop();
  character.mana[manaBundle.manaColor] += manaBundle.manaAmount;
}

function takeDamage(amount, color) {
  character.damage[color] += amount;
  deathCheck();
}

function deathCheck() {
  if (character.damage > character.life) {
    console.log('Ya dead!')
    clearDamage();
    printDeathMessage(color);
  }
}

function clearDamage() {
  character.mana = {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
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
