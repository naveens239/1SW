var mongoose = require('mongoose');
//TODO: should it be new mongoose.Schema?
var vendor_services_schema = new mongoose.Schema({
    name : String,
    value: String
});

vendor_services_schema.methods.findAll = function(callback){
    this.model('vendor_services').find({}, function (err, vendor_sevices) {
        if(err) {
            console.log(err);
            return;//TODO: handle error
        }
        callback(vendor_sevices);
    });
}

module.exports = mongoose.model('vendor_services', vendor_services_schema);
