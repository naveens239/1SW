var should = require("should")
describe('Models', function () {
    var mongoose = require('mongoose'),
        path = require('path'),
        config = require('../server/config');

    before(function () {
        mongoose.connect('mongodb://' + config.dbconfig.dburl);
        mongoose.connection.on('error', console.error.bind(console, 'connection error:'));
    });
    after(function () {
        //mongoose.disconnect();
    });

    describe('vendor_services.findAll()', function () {
        var vendor_services_model_class = require(path.join(__dirname, '../server/models/vendor_services'));
        var vendor_services_model = new vendor_services_model_class();

        it('should return array', function () {
            vendor_services_model.findAll(function (vendor_sevices) {
                console.log('vendor_sevices:'+vendor_sevices);
                console.log(vendor_sevices instanceof String);

                assert.ok(vendor_sevices instanceof String);
            });
        })
    })
})
/**
 * Created by home on 11/6/14.
 */
