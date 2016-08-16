//the data here is an example to help me brainstorm the game's organization

var Character = function() {
  this.characterName = 'DarkWizard';

  this.appearance = 'refToModelObject';
  this.bodies = ['bodyObjectOne', 'bodyObjectTwo'];
  this.currentBody = 'bodyObjectOne';

  //info (used by Profile Person spell)
  this.log = []; //contains a list of state changes

  //social
  this.faction = 'factionId';
  this.quests = [];

  //magic
  this.schools = [];

  this.spellsPrepared = [
    {},
    {}
  ];

  this.spellsKnown = {
    Quickness: true,
    Teleport: false
    //...lots more spells to include
  };

};

//a character can have a number of bodies
var Body = function() {
  //meta
  this.selectedSlot = 0; //you can have a mana or spell selected

  //general
  this.state = 'casting_spell'; //sleeping, eating, opening_chest, imprisoned, inactive, active

  //damage
  this.life = 100;
  this.damage = { red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, violet: 0, gray: 0 }
  this.damageGracePeriod = {
    red: 60000 * 24,
    orange: null,
    yellow: null,
    green: 60000 * 5,
    blue: null,
    indigo: 60000 * 16,
    violet: 60000 * 24,
  };

  //location
  this.universe = 'universeId';
  this.world = 'worldId';
  this.coords = { x: 0, y: 0, z: 0 };
  this.orientation = {};

  //magic
  this.spellsAffectedBy = [
    {},
    {}
  ];

  this.spellDeck = [
    1: {'<preparedSpell>'},
    2:
  ];

  //treasure
  this.items = {
    apples: 1,
    glassEggs: [{}, {}],
    runes: { a: 0, b: 0, },
    specializationBooks = {bookOfDurationVolOne: 1},
    wizmarks: 100
  };
  this.inventoryCapacity = 16;
  this.mana = { red: 0, orange: 0, yellow: 0, green: 0, blue: 0, indigo: 0, violet: 0, gray: 0 };
  this.maxMana = { red: 1000, orange: 1000, yellow: 1000, green: 1000, blue: 1000, indigo: 1000, violet: 1000, gray: 1000 };
}
