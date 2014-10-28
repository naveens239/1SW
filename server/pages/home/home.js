'use strict';
var viewUtil = require(__server_path + '/view_util');

module.exports = {
    page_routes: function (router) {
        router.get('/', home);
        router.get('/home', home);
    }
}

function home(req, res) {
    var _i = req.i18n,
        WelcomeMsg = "",
        isLoggedIn = false;

    if(req.session.passport.user){
        var name = req.session.passport.user.name || "friend";
        isLoggedIn = true;
        WelcomeMsg = _i.__("Welcome %s", name);
    }
    console.log('isLoggedIn:'+isLoggedIn);
    viewUtil.renderPage('home/home', res, {
        lang: _i.getLocale(),
        title: _i.__("Wedding Planner"),
        isLoggedIn: isLoggedIn,
        WelcomeMsg: WelcomeMsg
    });
}
