var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var searchSchema = new Schema({
    search: String,
    created_at: Date
})

//saves time query is made into db.
searchSchema.pre('save', function(next){
    var currentDate = new Date();
    this.created_at = currentDate;
    next();
})

var searches = mongoose.model('Search', searchSchema);


module.exports = searches; 