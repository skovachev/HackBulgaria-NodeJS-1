var fields = ['field_valid'],
    responseKey = 'response_key',
    expect = require('chai').expect,
    responseFormatter = require('../../services/responseFormatter')(fields, responseKey),
    item = {
        field_valid: 'foo',
        field_invalid: 'bar'
    };


describe('ResponseFormatter', function() {

    describe('formatItem', function() {

        it('should be able to format array of items', function(done) {
            var formatted = responseFormatter.formatItem([item]);
            expect(formatted).to.deep.equal([{
                field_valid: 'foo'
            }]);
            done();
        });

        it('should passthrough string', function(done) {
            var formatted = responseFormatter.formatItem('test');
            expect(formatted).to.equal('test');
            done();
        });

        it('should format item', function(done) {
            var formatted = responseFormatter.formatItem(item);
            expect(formatted).to.deep.equal({
                field_valid: 'foo'
            });
            done();
        });
    });

    describe('formatError', function() {

        it('should return error message under correct key', function(done) {
            var response = responseFormatter.formatErrorResponse('message');
            expect(response).to.deep.equal({
                error: 'message'
            });
            done();
        });
    });

    describe('formatResponse', function() {

        it('should return item under correct key', function(done) {
            var response = responseFormatter.formatResponse(item);
            var expected = {};
            expected[responseKey] = {
                field_valid: 'foo'
            };
            expect(response).to.deep.equal(expected);
            done();
        });

    });
});