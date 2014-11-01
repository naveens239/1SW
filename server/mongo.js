'use strict';
var dbconfig = require('./config').dbconfig;
var monk = require('monk');//monk will load mongodb
var dbInstance;
var _ = require('underscore');

function init() {
    var dburl = dbconfig.dburl;
    var delimiter = "?";
    _.each(dbconfig.dbConnectionConfig, function (value, key) {
        if (value !== null && value !== undefined) {
            dburl += delimiter + key + "=" + value;
            delimiter = "&";
        }
    });
    console.log("connecting db:" + dburl);
    dbInstance = monk(dburl);
}
init(); //calls when server starts

module.exports = {
    getDBinstance: function(){ return dbInstance; },
    getUserAccount: function(username, callback){
        console.log('db::getUserAccount');
        var collection = this.getDBinstance().get('user_info');

        var user = collection.findOne({username:username}, callback);
        return user;
    },
    createUserAccount: function(json, callback){
        console.log('db::createUserAccount');
        var collection = this.getDBinstance().get('user_info');
        collection.insert(json, callback);
    },
    createVendorAccount: function(json, callback){
        console.log('db::createVendorAccount');
        var collection = this.getDBinstance().get('vendor_account');
        collection.insert(json, callback);
    },
    getVendorAccount: function (oauth_id, callback) {
        console.log('db::getVendorAccount');
        var collection = this.getDBinstance().get('vendor_account');
        var user = collection.findOne({oauth_id:oauth_id}, callback);
        return user;
    },
    list: function(table, callback){
        var collection = this.getDBinstance().get(table);
        collection.find({}, function(e, docs){
            var record = (docs && docs.length>0) ? docs : [];
            console.log("list -> "+record);
            if(callback){
                callback(null, record);
            }
        });
    }
}