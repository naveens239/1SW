var mongoose = require('mongoose');

var contact_schema = new mongoose.Schema({
    name   : String,
    phone  : String,
    email  : String,
    subject: String,
    message: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('contact', contact_schema);
