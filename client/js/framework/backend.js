'use strict';

/**
 * Backend module. Underlying implementation can change
 * @type {{call: call}}
 */
module.exports = {
    call: function (params) {
        if (!params.cache) {
            params.cache = false;
            params.url += (params.url.indexOf("?") === -1) ? "?" : "&";
            params.url += "time=" + new Date().getTime();
        }
        if (!params.timeout) {
            params.timeout = 5000;
        }
        /*if (params.url && params.url.substr(0, 1) === "/") {
         params.url = "http://localhost:3000" + params.url;
         log.info(params.url);
         }
         */
        return $.ajax(params);
    },

    fail: function (jqXHR, textStatus, errorThrown) {
        console.log("***in fail");
        console.log("jqXHR:" + JSON.stringify(jqXHR));
        console.log("***textStatus:" + textStatus);
        console.log("***errorThrown:" + errorThrown);
        //if(textStatus === "timeout"){}
        alert('Failed to load');
    }
};