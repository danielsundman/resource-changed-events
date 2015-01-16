var EventEmitter = require('events').EventEmitter;
var util = require('util');
var request = require('request');
var debug = require('debug')('request');

exports = module.exports = ResourceChangedEvents;

function ResourceChangedEvents(config) {
	config = config || {};
	this.config = {};
	this.config.url = config.url || 'http://www.example.com'; // TODO exception
	this.config.interval = config.interval || 2000;
}

util.inherits(ResourceChangedEvents, EventEmitter);

ResourceChangedEvents.prototype.start = function() {
	var that = this;
	var url = this.config.url;
	var interval = this.config.interval;
	this.timeout = setInterval(function() {
		debug('requesting ' + url);
		request(url, function (err, response, body) {
			if (!err && response.statusCode === 200) {
				debug('response status ' + response.statusCode + ' data ' + body);
				that.emit('data', body);
			}
		}, interval);
	});
};

ResourceChangedEvents.prototype.stop = function() {
	if (this.timeout) {
		clearInterval(this.timeout);
		this.timeout = undefined;
	}
};


