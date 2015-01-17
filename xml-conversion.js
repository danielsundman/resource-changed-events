var xml2js = require('xml2js');
module.exports = function(data, cb) {
	var parser = new xml2js.Parser();
	parser.parseString(data, function (err, result) {
		if (err) return cb(err);
		cb(null, result);
	});
};
