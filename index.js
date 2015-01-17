var EventEmitter = require('events').EventEmitter;
var util = require('util');
var request = require('request');
var debug = require('debug')('request');
var debugData = require('debug')('request:data');

exports = module.exports = ResourceChangedEvents;

function ResourceChangedEvents(config) {
	config = config || {};
	this.config = {};
	this.config.url = config.url || 'http://www.example.com'; // TODO exception
	this.config.interval = config.interval || 2000;
	this.conversion = config.conversion || function(data, cb) {
		cb(null, data);
	};
	this.diff = config.diff || function() {
		return true;
	};

	this.data = undefined;
	this.lastModified = undefined;
	this.running = false;
}

util.inherits(ResourceChangedEvents, EventEmitter);

ResourceChangedEvents.prototype.start = function() {
	var that = this;
	var interval = that.config.interval;

	this.running = true;

	var prepareRun = function() {
		var options = {
			url: that.config.url
		};
		if (that.lastModified) {
			options.headers = {
				'If-Modified-Since': that.lastModified
			}
		}
		return options;
	};

	var statusCodeOkAndStillRunning = function(response) {
		return (response.statusCode === 200 || response.statusCode === 304) && that.running;
	};

	var convert = function(data, cb) {
		var f = (typeof that.conversion === 'function') ? that.conversion : require(that.conversion);
		f(data, cb);
	};

	var diff = function(dataOld, dataNew) {
		var f = (typeof that.diff === 'function') ? that.diff : require(that.diff);
		return f(dataOld, dataNew);
	};

	var run = function() {
		var options = prepareRun();

		debug('requesting ' + JSON.stringify(options) + ' interval ' + interval);
		request(options, function(err, response, respData) {
			if (err) return;
			debug('status code ' + response.statusCode);
			if (response.statusCode === 200) {
				convert(respData, function(err, data) {
					debugData('data:' + JSON.stringify(data));
					if (diff(that.data, data)) {
						that.emit('data', data);
					}
					that.data = data;
					that.lastModified = response.headers['last-modified'];
				});
			}
			if (statusCodeOkAndStillRunning(response)) {
				setTimeout(run, interval);
			}
		});

	};
	setTimeout(run, interval);

};

ResourceChangedEvents.prototype.stop = function() {
	this.running = false;
};
