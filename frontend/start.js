function setup() {
  loadChunk(getChunkCoords(), renderInitialChunk);
  bindKeys();

  setInterval(function() {
    incMana();
    renderMana();
  }, 1000);

}
