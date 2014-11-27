var monk       = require('monk'),
    dbconfig   = require('../server/config').dbconfig,
    dbInstance = monk(dbconfig.dburl),
    collection = dbInstance.get('vendor_account'),
    _          = require('underscore');

function connect_mongoose(){
    var mongoose = require('mongoose');
    mongoose.connect('mongodb://' + dbconfig.dburl);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open', function callback() {
        console.log('Mongoose connected to DB');
    });
    return mongoose;
}

function find(conditions, options, callback) {
    if (_.isFunction(options)) {
        callback = options;
        options = null;
    }
    if (_.isFunction(conditions)) {
        callback = conditions;
        conditions = {};
    }

    options ? collection.find(conditions, options, callback)
        : collection.find(conditions, callback);
}

module.exports = {
    connect_mongoose: connect_mongoose,
    find: find
}