var expect = require('chai').expect;

var convolution = require('../index'),
    xMarksTheSpot = [
        [1, 0, 1],
        [0, 1, 0],
        [1, 0, 1],
    ],
    verticalBlur = [
        [0, 0.5, 0],
        [0, 0, 0],
        [0, 1, 0]
    ],
    result = [
        [0, 1, 0],
        [1.5, 0, 1.5],
        [0, 0.5, 0]
    ];

describe('Convolution', function() {

    describe('applyKernel', function() {

        it('should calculate correct result using monochrome', function(done) {
            convolution.monochrome.applyKernel(xMarksTheSpot, verticalBlur)
                .done(function(blurredX) {
                    expect(blurredX, 'blurred result').to.deep.equal(result);
                    done();
                });
        });

        it('should calculate correct result using rgb', function(done) {
            var source = {
                red: xMarksTheSpot,
                green: xMarksTheSpot,
                blue: xMarksTheSpot
            };
            convolution.rgb.applyKernel(source, verticalBlur)
                .done(function(blurredX) {
                    expect(blurredX.red, 'red channel blurred result').to.deep.equal(result);
                    expect(blurredX.green, 'green channel blurred result').to.deep.equal(result);
                    expect(blurredX.blue, 'blue channel blurred result').to.deep.equal(result);
                    done();
                });
        });

    });

});