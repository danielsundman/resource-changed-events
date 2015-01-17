var ResourceChangedEvents = require('../');
var should = require('should');
var nock = require('nock');

describe('Happy Path', function() {

	var mockNock = function(url, path, resp) {
		nock(url).get(path).reply(resp.statusCode, resp.data);
	};

	var doneCalled = false;
	var lenientDone = function(done) {
		if (!doneCalled) {
			done();
			doneCalled = true;
		}
	};

	beforeEach(function() {
		doneCalled = false
	});

	describe('init', function() {

		beforeEach(function() {
			mockNock('http://api.yds.se', '/1', {statusCode: 200, data: 'XXX 1'});
			mockNock('http://api.yds.se', '/2', {statusCode: 200, data: 'XXX 2'});
		});

		var verifyCallComplete = function(url, expected, done) {
			var rce = new ResourceChangedEvents({url: url, interval: 100});
			rce.on('data', function(data) {
				should.exist(data);
				data.should.equal(expected);
				rce.stop();
				lenientDone(done);
			});
			rce.start();
		};

		it('RCE instance should retrieve initial data "XXX 1" event for http://api.yds.se/1 on start', function(done) {
			verifyCallComplete('http://api.yds.se/1', 'XXX 1', done);
		});

		it('RCE instance should retrieve initial data "XXX 2" event for http://api.yds.se/2 on start', function(done) {
			verifyCallComplete('http://api.yds.se/2', 'XXX 2', done);
		});

	});

	describe('repeat', function() {

		var callCount = 0;

		beforeEach(function() {
			mockNock('http://api.yds.se', '/', {status: 200, data: 'XXX ' + (callCount++)});
		});

		it('RCE instance should keep calling url even after first invocation', function(done) {
			var rce = new ResourceChangedEvents({url: 'http://api.yds.se/', interval: 100});
			rce.on('data', function(data) {
				should.exist(data);
				mockNock('http://api.yds.se', '/', {status: 200, data: 'XXX ' + (callCount++)});
				if (callCount > 1) {
					rce.stop();
					lenientDone(done);
				}
			});
			rce.start();
		});

	});
});