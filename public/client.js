//client side game state
var CHUNK_SIZE = 40;
var CHUNKS = {}; //the client's representation of the game map
var CURRENT_CHUNK = {'x': 0, 'y': 0}; //the region of the map the player is on
var MID = Math.floor(CHUNK_SIZE / 2);
var CURRENT_BLOCK = {'row': 0, 'col': 0}; //player's locaiton within region
var SELECTED_SPELL_SLOT = 1;

document.addEventListener('wheel', wheelHandler);

function wheelHandler(e) {
  e.preventDefault();
  var prev_spell_slot = document.getElementById('spell_slot_' + SELECTED_SPELL_SLOT);
  prev_spell_slot.removeAttribute('class', 'selected_spell_slot');
  prev_spell_slot.setAttribute('class', 'spell_logo');
  var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
  if (delta === 1) {
     SELECTED_SPELL_SLOT -= 1;
     if (SELECTED_SPELL_SLOT < 1) {
       SELECTED_SPELL_SLOT = 10;
     }
  } else {
    SELECTED_SPELL_SLOT += 1;
    if (SELECTED_SPELL_SLOT > 10) {
      SELECTED_SPELL_SLOT = 1;
    }
  }
  var current_spell_slot = document.getElementById("spell_slot_" + SELECTED_SPELL_SLOT);
  current_spell_slot.setAttribute('class', 'selected_spell_slot spell_logo');
}


function login() {
  $.post('login', {username: $('#username').val(),
    password: $('#password').val()}, handleLogin);
}

function handleLogin(res) {
  CHUNKS = {}; //clear out any cached data
  window.sessionStorage.accessToken = res.token;
  setup();
  $('#login_div').html(''); //removes login view
}

function setup() {
  loadChunk(getChunkCoords(), renderInitialMap);
  bindKeys();
}

function getChunkCoords() {
  return CURRENT_CHUNK.x + ' ' + CURRENT_CHUNK.y;
}

function getIncrementedChunkCoords(xInc, yInc) {
  return (CURRENT_CHUNK.x + xInc) + ' ' + (CURRENT_CHUNK.y + yInc);
}

function loadChunk(chunkCoords, callback) {
  if (CHUNKS[chunkCoords] === undefined) {
    $.post('map.json', {'token': window.sessionStorage.accessToken,
      'chunkCoords': chunkCoords},
    function(res) {
      CHUNKS[chunkCoords] = res;
      callback(); //can use to render map
    });
  }
}

function renderInitialMap() {
  $('#map').css('width', CHUNK_SIZE * 10);
  $('#map').html(genMapHTML(CHUNKS[getChunkCoords()]));
}

function bindKeys() {
  $(document).keydown(function(event) {
    switch(event.which) {
      case 37: //left
        move(0, -1);
        break;

      case 38: //up
        move(-1, 0);
        break;

      case 39: //right
        move(0, 1)
        break;

      case 40: //down
        move(1, 0);
        break;

      default:
        return;
    }
    event.preventDefault(); //prevent scrolling
  });
}

function move(rowInc, colInc) {
  refreshToken(); //while the players is active keep the token refreshed

  var chunkY = CURRENT_CHUNK.y + rowInc;
  var chunkX = CURRENT_CHUNK.x + colInc;
  var reqChunkCoords = getRequestedChunkCoords();

  var reqRow = (CURRENT_BLOCK.row + rowInc) % CHUNK_SIZE;
  var reqCol = (CURRENT_BLOCK.col + colInc) % CHUNK_SIZE;

  if (reqRow < 0) {
    reqRow += CHUNK_SIZE;
  }
  if (reqCol < 0) {
    reqCol += CHUNK_SIZE;
  }

  $.post('move', {chunkCoords: reqChunkCoords, row: reqRow,
    col: reqCol, token: window.sessionStorage.accessToken},
    function(res) {
    if (res) {
      changeCurrentBlock(rowInc, colInc);
      stitchChunksPrep();
    } else {
      console.log('move not permitted');
    } //end if move allowed
  }); //end post
}

function refreshToken() {
  $.post('refresh_token', {'token': window.sessionStorage.accessToken},
    function(res) {
      window.sessionStorage.accessToken = res.token;
  });
}

function getRequestedChunkCoords(rowInc, colInc) {
  if (CURRENT_BLOCK.row + rowInc < 0) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else if (CURRENT_BLOCK.row + rowInc >= CHUNK_SIZE) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else if (CURRENT_BLOCK.col + colInc < 0) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else if (CURRENT_BLOCK.col + colInc >= CHUNK_SIZE) {
    return getIncrementedChunkCoords(colInc, rowInc);
  } else {
    return getChunkCoords();
  }
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

function stitchChunksPrep() {
  var current = getChunkCoords();
  var xPlus = getIncrementedChunkCoords(1, 0);
  var yPlus = getIncrementedChunkCoords(0, 1);
  var xyPlus = getIncrementedChunkCoords(1, 1);

  if (CHUNKS[current] === undefined) {
    loadChunk(current, stitchChunksPrep);
  } else if (CHUNKS[yPlus] === undefined) {
    loadChunk(yPlus, stitchChunksPrep);
  } else if (CHUNKS[xPlus] === undefined) {
    loadChunk(xPlus, stitchChunksPrep);
  } else if (CHUNKS[xyPlus] === undefined) {
    loadChunk(xyPlus, stitchChunksPrep);
  } else {
    stitchChunks();
  }
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
