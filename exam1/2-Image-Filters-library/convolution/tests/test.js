var expect = require('chai').expect;

var convolution = require('../index'),
    xMarksTheSpot = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
    ],
    verticalBlur = [
        [0, 0.5, 0],
        [0,   0, 0],
        [0,   1, 0]
    ];

describe('Convolution', function() {

    describe('applyKernel', function() {

        it('should calculate correct result', function(done) {
            var result = [
                [  0,   1,   0],
                [1.5,   0, 1.5],
                [  0, 0.5,   0]
            ];
            convolution.monochrome.applyKernel(xMarksTheSpot, verticalBlur)
                .done(function (blurredX) {
                    expect(blurredX).to.deep.equal(result);
                    done();
                });
        });

    });

});