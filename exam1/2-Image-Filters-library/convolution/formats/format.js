var Q = require('q');

function Format() {
    
}

function convulatePixel(position, imageData, kernel) {
    // TODO do calcaulation -> http://www.songho.ca/dsp/convolution/convolution2d_example.html 
    // TODO make sure it works for any kernel size / get its center
    kernel.forEach(function(kernelRow, kernelRowIndex){
        kernelRow.forEach(function(kernelRowElement, kernelRowElementIndex){

            process.nextTick(function(){
                deferred.resolve(result);
                // calculate here
                // https://en.wikipedia.org/wiki/Kernel_%28image_processing%29
                // http://www.songho.ca/dsp/convolution/convolution2d_example.html example
            });

        });
    });
}

function convulateNextPixel(lastPixelPosition, imageData, kernel, result, deferred) {
    var completed; // TODO: check of lastPixelPosition is out of bounds already -> resolve if yes
    if (completed) {
        deferred.resolve(result);
    }
    else {
        process.nextTick(function(){
            // TODO: calculate next position
            var nextPosition;
            // calculate
            result[rowIndex][pixelInRowIndex] = convulatePixel(nextPosition, imageData, kernel);
            // move to next
            convulateNextPixel(nextPosition, imageData, kernel, result, deferred);
        });
    }
}

function createBlankResult(imageData) {
    var result = [];
    imageData.forEach(function(row, rowIndex){
        row.forEach(function(pixelInRow, pixelInRowIndex){
            result[rowIndex][pixelInRowIndex] = 0;
        });
    });
    return result;
}

Format.prototype.applyKernel = function(imageData, kernel) {
    var result = createBlankResult(imageData),
        deferred = Q.defer();

    convulateNextPixel([0, 0], imageData, kernel, result, deferred);

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