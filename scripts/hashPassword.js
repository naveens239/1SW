var common       = require('./common'),
    _            = require('underscore'),
    country_code = '+91';

common.connect_mongoose();

var UserModel = require('../server/models/user');

common.connect_monk('vendor_account');
common.find(function (err, accounts) {
    //console.log('----------------------------------------------------');
    _.each(accounts, function (account, key) {
        //createNewUser(account);
        comparePassword(account);
    });
    console.log('----------------------------------------------------');
    console.log('number of records:' + accounts.length);
    console.log('----------------------------------------------------');
    //process.exit(0);
});

function createNewUser(account) {
    //console.log('oauth_id:'+account.oauth_id);
    var user = new UserModel({
        username: account.oauth_id,
        password: account.password
    });
    user.save(function (err, user) {
        if (err) {
            console.log('Error saving user : ' + user);
        }
        else {
            console.log('Success saving user : ' + user);
        }
    });
}

function comparePassword(account){
    var oauth_id = account.oauth_id;
    var oauthIsEmail = oauth_id.indexOf('@') > 0;
    //if oauth_id is mobile, add country_code
    if (!oauthIsEmail && oauth_id.length == 10) {
        oauth_id = country_code + oauth_id;
    }

    UserModel.findOne({username:oauth_id}, function(err, user){
        if(err){
            console.log(err);
            throw err;
        }
        if(user) {
            user.comparePassword(account.password, function (err, isMatched) {
                console.log('Account:' + user.username + ', Password matched:' + isMatched);
            });
        }
    });

}