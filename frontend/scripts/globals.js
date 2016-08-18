'use strict';

//using require for unit testing
try {
  var state_client = require('./state_client');
} catch (exception) {
}

var COLORS = [
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'indigo',
  'violet',
  'gray',
];

try {
  var MID = Math.floor(world.chunkSize / 2);
} catch (exception) {
  console.log(exception);
}

var SPELL_LIST = [
  'Clean',
  'Detox',
  'Dispel Magic',
  'Organize',
  'Resist Magic',
  'Levitate',
  'Gavity',
  'Pessure',
  'Bulid',
  'Burst',
  'Shield',
  'Sentinel',
  'Heat',
  'Heat Wall',
  'Heat Minion',
  'Weather',
  'Warm Egg',
  'Mana Chest',
  'Clone',
  'Summon Food',
  'Toughen',
  'Increase Mana Maximum',
  'Quickness',
  'Flight',
  'Teleport',
  'Portal',
  'Breathing',
  'Heal',
  'Sleep',
  'Stun',
  'Resurrect',
  'Regenerate',
  'Befriend',
  'Found Faction',
  'Induct to Faction',
  'Message',
  'Storage',
  'Quest',
  'Banner',
  'Market',
  'Detect Magic',
  'Light',
  'Map',
  'Profile Person',
  'Alert',
  'Scry',
  'Coordinates',
  'Advertise',
  'Invisibility',
  'Hide Magic'
]

try {
  exports.SPELL_LIST = SPELL_LIST;
} catch (exception) {
}
