var Q = require('q'),
    _ = require('underscore'),
    debug = require('debug')('Format');

function Format() {

}

// some additional info about the algorithm:
// https://en.wikipedia.org/wiki/Kernel_%28image_processing%29
// http://www.songho.ca/dsp/convolution/convolution2d_example.html

function calculatePixel(position, imageData, kernel) {
    var sideOffset = (kernel.length - 1) / 2,
        sum = 0;

    debug('\nCalculating value for pixel...');

    kernel.forEach(function(row, kernelRowIndex) {
        kernel[kernelRowIndex].forEach(function(kernelValue, kernelElementIndex) {
            var imageDataElementIndex = kernelElementIndex - sideOffset + position[1],
                imageDataRowIndex = kernelRowIndex - sideOffset + position[0],
                imageDataValue = 0;

            var imageDataRowIndexInBounds = imageDataRowIndex >= 0 && imageDataRowIndex < imageData.length,
                imageDateElementIndexInBounds = imageDataElementIndex >= 0 && imageDataElementIndex < imageData[0].length;

            if (imageDateElementIndexInBounds && imageDataRowIndexInBounds) {
                imageDataValue = imageData[imageDataRowIndex][imageDataElementIndex];
            }

            debug(kernelValue, '*', imageDataValue, 'kernel[' + kernelRowIndex + '][' + kernelElementIndex + ']', 'imageData[' + imageDataRowIndex + '][' + imageDataElementIndex + ']');

            sum += imageDataValue * kernelValue;
        });
        debug('-');
    });

    debug(sum);
    debug('--------');

    return sum;
}

function calculateNextPixel(lastPixelPosition, imageData, kernel, result, deferred) {
    // check of lastPixelPosition is the last pixel position -> resolve if yes
    var completed = lastPixelPosition[0] === imageData.length - 1 && lastPixelPosition[1] === imageData[0].length - 1;
    if (completed) {
        deferred.resolve(result);
    } else {
        process.nextTick(function() {
            // calculate next position
            var nextPosition = lastPixelPosition;
            nextPosition[1] ++;

            // must go to next row
            if (nextPosition[1] === imageData[nextPosition[0]].length) {
                nextPosition[1] = 0;
                nextPosition[0] ++;
            }

            // calculate
            result[nextPosition[0]][nextPosition[1]] = calculatePixel(nextPosition, imageData, kernel);
            // move to next
            calculateNextPixel(nextPosition, imageData, kernel, result, deferred);
        });
    }
}

function createBlankResult(imageData) {
    var result = [];
    imageData.forEach(function(row, rowIndex) {
        result[rowIndex] = [];
        row.forEach(function(pixelInRow, pixelInRowIndex) {
            result[rowIndex][pixelInRowIndex] = 0;
        });
    });
    return result;
}

Format.prototype.applyKernel = function(imageData, kernel) {
    var result = createBlankResult(imageData),
        deferred = Q.defer();

    calculateNextPixel([0, 0], imageData, kernel, result, deferred);

    return deferred.promise;
};

Format.prototype.edgeDetection = function(imageData) {
    var edgeDetectionKernel = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
    ];
    return this.applyKernel(imageData, edgeDetectionKernel);
};

Format.prototype.boxBlur = function(imageData) {
    var boxBlurKernel = [
        [1, 0, -1],
        [0, 0, 0],
        [-1, 0, 1],
    ];
    return this.applyKernel(imageData, boxBlurKernel);
};

module.exports = Format;