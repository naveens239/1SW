var monk       = require('monk'),
    dbconfig   = require('../server/config').dbconfig,
    dbInstance = monk(dbconfig.dburl),
    collection = dbInstance.get('vendor_account');

function find(conditions, options, callback){
    conditions = conditions ? conditions : {};
    options ? collection.find(conditions, options, callback)
        : collection.find(conditions, callback);
}

module.exports = {
    find: find
}