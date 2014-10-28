var edges = [];

function DirectedGraph() {

}

DirectedGraph.prototype.loadFromApi = function(username, depth, done) {

};

DirectedGraph.prototype.loadFromDatabase = function(graphId, done) {

};

DirectedGraph.prototype.loadFromStructure = function(structure) {
    edges = structure;
    return this;
};

DirectedGraph.prototype.getNeighborsFor = function(node) {
    var neighbours = [];
    edges.forEach(function(edge){
        if (edge.from === node) {
            neighbours.push(edge.to);
        }
    });
    return neighbours;
};

DirectedGraph.prototype.pathBetween = function(nodeA, nodeB) {
    var numberEdges = edges.length,
        edge = null;

    for (var i = 0; i < numberEdges; i++) {
        edge = edges[i];
        if (edge.from === nodeA && edge.to === nodeB) {
            return true;
        }
    }
    
    return false;
};

DirectedGraph.prototype.toString = function() {
    return JSON.stringify(edges);
};


module.exports = DirectedGraph;