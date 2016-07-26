//the data here is an example to help me brainstorm the game's organization

var Character = function() {
  this.account = {
    "email": "sage@example.com"
  };
  this.character_name = "DarkWizard";
  this.class = {
    "purist": false,
    "school": "black",
    "subclass": "wizard"
  };
  this.coords = {
    "x": 0,
    "y": 0,
    "z": 0
  };

  this.damage = {
    "red": 0,
    "orange": 0,
    "yellow": 0,
    "green": 0,
    "blue": 0,
    "indigo": 0,
    "violet": 0,
    "black": 0,
    "gray": 0,
    "white": 0
  };
  this.damage_grace_period = {
    "red": 60000 * 24,
    "orange": null,
    "yellow": null,
    "green": 60000 * 5,
    "blue": null,
    "indigo": 60000 * 16,
    "violet": 60000 * 24,
    "black": null,
    "gray": null,
    "white": null
  };
  this.faction = {
    "name": null,
  };
  this.items = {
    "keys": ["key_id0", "key_id1"],
    "potato": 1,
    "runes": ['a', 'b', 'c'],
  };
  this.mana_inate = {
    "red": 10,
    "orange": 10,
    "yellow": 10,
    "green": 10,
    "blue": 10,
    "indigo": 10,
    "violet": 10,
    "black": 10,
    "gray": 10,
    "white": 10
  };
  this.mana_wild = {
    "red": 0,
    "orange": 0,
    "yellow": 0,
    "green": 0,
    "blue": 0,
    "indigo": 0,
    "violet": 0,
    "black": 0,
    "gray": 0,
    "white": 0
  };
  this.orientation = {

  };
  this.server = "server_id";
  this.spells_affected_by = [
    {},
    {}
  ];
  this.spells_known = {
    "Speed": true,
    "Teleport": false
    //...lots more spells to include
  };
  this.spells_prepared = [
    {},
    {}
  ];
  this.state = "casting_spell"; //sleeping, eating, opening_chest, imprisoned
};
