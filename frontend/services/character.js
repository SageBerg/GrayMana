app.service('characterStateService', function() {
  this.startingBody = {
    damage: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, violet: 0, gray: 0},
    inventory_slots: 16,
    inventory: {apple: 0},
    life: 100,
    mana: {red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, violet: 0, gray: 0},
    runes: {a: 0, b: 0, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, j: 0, k: 0,
      l: 0, m: 0, n: 0, o: 0, p: 0, q: 0, r: 0, s: 0, t: 0, u: 0, v: 0, w: 0,
      x: 0, y: 0, z: 0, ' ': 0},
    spell_slots: 8,
    spells_affected_by: [],
    state: 'active', //things like 'casting', 'sleeping', 'dead'
    stresses: {toxicity: 0, pressure: 0, heat: 0, hunger: 0, suffocation: 0,
      fatigue: 0, loniness: 0, mentalStress: 0}
  };
  this.character = {
    name: 'Sage Berg',
    bodies: [this.startingBody],
    currentBody: this.startingBody,
    school: '',
    specialty: '',
    spellsKnown: new Set(),
    spellsPrepared: {},
    spellsEquipped: [],
    faction: 'The Founders'
  };
});
