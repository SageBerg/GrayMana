function setup() {
  loadChunk(getChunkCoords(), renderInitialMap);
  bindKeys();

  setInterval(function() {
    incMana();
    renderMana();
  }, 1000);

}
