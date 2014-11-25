'use strict';
var viewUtil = require(__server_path + '/view_util');

module.exports = {
    page_routes: function (router) {
        router.get('/featured_vendor/:user_id', featured_vendor);
    }
}

function featured_vendor(req, res) {
    var user_id = req.params.user_id;

    req.db.getVendorAccount(user_id, function (err, account) {
        var address = getAddress(account.vendor_profile);
        viewUtil.renderPage('featured_vendor/featured_vendor', res, {
            user_id: user_id,
            profile: account.vendor_profile,
            address: address
        });
    });
}

function getAddress(profile){
    var addressArray = [];
    if(profile.addressline1) addressArray.push(profile.addressline1);
    if(profile.addressline2) addressArray.push(profile.addressline2);
    if(profile.city) addressArray.push(profile.city);
    if(profile.state) addressArray.push(profile.state);
    if(profile.pincode) addressArray.push(profile.pincode);
    return addressArray.join(",");
}
