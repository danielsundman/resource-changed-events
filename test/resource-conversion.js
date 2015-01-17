var ResourceChangedEvents = require('../');
var should = require('should');
var nock = require('nock');

describe('Resource Conversion', function() {

	beforeEach(function() {
		nock('http://api.yds.se/xml')
			.get('/')
			.reply(200, '<root><event id="123">xxx</event></root>');
	});

	it('when xml parsing is requested the data should be parsed as XML and returned as a JS object', function(done) {
		var rce = new ResourceChangedEvents({url: 'http://api.yds.se/xml/', interval: 100, conversion:'./xml-conversion'});
		rce.on('data', function(data) {
			should.exist(data);
			(typeof data).should.equal('object');
			should.exist(data.root);
			(typeof data.root).should.equal('object');
			data.root.event.length.should.equal(1);
			data.root.event[0]._.should.equal('xxx');
			data.root.event[0].$.id.should.equal('123');
			rce.stop();
			done();
		});
		rce.start();
	});

});