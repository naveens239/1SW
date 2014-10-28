/**
 * The js starting point of the app, referenced from package.json
 */
'use strict';

console.log(
        '                         *  *  *  *  *  *  *  *  *  *                         \n' +
        '                       *                              *                       \n' +
        ' * * * * * * * * * * *     1 S t o p W e d . c o m      * * * * * * * * * * * \n' +
        '                       *                              *                       \n' +
        '                         *  *  *  *  *  *  *  *  *  *                           ');

var config = require('./config'),
    core = require('./core'),
    express = require('express'),
    path = require('path'),
    hbs = require('hbs'),
    fs = require('fs'),
    _ = require('underscore');

var root_path = path.join(__dirname, '..');
global.__server_path = path.join(root_path, 'server');
global.__client_path = path.join(root_path, 'client');

//-----------------------Set environment
var app = express();
config.environment = app.get('env');
console.log("environment: " + config.environment);
if (config.environment === 'production') {
    _.extend(config, require('./config.' + config.environment));//extend/overwrite with env specific configuration
}
//----------------------
oauthConfig();
viewConfig();
databaseConfig();
fetchStaticData();
internationalizationConfig();
routeConfig();
errorConfig();
loggerConfig();
registerPartials(path.join(__client_path, 'partials'));
startServer();

//-----------------------
function oauthConfig() {
    var session = require('express-session'),
        flash = require('express-flash'),
        passport = require('passport');

    require('./oauth.js');//just load

    //var MongoStore = require('connect-mongo')(session);
    app.use(session({
        secret           : 'vandrum secret',
        saveUninitialized: true, //to avoid deprecated msg
        resave           : true //to avoid deprecated msg
        /*,store: new MongoStore({
         db: config.dbip + ":27017"
         })*/
    }));

    app.use(flash());
    app.use(passport.initialize());
    app.use(passport.session());
}

function viewConfig() {
    var bodyParser = require('body-parser'),
        cookieParser = require('cookie-parser');

    app.set('views', path.join(__client_path, 'pages'));
    app.set('view engine', 'html');
    app.engine('html', hbs.__express);

    //var favicon = require('serve-favicon');
    //app.use(favicon());//TODO: shouldn't we give path like app.use(favicon(__client_path + '/favicon.ico')); ?

    app.use(cookieParser());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());

    app.use(express.static(__client_path));//Anything under client will not go through routing
}

function databaseConfig() {
    var db = require(config.dbconfig.dbpath);//Load main db module

    //Get additional db functions from page folders
    var scanPath = path.join(__server_path, 'pages');
    var dirs = core.getDirectoriesSync(scanPath);
    setDBextensions(db, dirs, scanPath);//extend main db module

    config.db = db;//saving for use in passport

    app.use(function (req, res, next) {
        //req.i18n.setLocaleFromQuery();//works without this
        req.db = db;//Make our db accessible in router. Need to do this before executing app.use('/', routes);
        //console.log('req.method:%s, req.url:%s', req.method, req.url);//logs all requests including js, css GET request
        next();
    });
}

function fetchStaticData(){
    //fetch vendor services during start. will be used in vendor profile page
    config.db.getVendorServices(function(error, vendor_services) {
        if(error){
            throw error;
        }
        //console.log('vendor_services:' + JSON.stringify(vendor_services));
        config.vendor_services = vendor_services;
    });
}

function setDBextensions(db, dirs, scanPath) {
    console.log('....... Scanning DB extensions in directories: ' + dirs);
    for (var module, modulepath, i = 0; i < dirs.length; i++) {
        modulepath = path.join(scanPath, dirs[i], config.dbconfig.dbextension_module);
        if (fs.existsSync(modulepath + ".js")) {
            try {
                module = require(modulepath);
                console.log('\tLoading DB extension: ' + modulepath);
                if (module) {
                    _.extend(db, module(db));
                }
            } catch (e) {
                console.error("DB extension module load failed:", modulepath);
                //Doesn't matter, go ahead with next directory
            }
        }
    }
}

function internationalizationConfig() {
    var i18n = require('i18n-2');
    i18n.expressBind(app, {
        locales  : ['en', 'ml'],
        directory: 'server/locales',
        extension: '.json'
    });
}

function routeConfig() {
    var router = require('./router');
    app.use('/', router.root_router);
    app.use('/api', router.api_router);
    //app.use('/vendor', router.vendor_router)
}

function errorConfig() {
    // catch 404 and forward to error handler
    app.use(function (req, res, next) {//TODO: how is this working?
        var err = new Error('Path Not Found: ' + req.url);
        err.status = 404;

        //TODO: save the error url in db.

        next(err);
    });
    // error handlers
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);

        res.render('error', {
            message: err.message//,
            //error: (config.environment === "development") ? err : {} //show stacktrace only in development
        });
    });
}

function loggerConfig() {
    //var logger = require('morgan');//TODO: how to use morgan correctly? is it needed?
    //app.use(logger('dev'));
}

function registerPartials(scanPath) {
    var file, isJS, isCSS, template, tagStart, tagEnd,
        files = core.getFilesSync(scanPath);
    console.log('....... Scanning partials: ' + files);
    for (var i = 0; i < files.length; i++) {
        file = files[i];
        isJS = (file.indexOf('.js') >= 0);
        isCSS = (file.indexOf('.css') >= 0);
        tagStart = isJS ? '<script>' : isCSS ? '<style>' : "";
        tagEnd = isJS ? '</script>' : isCSS ? '</style>' : "";
        template = tagStart + fs.readFileSync(path.join(scanPath, file), 'utf8') + tagEnd;
        hbs.registerPartial(file, template);
    }
}

function startServer() {
    app.set('port', config.port);
    var server = app.listen(app.get('port'), function () {
        console.log('Express server listening on port ' + server.address().port);
    });
    return server;
}