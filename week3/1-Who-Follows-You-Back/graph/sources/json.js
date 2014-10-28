var DirectedGraph = require('../graph');

module.exports = {
    loadGraph: function(json, done) {
        done(new DirectedGraph(json));
    }
};