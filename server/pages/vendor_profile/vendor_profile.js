'use strict';
var viewUtil = require(__server_path + '/view_util'),
    core = require(__server_path + '/core'),
    config = require(__server_path + '/config'),
    formidable = require('formidable'),
    util = require('util'),
    fs = require('fs-extra'),
    _ = require('underscore');

module.exports = {
    page_routes: function (router) {
        router.get('/vendor_profile', vendor_profile);
        router.post('/vendor_profile_save', vendor_profile_save);
        router.post('/upload', upload);
    },

    api_routes: function (router) {
        router.post('/save_in_session', save_in_session);
    }
}

function upload(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
        res.writeHead(200, {'content-type': 'text/plain'});
        res.write('received upload:\n\n');
        res.end(util.inspect({fields: fields, files: files}));
    });

    form.on('end', function (fields, files) {
        /* Temporary location of our uploaded file */
        var temp_path = this.openedFiles[0].path;
        /* The file name of the uploaded file */
        var file_name = this.openedFiles[0].name;
        /* Location where we want to copy the uploaded file */
        var new_location = __client_path + '/uploads/' + req.session.passport.user.oauth_id;

        try {
            if (!fs.existsSync(new_location)) {
                fs.mkdirpSync(new_location);
            }
            fs.copy(temp_path, new_location + '/' + file_name, function (err) {
                if (err) {
                    console.error(err);
                } else {
                    console.log("success!")
                }
            });
        } catch (e) {
            throw e;
        }
    });
}

function setProfileInSession(req) {
    var profile = req.session.passport.user.vendor_profile ? req.session.passport.user.vendor_profile : {};
    console.log(JSON.stringify(req.body));
    //TODO: should check for valid_items before storing in db.
    /*var valid_items = ['vendor_name', 'email', 'website', 'facebook', 'twitter',
     'mobile', 'altphone', 'landphone', 'addressline1', 'addressline2', 'city', 'pincode', 'state',
     'selectSevice'];

     _.each(valid_items, function(item){
     if(req.body[item]){
     profile[item] = req.body[item];
     }
     });*/
    //TODO: replace with above commented code once valid_items are known
    _.each(req.body, function (value, key) {
        profile[key] = value;
    });

    req.session.passport.user.vendor_profile = profile;
    return profile;
}

//Note: Commented for testing purpose.
function vendor_profile(req, res) {
    if (!req.session.passport.user || !req.session.passport.user.oauth_id) {
        console.log("Error finding oauth_id");
        res.redirect("/");
    }
    var oauth_id = req.session.passport.user.oauth_id;
    console.log("vendor_profile for oauth_id:" + oauth_id);

    if (req.session.passport.user.vendor_profile) {
        var profile = req.session.passport.user.vendor_profile;
        autofill_phone_or_email(oauth_id, profile);
        viewUtil.renderPageModule('vendor_profile', res, _.extend(core.bind_data(profile), {'vendor_services': config.vendor_services}));
    } else {
        req.db.getVendorAccount(oauth_id, function (e, docs) {
            console.log("account -> " + JSON.stringify(docs));
            if (docs && docs.vendor_profile) {
                req.session.passport.user.vendor_profile = docs.vendor_profile;
            }
            var profile = req.session.passport.user.vendor_profile ? req.session.passport.user.vendor_profile : {};
            autofill_phone_or_email(oauth_id, profile);
            viewUtil.renderPageModule('vendor_profile', res, _.extend(core.bind_data(profile), {'vendor_services': config.vendor_services}));
        });
    }
}

function autofill_phone_or_email(oauth_id, profile) {
    if (profile.is_local_login) {
        var validator = require(__client_path + '/js/libs/validate.min.js');
        var commonModule = require(__client_path + '/js/common.js');
        var oauth_id_is_email = validator.validate({email: oauth_id}, { email: commonModule.constraints.email });
        var oauth_id_is_mobile = validator.validate({mobile: oauth_id}, { mobile: commonModule.constraints.mobile });

        if (!profile.email && oauth_id_is_email) {
            profile.email = oauth_id;
        }
        else if (!profile.mobile && oauth_id_is_mobile) {
            profile.mobile = oauth_id;
        }
    }
}

//Test code to skip mandatory login check is skipped
function vendor_profile_test(req, res) {
    viewUtil.renderPageModule('vendor_profile', res, {});
}

function save_in_session(req, res) {
    setProfileInSession(req);
    res.send(true);
}

function vendor_profile_save(req, res) {
    var profile = setProfileInSession(req);

    var oauth_id = req.session.passport.user.oauth_id;
    console.log(oauth_id);
    //Save profile in database
    //Note: saveVendorProfile is defined in mongo_extension.js
    req.db.saveVendorProfile(oauth_id, profile);

    res.send(true);
}