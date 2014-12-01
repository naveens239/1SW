var common = require('./common'),
    _      = require('underscore');

common.connect_monk('vendor_account');

common.find({featured: {$gt: 0}}, {
        sort  : {featured: 1},
        fields: {_id: false, oauth_id: true, "vendor_profile.vendor_name": true}
    },
    function (err, accounts) {
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
//