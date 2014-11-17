"use strict";

var _ = require('../node_modules/lodash/lodash');

var beerAndFries = function(testData) {
    var beers = _.filter(testData, function(obj) {
            return obj.type === 'beer';
        }),
        fries = _.filter(testData, function(obj) {
            return obj.type === 'fries';
        }),
        beerScores = _.map(beers, function(beer) {
            return beer.score;
        }),
        friesScores = _.map(fries, function(fries) {
            return fries.score;
        }),
        sortedBeerScores = _.sortBy(beerScores),
        sortedFriesScores = _.sortBy(friesScores);

    // console.log(sortedBeerScores, sortedFriesScores);

    return _.reduce(sortedBeerScores, function(result, num, key) {
        return result + (num * sortedFriesScores[key]);
    }, 0);
};

exports.beerAndFries = beerAndFries;