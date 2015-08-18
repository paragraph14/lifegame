window.addEventListener('load', init);
//HTML���ǂ݂��܂ꂽ�Ƃ���init()�����s

var canvas;
var ctx;
var cellMap;

var SCREEN_WIDTH = 300;
var SCREEN_HEIGHT = 300;
var CELL_MAP_SIZE = 3;


function init()
{
    // HTML����canvas���擾
    canvas = document.getElementById('maincanvas');
    // �`��̂��߂̃R���e�L�X�g�I�u�W�F�N�g���擾
    ctx = canvas.getContext('2d');

    // �T�C�Y�̐ݒ�
    canvas.width = SCREEN_WIDTH
    canvas.height = SCREEN_HEIGHT

    cellInit();

    render();
    // requestAnimationFrame(update);
}

function cellInit()
{
    cellMap = new CellMap(CELL_MAP_SIZE);
    cellMap.birthCell(0,0);
    cellMap.birthCell(1,0);
    cellMap.birthCell(2,0);
    cellMap.birthCell(1,1);
}

// �X�V
function update()
{
    // requestAnimationFrame(update);
    cellMap.decisionNextGeneration();
    cellMap.goToNextGeneration();
    render();
}

// �`�揈��
function render()
{
    // �S�̂��N���A
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    renderCell();
    renderGrid();
}

function renderGrid()
{
    ctx.beginPath();
    ctx.moveTo(100,0);
    ctx.lineTo(100,300);
    ctx.moveTo(200,0);
    ctx.lineTo(200,300);

    ctx.moveTo(0,100);
    ctx.lineTo(300,100);
    ctx.moveTo(0,200);
    ctx.lineTo(300,200);

    ctx.moveTo(0,0);
    ctx.lineTo(0,300);
    ctx.lineTo(300,300);
    ctx.lineTo(300,0);
    ctx.lineTo(0,0);

    ctx.stroke();
}

function fillCell(x, y, state)
{
    var rectx = x*100;
    var recty = y*100;

    if(state) ctx.fillStyle = "#000000";
    else ctx.fillStyle = "#ffffff"

    ctx.fillRect(rectx, recty, rectx+100, recty+100);
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
