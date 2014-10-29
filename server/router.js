/**
 * Define server routes
 */
'use strict';

var express = require('express'),
    root_router = express.Router(),
    api_router = express.Router(),
    core = require('./core'),
    fs = require('fs');

//---- Router middleware --------------------
//TODO: need to track all server calls made by the user and put it in db (may be when exception occurs)
root_router.use(function (req, res, next) {
    var ip = req.header('x-forwarded-for') || req.connection.remoteAddress;
    console.log('router.js: ', req.method, req.url, 'from', ip);
    next();
});

//---- Generic route definitions ----------------
root_router.post('/exception', post_exception);
/* Log exceptions in db */
function post_exception(req, res) {
    console.log('write to db:');
    console.log(req.param('utc_date') + ':' + req.param('timezone') + ':' + req.param('browser_name') + ":" + req.param('browser_version') + ":" + req.param('message'));//or req.body.message if bodyParser is used

    //TODO: write these params to exception table/document using req.db.xyz query so that it would use either mongodb or cassandra module
    //TODO: use a generic function passing these params as json so that the same can also be called in server side exceptions

    res.end();//so that callback of the post request in core.js gets called
}

setRoutesFromModule(__dirname + '/oauth', root_router, null);//load oauth routes
setRoutesFromSubdirs(__dirname + '/pages/', root_router, api_router);//load page specific routes

function setRoutesFromSubdirs(path, page_router, api_router) {
    var dirs = core.getDirectoriesSync(path);
    console.log('....... Scanning routes in directories: ' + dirs);
    for (var modulepath, i = 0; i < dirs.length; i++) {
        modulepath = path + dirs[i] + '/' + dirs[i];
        setRoutesFromModule(modulepath, page_router, api_router);
    }
}

function setRoutesFromModule(modulepath, page_router, api_router){
    if (fs.existsSync(modulepath + ".js")) {
        try {
            var module = require(modulepath);
            if (page_router && module.page_routes) {
                module.page_routes(page_router);
                console.log("\tLoading page route module:" + modulepath);
            }
            if (api_router && module.api_routes) {
                module.api_routes(api_router);
                console.log("\tLoading api route module:" + modulepath);
            }
        } catch (e) {
            console.error("Route module failed to load:", modulepath);
            //Doesn't matter, go ahead with next directory
        }
    }
}

module.exports = {
    root_router: root_router,
    api_router: api_router
}