var monk       = require('monk'),
    dbconfig   = require('../server/config').dbconfig,
    dbInstance = monk(dbconfig.dburl),
    collection = dbInstance.get('vendor_account'),
    _          = require('underscore');

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
    find: find
}