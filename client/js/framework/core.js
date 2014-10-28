'use strict';
//--Dependencies---------------------------------------------------------------
var log = require('../../js/framework/log'),
    backend = require('../../js/framework/backend'),
    riot = require('../../js/libs/riot'),//MVC framework
    jstz = require('../../js/libs/jstz.min.js').jstz,//Detect timezone
    bowser = require('../../js/libs/bowser.min.js').browser;//Detect ios app / android app / browser and version

var core = {
    lang: 'en',
    isAndroid: bowser.android || false,//If not using bowser, this could be directly set by the android app at load
    isiOS: bowser.ios || false,//If not using bowser, this could be directly set by the iOS app at load
    isTablet: bowser.tablet || false,
    isMobile: bowser.mobile || false,
    browser_name: bowser.name,
    browser_version: bowser.version,
    timezone: jstz.determine().name(), //save timezone name at initial load

    //saves page object. eg: core.pages.home = {model:HomeModel}
    pages: {},
    //TODO: track user action which will be written in db if exception occurs for debugging purposes.
    //eg core.pages.userAction.push({'click':<utc_date when event occurred>, desc: '<details>'});
    userAction: [],

    initPage: function (model) {
        baseExceptionHandler();
        monitorHashchange(model);
    },

    logException: logException
};
module.exports = core;

//-- Private --//
function logException(e) {
    var json = (e instanceof Error) ? jsonFromError(e) : e;
    if (e.customField) {
        console.log(e.customField);
    }
    //Pass additional exception circumstances to db
    var data = {
        browser_name: core.browser_name,
        browser_version: core.browser_version,
        utc_date: Date.now(),
        timezone: core.timezone
    };
    $.extend(json, data);

    log.info(JSON.stringify(json));

    backend.call({url: "/exception", type: "post", data: json})
        .done(function () {
            log.info("...saving exception in db .done");
        }).fail(function () {
            log.info("...saving exception in db .fail");
        });
}

function baseExceptionHandler() {
    window.onerror = function (message, sourceURL, line, column, stack) {
        log.info('Browser: ' + core.browser_name + ', Version: ' + core.browser_version);
        log.info('isAndroid: ' + core.isAndroid + ', isiOS: ' + core.isiOS);
        log.info('isTablet: ' + core.isTablet + ', isMobile: ' + core.isMobile);

        log.error(jsonFromError(null, message, sourceURL, line, column, stack));//saves to db
        //return true;//no additional handling
        return false;//continue default handling
    };
}

function jsonFromError(e, message, sourceURL, line, column, stack) {
    if (e instanceof Error) {
        message = e.message;
        sourceURL = e.sourceURL;
        line = e.line || e.lineNumber;//mozilla uses lineNumber, safari uses line
        column = e.column || e.columnNumber;//mozilla uses columnNumber, safari uses column
        stack = e.stack;
    }

    return {
        message: message || "Unknown Error",
        sourceURL: sourceURL || "",
        line: line || "",
        column: column || "",
        stack: stack || ""
    };
}

//Hash change format eg: http://localhost:3000/home#/add
function monitorHashchange(model) {
    riot.route(function (hash) {
        //Triggers the hashchange method which is added to the model by the view using model.on(...).
        var value = hash.slice(2);
        log.info('hash changed:' + value);
        model.trigger('hashchange', value);
    });
}
