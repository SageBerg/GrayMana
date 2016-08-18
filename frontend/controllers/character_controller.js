app.controller('characterController', function($scope) {
  $scope.character = {
    damage: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
      violet: 0, gray: 0},
    life: 100,
    mana: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0,
      violet: 0, gray: 0},
    runes: {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0,
      l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0,
      x: 0, y: 0, z: 0, ' ': 0},
    state: 'active', //things like 'casting', 'sleeping', 'manatating', 'dead'
    spellsKnown: {}
  };
});
