var Q = require('q');

function Format() {
    
}

Format.prototype.applyKernel = function(imageData, kernel) {
    var result = [],
        deferred = Q.defer();

    imageData.forEach(function(row, rowIndex){
        row.forEach(function(pixelInRow, pixelInRowIndex){
            // set accumulator to zero
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

        });
    });

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