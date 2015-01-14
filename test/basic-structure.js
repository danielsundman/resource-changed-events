var ResourceChangedEvents = require('../');
var should = require('should');

describe('Basic Structure', function() {
	it('ResourceChangedEvents should exist', function() {
		should.exist(ResourceChangedEvents);
	});
	it('ResourceChangedEvents should be a function', function() {
		(typeof ResourceChangedEvents).should.equal('function');
	});
	it('ResourceChangedEvents should take one argument', function() {
		ResourceChangedEvents.length.should.equal(1);
	});
});