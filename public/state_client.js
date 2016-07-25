var CHUNK_SIZE = 40;
var CHUNKS = {}; //the client's representation of the game map

var CURRENT_CHUNK = {'x': 0, 'y': 0}; //the region of the map the player is on
var CURRENT_BLOCK = {'row': 0, 'col': 0}; //player's locaiton within region

var MID = Math.floor(CHUNK_SIZE / 2);

var SELECTED_SPELL_SLOT = 10;

//character variables, TODO put them in an object for organization
var RED_MANA = 0;
var ORANGE_MANA = 0;
var YELLOW_MANA = 0;
var GREEN_MANA = 0;
var BLUE_MANA = 0;
var INDIGO_MANA = 0;
var VIOLET_MANA = 0;
var BLACK_MANA = 0;
var GRAY_MANA = 0;
var WHITE_MANA = 0;

var SPELLS_KNOWN = {};

var RUNES = {
  a: 0,
  b: 0,
  c: 0,
  d: 0,
  e: 0,
  f: 0,
  g: 0,
  h: 0,
  i: 0,
  j: 0,
  k: 0,
  l: 0,
  m: 0,
  n: 0,
  o: 0,
  p: 0,
  q: 0,
  r: 0,
  s: 0,
  t: 0,
  u: 0,
  v: 0,
  w: 0,
  x: 0,
  y: 0,
  z: 0,
  ' ': 0
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
