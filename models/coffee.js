var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CoffeeSchema   = new Schema({
    roaster: String,
    region: String,
    note: String,
    time: { type: Date, default: Date.now}
});

module.exports = mongoose.model('Coffee', CoffeeSchema);