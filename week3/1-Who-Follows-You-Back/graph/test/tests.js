var expect = require("chai").expect,
    JSONGraphSource = require('../sources/json');

describe('DirectedGraph', function() {

    var structure = {
            edges: {
                'testA': ['testB', 'testC'],
                'testC': ['testB', 'testD']
            },
            startNode: 'testA'
        },
        graph = null;

    JSONGraphSource.loadGraph(structure, function(g) {
        graph = g;
    });

    describe('#getNeighborsFor()', function() {
        it('should return neighbours for node', function() {
            var neighbours = graph.getNeighborsFor('testA');

            expect(neighbours).to.deep.equal(['testB', 'testC']);
        });
    });

    describe('#pathBetween()', function() {
        it('should calculate path between neighbouring nodes', function() {
            expect(graph.pathBetween('testA', 'testB')).to.be.true;
        });

        it('should detect nodes that are not connected', function() {
            expect(graph.pathBetween('testB', 'testC')).to.not.be.true;
        });

        it('should calculate path between nodes with no direct link', function() {
            expect(graph.pathBetween('testA', 'testD')).to.be.true;
        });
    });

    describe('#toString()', function() {
        it('should convert the graph to string', function() {
            console.log(graph.toString());
            expect(graph.toString()).to.equal("{\"testA\":[],\"testC\":[\"testB\",\"testD\"]}");
        });
    });
});