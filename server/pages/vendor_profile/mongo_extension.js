//will be merged with mongo.js module during server start and is accessible using req.db
module.exports = function (db) {

    return {
        /**
         * Saves vendor_profile in vendor_account collection
         */
        saveVendorProfile: function (oauth_id, profile) {
            console.log('db::saveVendorProfile');
            var collection = db.getDBinstance().get('vendor_account');
            collection.update(
                {oauth_id: oauth_id}, // query
                {$set: {vendor_profile: profile}} // replacement, replaces only the field "profile"
            );
        },

        /**
         * Fetches from vendor_services collection
         * return eg: [{"name":"Catering","value":"catering"},{"name":"Wedding Venue/Halls","value":"venue"}]
         */
        getVendorServices: function (callback) {
            console.log('db::getVendorServices');
            var collection = db.getDBinstance().get('vendor_services');
            collection.find({}, { fields: {_id: false, name: true, value: true  }}, callback);
        }
    }
}