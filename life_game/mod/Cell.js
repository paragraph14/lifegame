Cell = function(x,y)
{
    this.x = x;
    this.y = y;
    this.state = false;
    this.nextState = false;
}

Cell.prototype.kill = function() { this.state = false; }
Cell.prototype.birth = function() { this.state = true; }
Cell.prototype.reverse = function() { this.state = !this.state; }
Cell.prototype.getState = function() { return this.state; }

module.exports = Cell;
