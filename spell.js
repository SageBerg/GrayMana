//the data here is an example to help me brainstorm the game's organization

var OngoingSpell = function() {
  this.affected = "DarkWizard";
  this.caster = "DarkWizard";
  this.duration_remaining = 10000;
  this.special_parameters = {"speed_increase_percentage": 110};
  this.spell_name = "Speed";
};

var PreparedSpell = function() {
  this.area = 0;
  this.duration = 12000;
  this.casting_time = 1000;
  this.cost = 27;
  this.range = 0;
  this.speical_parameters = {"speed_increase_percentage": 110};
};

var Spell = function() {

  this.base_cost = "1";
  this.base_duration = 6000;
  this.school = "blue";
  this.spell_name = "Speed";
  this.parameters = {"area": true,
                     "casting_time": true,
                     "duration": true,
                     "range": true};
  this.special_parameters = ["speed_increase_percentage"];
};
