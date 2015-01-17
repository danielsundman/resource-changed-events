var ResourceChangedEvents = require('../');
var should = require('should');
var nock = require('nock');

describe('User Controlled Diff', function() {

	beforeEach(function() {
		nock('http://api.yds.se/diff')
			.get('/')
			.reply(200, 'XXX');
	});

	var verifyDiff = function(diffConfig, done) {
		var rce = new ResourceChangedEvents({url: 'http://api.yds.se/diff/', interval: 100, diff: diffConfig});
		rce.on('data', function() {
			done('should not happen!');
		});
		rce.start();
		setTimeout(function() {
			done()
		}, 200);
	};

	it('when xml parsing is requested the data should be parsed as XML and returned as a JS object', function(done) {
		verifyDiff(function() {
			return false;
		}, done);
	});

	it('when xml parsing is requested the data should be parsed as XML and returned as a JS object, diff config specified in module', function(done) {
		verifyDiff('./test/no-diff', done);
	});

});