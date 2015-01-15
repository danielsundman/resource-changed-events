var EventEmitter = require('events').EventEmitter;
var util = require('util');
var request = require('request');

exports = module.exports = ResourceChangedEvents;

function ResourceChangedEvents(config) {
	this.config = config;
}

util.inherits(ResourceChangedEvents, EventEmitter);

ResourceChangedEvents.prototype.start = function() {
	var that = this;
	request(this.config.url, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			that.emit('data', body);
		}
	});
};


