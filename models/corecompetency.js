var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var SolutionSchema   = new Schema({

	name: String
	
});

module.exports = mongoose.model('CoreCompetency', SolutionSchema);