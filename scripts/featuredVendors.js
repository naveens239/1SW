var monk       = require('monk'),
    dbconfig   = require('../server/config').dbconfig,
    dbInstance = monk(dbconfig.dburl),
    collection = dbInstance.get('vendor_account'),
    _          = require('underscore');

collection.find({featured:{$gt:0}}, { sort : { featured : 1 } }, function (err, accounts) {
    console.log('----------------------------------------------------');
    var vendor_name;
    _.each(accounts, function (account, key) {
        vendor_name = account.vendor_profile ? account.vendor_profile.vendor_name : "";
        console.log(account.oauth_id + " : " + vendor_name);
    });
    console.log('----------------------------------------------------');
    console.log('number of records:' + accounts.length);
    console.log('----------------------------------------------------');
    process.exit(0);
});
