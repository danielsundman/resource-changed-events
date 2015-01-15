var ResourceChangedEvents = require('../');
var should = require('should');
var nock = require('nock');

describe('Happy Path', function() {

	beforeEach(function() {
		nock('http://www.example.com')
			.get('/1')
			.reply(200, 'XXX 1');
		nock('http://www.example.com')
			.get('/2')
			.reply(200, 'XXX 2');
	});

	it('RCE instance should retrieve initial data "XXX 1" event for http://www.example.com/1 on start', function(done) {
		var rce = new ResourceChangedEvents({url: 'http://www.example.com/1'});
		rce.on('data', function(data) {
			should.exist(data);
			data.should.equal('XXX 1');
			done();
		});
		rce.start();
	});

	it('RCE instance should retrieve initial data "XXX 2" event for http://www.example.com/2 on start', function(done) {
		var rce = new ResourceChangedEvents({url: 'http://www.example.com/2'});
		rce.on('data', function(data) {
			should.exist(data);
			data.should.equal('XXX 2');
			done();
		});
		rce.start();
	});

});