

function getChunkCoords() {
  return CURRENT_CHUNK.x + ' ' + CURRENT_CHUNK.y;
}

function getIncrementedChunkCoords(xInc, yInc) {
  return (CURRENT_CHUNK.x + xInc) + ' ' + (CURRENT_CHUNK.y + yInc);
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

function incMana() {
  RED_MANA += 1;
  ORANGE_MANA += 1;
  YELLOW_MANA += 1;
  GREEN_MANA += 1;
  BLUE_MANA += 1;
  INDIGO_MANA += 1;
  VIOLET_MANA += 1;
  BLACK_MANA += 1;
  GRAY_MANA += 1;
  WHITE_MANA += 1;
}
