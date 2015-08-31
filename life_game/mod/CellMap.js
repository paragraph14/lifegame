Cell = require('./Cell.js');

CellMap = function(mapSize)
{
    this.cellArray = [[]];
    this.mapSize = mapSize;

    var x,y;
    for (x=0;x<this.mapSize;x++) {
        this.cellArray[x]=[];
        for (y=0;y<this.mapSize;y++) {
            this.cellArray[x][y] = new Cell(x,y);
        }
    }
}

module.exports = CellMap;
