window.addEventListener('load', init);
//HTMLが読みこまれたときにinit()を実行

var canvas;
var ctx;
var cellMap;

var CELL_SIZE = 10;
var SCREEN_WIDTH = 300;
var SCREEN_HEIGHT = SCREEN_WIDTH;
var CELL_MAP_SIZE = SCREEN_WIDTH/CELL_SIZE;

function init()
{
    // HTML内のcanvasを取得
    canvas = document.getElementById('maincanvas');
    // 描画のためのコンテキストオブジェクトを取得
    ctx = canvas.getContext('2d');

    // サイズの設定
    canvas.width = SCREEN_WIDTH
    canvas.height = SCREEN_HEIGHT

    cellInit();

    render();
    // requestAnimationFrame(update);
}

function cellInit()
{
    cellMap = new CellMap(CELL_MAP_SIZE);
    genarateCellRandom();
}

function genarateCellRandom()
{
    var x,y,rnd;
    for (x=0;x<CELL_MAP_SIZE;x++) {
        for (y=0;y<CELL_MAP_SIZE;y++) {
            rnd = Math.floor(Math.random()*2);
            if (rnd) cellMap.birthCell(x,y);
        }
    }
}

// 更新
function update()
{
    // requestAnimationFrame(update);
    cellMap.decisionNextGeneration();
    cellMap.goToNextGeneration();
    render();
}

// 描画処理
function render()
{
    // 全体をクリア
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderCell();
}

function fillCell(x, y, state)
{
    var rectx = x * CELL_SIZE;
    var recty = y * CELL_SIZE;

    if(state) ctx.fillStyle = "#000000";
    else ctx.fillStyle = "#ffffff"

    ctx.fillRect(rectx, recty, rectx+CELL_SIZE, recty+CELL_SIZE);
}

function renderCell()
{
    var x,y;
    for (x=0;x<CELL_MAP_SIZE;x++) {
        for (y=0;y<CELL_MAP_SIZE;y++) {
            fillCell(x, y, cellMap.getCellState(x,y));
        }
    }
}

Cell = function(x,y)
{
    this.x = x;
    this.y = y;
    this.state = false;
    this.nextState = false;
}

Cell.prototype.kill = function() { this.state = false; }
Cell.prototype.birth = function() { this.state = true; }
Cell.prototype.getState = function() { return this.state; }

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

CellMap.prototype.validateMapSize = function(x, y)
{
    if(x<0) return false;
    if(y<0) return false;
    if(x>=this.mapSize) return false;
    if(y>=this.mapSize) return false;
    return true;
}

CellMap.prototype.getCellState = function(x, y)
{
    if(!this.validateMapSize(x,y)) return false;
    return this.cellArray[x][y].getState();
}

CellMap.prototype.killCell = function(x, y) { this.cellArray[x][y].state = false; }
CellMap.prototype.birthCell = function(x, y) { this.cellArray[x][y].state = true; }

CellMap.prototype.countAroundAliveCell = function(x, y)
{
    var count = 0;
    var curx,cury;
    for (curx=x-1;curx<=x+1;curx++){
        if (!this.validateMapSize(curx,0)) continue;
        for (cury=y-1;cury<=y+1;cury++){
            if (!this.validateMapSize(curx,cury)) continue;
            if(this.cellArray[curx][cury].getState()) count++;
        }
    }
    if(this.cellArray[x][y].getState()) count--;
    return count;
}

CellMap.prototype.decisionNextState = function(x, y)
{
    var count = this.countAroundAliveCell(x,y);
    if (count == 3)
        this.cellArray[x][y].nextState = true;
    else if (count == 2)
        this.cellArray[x][y].nextState = this.cellArray[x][y].state;
    else
        this.cellArray[x][y].nextState = false;
}

CellMap.prototype.decisionNextGeneration = function()
{
    var x,y;
    for (x=0;x<this.mapSize;x++) {
        for (y=0;y<this.mapSize;y++) {
            this.decisionNextState(x,y);
        }
    }
}

CellMap.prototype.goToNextGeneration = function()
{
    var x,y;
    for (x=0;x<this.mapSize;x++) {
        for (y=0;y<this.mapSize;y++) {
            this.cellArray[x][y].state = this.cellArray[x][y].nextState;
        }
    }
}
