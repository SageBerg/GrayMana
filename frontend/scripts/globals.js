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
  'black',
  'gray',
  'white'
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
  'Levitate',
  'Gavity',
  'Pessure',
  'Bulid',
  'Heat',
  'Heat Wall',
  'Heat Minion',
  'Weather',
  'Mana Chest',
  'Clone',
  'Summon Food',
  'Toughen',
  'Quickness',
  'Flight',
  'Teleport',
  'Portal',
  'Heal',
  'Sleep',
  'Stun',
  'Resurrect',
  'Befriend',
  'Found Faction',
  'Induct to Faction',
  'Message',
  'Burst',
  'Shield',
  'Resist Magic',
  'Sentinel',
  'Detect Magic',
  'Light',
  'Map',
  'Profile Person',
  'Alert',
  'Scry',
  'Coordinates',
  'Advertise',
  'Invisibility',
  'Hide Magic',
  'Storage',
  'Permanency',
  'Mana Pool',
  'Trigger'
]

try {
  exports.SPELL_LIST = SPELL_LIST;
} catch (exception) {
}
