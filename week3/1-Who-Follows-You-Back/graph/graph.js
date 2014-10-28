var edges = {},
    startNode = null;

function DirectedGraph(structure) {
    edges = structure.edges;
    startNode = structure.startNode;
}

DirectedGraph.prototype.getNeighborsFor = function(node) {
    return edges[node] || [];
};

DirectedGraph.prototype.getStart = function() {
    return startNode;
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