var EventEmitter = require('events').EventEmitter;
var util = require('util');

exports = module.exports = ResourceChangedEvents;

function ResourceChangedEvents(config) {
}

util.inherits(ResourceChangedEvents, EventEmitter);