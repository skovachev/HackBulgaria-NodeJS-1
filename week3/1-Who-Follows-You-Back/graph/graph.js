var edges = {};

function DirectedGraph(structure) {
    edges = structure;
}

DirectedGraph.prototype.getNeighborsFor = function(node) {
    return edges[node] || [];
};

DirectedGraph.prototype.pathBetween = function(nodeA, nodeB) {
    var neighbours = this.getNeighborsFor(nodeA);
    if (neighbours.length === 0) {
        return false;
    }

    if (neighbours.indexOf(nodeB) > -1) {
        return true;
    }

    do {
        var neighbour = neighbours.shift();
        var pathFound = this.pathBetween(neighbour, nodeB);
        if (pathFound) {
            return true;
        }
    } while (neighbours.length > 0);

    return false;
};

DirectedGraph.prototype.toString = function() {
    return JSON.stringify(edges);
};


module.exports = DirectedGraph;