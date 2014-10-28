'use strict';
var fs = require('fs');

module.exports = {
    getDirectoriesSync: getDirectoriesSync,
    getFilesSync      : getFilesSync,
    bind_data         : bind_data
};

function getDirectoriesSync(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory();
    });
}

function getFilesSync(path) {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isFile();
    });
}

function bind_data(json) {
    var bindScript = '<script src="js/common.js"></script>' +
        '<script>$(function () { commonModule.bind_data(' + JSON.stringify(json) + '); });</script>';
    return { bind_data: bindScript };
}