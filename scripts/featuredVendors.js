var monk       = require('monk'),
    dbconfig   = require('../server/config').dbconfig,
    dbInstance = monk(dbconfig.dburl),
    collection = dbInstance.get('vendor_account'),
    _          = require('underscore');

collection.find({featured:{$gt:0}}, { sort : { featured : 1 } }, function (err, accounts) {
    var numRecords = 0;
    console.log('----------------------------------------------------');
    _.each(accounts, function (account, key) {
        var vendor_name = account.vendor_profile ? account.vendor_profile.vendor_name : "";
        numRecords++;
        console.log(account.oauth_id + " : " + vendor_name);
    });
    console.log('----------------------------------------------------');
    console.log('number of records:' + numRecords);
    console.log('----------------------------------------------------');
    process.exit(0);
});
