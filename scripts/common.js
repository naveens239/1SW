var monk     = require('monk'),
    dbconfig = require('../server/config').dbconfig,
    mongoose,
    dbInstance,
    collection,
    _        = require('underscore');

function connect_monk(collection_name)
{
    dbInstance = monk(dbconfig.dburl);
    if (collection_name) useCollection(collection_name);
}

function useCollection(collection_name)
{
    collection = dbInstance.get(collection_name);
}

function connect_mongoose()
{
    mongoose = require('mongoose');
    mongoose.connect('mongodb://' + dbconfig.dburl);
    mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    mongoose.connection.once('open',
        function callback()
        {
            console.log('Mongoose connected to DB');
        });
    return mongoose;
}

function find(conditions, options, callback)
{
    if (_.isFunction(options))
    {
        callback = options;
        options = null;
    }
    if (_.isFunction(conditions))
    {
        callback = conditions;
        conditions = {};
    }

    options ? collection.find(conditions, options, callback)
        : collection.find(conditions, callback);
}

module.exports = {
    dbInstance       : dbInstance,
    connect_mongoose : connect_mongoose,
    connect_monk     : connect_monk,
    useCollection    : useCollection,
    find             : find
};