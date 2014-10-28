//will be merged with mongo.js module during server start and is accessible using req.db
module.exports = function (db) {

    return {
        saveContact: function (json) {
            console.log('db::saveContact');
            var collection = db.getDBinstance().get('contact');
            collection.insert(json);
        }
    }
}