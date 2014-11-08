'use strict';
var viewUtil = require(__server_path + '/view_util'),
    path      = require('path');

module.exports = {
    page_routes: function (router) {
        router.get('/contact', get_contact);
    },
    api_routes: function(router){
        router.post('/contact', post_contact);
    }
}

function get_contact(req, res) {
    if(req.isAuthenticated()){
        viewUtil.renderPageModule('vendor_contact', res, {});
    }
    else{
        viewUtil.renderPageModule('contact', res, {});
    }
}

function post_contact(req, res) {
    var json = req.body;

    /*json.created = Date.now();
    req.db.saveContact(json);
    res.send(true);*/

    //json.created = Date.now();
    var contact_model_class = require(path.join(__server_path , 'models/contact'));
    var contact_model = new contact_model_class(json);
    console.log(contact_model);
    contact_model.save(function (err) {
        if (err) {
            console.log(err);
            return;//TODO: handle error
        }
        res.send(true);
    });
}