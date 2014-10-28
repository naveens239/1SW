'use strict';
var riot = require('../libs/riot');
module.exports = {
    newInstance: function(){
        return new Controller();
    }
};


function Controller() {
    var self = this;
    self.bindModelView = function (requireModel, requirePresenter) {
        self.model = requireModel.newInstance(self);//passing controller so that model can access the view later
        self.view = requirePresenter.newInstance(self);//passing controller so that view can access model later
        riot.observable(self.model);
        riot.observable(self.view);
    };

    self.initModelView = function(){
        if(self.model.init) { self.model.init(); }
        if(self.view.init) { self.view.init(); }
    };
}