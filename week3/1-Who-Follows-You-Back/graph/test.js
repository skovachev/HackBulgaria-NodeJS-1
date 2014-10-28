var api = require('./sources/api');

api.loadGraph('skovachev', 1, function(graph) {
    console.log(graph.toString());
});