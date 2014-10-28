'use strict';
var viewUtil = require(__server_path + '/view_util'),
    _ = require('underscore');

module.exports = {
    page_routes: function (router) {
        router.get('/vendor_home', ensureAuthenticated, vendor_home);
    }
}

function ensureAuthenticated(req, res, next) {
    console.log('in ensureAuthenticated:' + req.isAuthenticated());
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function vendor_home(req, res) {
    console.log("****** successfully logged in:" + req.session.passport.user.name + "\n");
    viewUtil.renderPageModule('vendor_home', res, {});
}