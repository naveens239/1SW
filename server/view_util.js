// Helper for rendering view
// {{{css}}} and {{{js}}} variables are available for optional use in any html page rendered using renderPage function
// {{{css}}} would be replaced by the path of <pageName>.css
// {{{js}}} would be replaced by the path of <pageName>.js
// eg. In pages/home/home.html, if u add these variables:
// <head>
//      {{{css}}}
//      {{{js}}}
//  </head>
// it will be replaced by:
// <head>
//      <link rel="stylesheet" href="pages/home/home.css">
//      <script src="pages/home/home_controller.js"></script>
// </head>
'use strict';
module.exports = {

    renderPage: function (pagePath, res, jsonData) {
        if (!jsonData) jsonData = {};
        //var modulePath = 'pages/' + pagePath;

        //Custom keys can be allowed in html which will be replaced by its values:
        //{{{css}}}, {{{js}}}, {{{model-js}}}
        //jsonData['css'] = '<link rel="stylesheet" href="' + modulePath + '.css">';
        //jsonData['js'] = '<script src="' + modulePath + '.js"></script>';

        res.render(pagePath, jsonData);
    },

    renderPageModule: function(moduleName, res, jsonData){
        if (!jsonData) jsonData = {};
        var modulePath = moduleName + '/' + moduleName;
        res.render(modulePath, jsonData);
    },

    /*
     * Registers hbs partial html, js and css as <partialName>.html, <partialName>.js, <partialName>.css
     * To be used in html as {{> <partialName>.html }}, {{> <partialName>.js }}, {{> <partialName>.css }}
     */
    registerPartial: function (partialName) {
        var hbs = require('hbs'),
            fs = require('fs');

        registerHtmlJsCss(partialName, ".html");
        registerHtmlJsCss(partialName, ".js", "<script>", "</script>");
        registerHtmlJsCss(partialName, ".css", "<style>", "</style>");

        function registerHtmlJsCss(partialName, ext, tagStart, tagEnd) {
            var partialPath = __client_path + '/partials/' + partialName,
                filePath = partialPath + ext;

            if (tagStart === undefined) {
                tagStart = "";
            }
            if (tagEnd === undefined) {
                tagEnd = "";
            }

            if (fs.existsSync(filePath)) {
                var template = tagStart + fs.readFileSync(filePath, 'utf8') + tagEnd;
                hbs.registerPartial(partialName + ext, template);
            }
        }
    }
};
