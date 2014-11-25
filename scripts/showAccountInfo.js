var common = require('./common'),
    _      = require('underscore');

common.find({}, {sort: {created: 1}}, function (err, accounts) {
    var numRecords = 0;
    console.log('----------------------------------------------------');
    _.each(accounts, function (account, key) {
        var created_date = new Date(account.created);
        var vendor_name = account.vendor_profile ? account.vendor_profile.vendor_name : "";
        numRecords++;
        console.log(created_date.toDateString() + " : " + vendor_name);
    });
    console.log('----------------------------------------------------');
    console.log('number of records:' + numRecords);
    console.log('----------------------------------------------------');
    process.exit(0);
});