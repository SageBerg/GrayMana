function setup() {
  loadChunk(getChunkCoords(), renderInitialChunk);
  bindKeys();

  //TODO move to the state checking interval
  setInterval(function() {
    incAllMana();

    renderDamage();
    renderMana();
  }, 60000);

/*
  //request state changes from server
  setInterval(function() {

  }, 1000);
*/

}
