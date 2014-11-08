var should = require("should")
describe('Array', function(){
    before(function() {
        console.log('before...')
    });
    after(function() {
        console.log('after...')
    });
    beforeEach(function(){
        console.log('beforeEach...')
    });
    afterEach(function(){
        console.log('afterEach...')
    });
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){
            [1,2,3].indexOf(5).should.equal(-1);
            [1,2,3].indexOf(0).should.equal(-1);
        })
    })

    describe('#toString()', function(){
        it('should return string', function(){
            [1,2,3].toString().should.be.String;
        })
    })
})