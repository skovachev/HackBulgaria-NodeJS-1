var expect = require("chai").expect,
    DirectedGraph = require('../graph');

describe('DirectedGraph', function() {

    var structure = [
            {
                from: 'testA',
                to: 'testB'
            },
            {
                from: 'testA',
                to: 'testC'
            },
            {
                from: 'testC',
                to: 'testB'
            },
        ],
        graph = (new DirectedGraph()).loadFromStructure(structure);

    describe('#getNeighborsFor()', function() {
        it('should return neighbours for node', function() {
            var neighbours = graph.getNeighborsFor('testA');

            expect(neighbours).to.deep.equal(['testB', 'testC']);
        });
    });

    describe('#pathBetween()', function() {
        it('should return -1 when the value is not present', function() {
            expect(graph.pathBetween('testA', 'testB')).to.be.true;
            expect(graph.pathBetween('testB', 'testC')).to.not.be.true;
        });
    });

    describe('#toString()', function() {
        it('should return -1 when the value is not present', function() {
            console.log(graph.toString());
            expect(graph.toString()).to.equal("[{\"from\":\"testA\",\"to\":\"testB\"},{\"from\":\"testA\",\"to\":\"testC\"},{\"from\":\"testC\",\"to\":\"testB\"}]");
        });
    });
});