/**
 * Log module
 */
'use strict';

module.exports = {
    info: function (text) {
        console.log(text);
    },
    //e could be Error object or a json
    error: function (e) {
        var core = require('../../js/framework/core');
        core.logException(e);
    }
};