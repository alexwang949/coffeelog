var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CoffeeshopSchema   = new Schema({
    name: String,
    address: String
});

module.exports = mongoose.model('Coffeeshop', CoffeeshopSchema);