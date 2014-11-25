//will be merged with mongo.js module during server start and is accessible using req.db
module.exports = function (db) {

    return {
        /**
         * Fetches from vendor_account collection
         * return eg: [{"oauth_id":"ppc@gmail.com"},{"oauth_id":"1112223333"}]
         */
        getFeaturedVendors: function (callback) {
            console.log('db::getVendorServices');
            var collection = db.getDBinstance().get('vendor_account');
            collection.find({featured: {$gt: 0}}, {sort: {featured: 1},
                fields                                 : {
                    _id                         : false,
                    oauth_id                    : true,
                    "vendor_profile.vendor_name": true
                }
            }, callback);
        }
    };
}