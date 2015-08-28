window.addEventListener('load', init);
//HTML���ǂ݂��܂ꂽ�Ƃ���init()�����s

var canvas;
var ctx;
var cellMap;
var autoId;

var CELL_SIZE = 10;
var SCREEN_SIZE = 500;
var CELL_MAP_SIZE = SCREEN_SIZE/CELL_SIZE;
var SPEED = 500;

function init()
{
    // HTML����canvas���擾
    canvas = document.getElementById('maincanvas');
    // �N���b�N�C�x���g�̃C�x���g�n���h����ǉ�
    canvas.addEventListener('click', onClick, false);
    // �`��̂��߂̃R���e�L�X�g�I�u�W�F�N�g���擾
    ctx = canvas.getContext('2d');

    // �T�C�Y�̐ݒ�
    canvas.width = SCREEN_SIZE
    canvas.height = SCREEN_SIZE

    cellInit();

    render();
    // requestAnimationFrame(update);
}

//// �{�^���֐� /////

function onClick(e)
{
    var rect = e.target.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var y = e.clientY - rect.top;

    reverseCell(x, y);
    render()
}

function reverseCell(x, y)
{
    var basex = Math.floor(x/CELL_SIZE);
    var basey = Math.floor(y/CELL_SIZE);

    cellMap.reverseState(basex, basey);
}

function cellInit()
{
    cellMap = CellMap.create(CELL_MAP_SIZE);
    genarateCellRandom();
}

function genarateCellRandom()
{
    var x,y,rnd;
    for (x=0;x<CELL_MAP_SIZE;x++) {
        for (y=0;y<CELL_MAP_SIZE;y++) {
            rnd = Math.floor(Math.random()*2);
            if (rnd) cellMap.birthCell(x,y);
            else cellMap.killCell(x,y);
        }
    }
}

function repositioningCell()
{
    genarateCellRandom();
    render();
}

function auto()
{
    update();
    autoId = setTimeout(auto,SPEED);
}

function downSpeed()
{
    if(SPEED>999) return;
    SPEED = SPEED + 100;
}

function upSpeed()
{
    if(SPEED<100) return;
    SPEED = SPEED - 100;
}

function stopAuto()
{
    clearTimeout(autoId);
}

function clear()
{
    var x,y;
    for (x=0;x<CELL_MAP_SIZE;x++) {
        for (y=0;y<CELL_MAP_SIZE;y++) {
            cellMap.killCell(x,y);
        }
    }
    render();
}
///////////////////////////////////////////

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
}

// �Z�����W�Ə�Ԃ��w�肷��Ƃ��̂悤�ɉ�ʂ�h��
function fillCell(x, y, state)
{
    var rectx = x * CELL_SIZE;
    var recty = y * CELL_SIZE;

    if(state) ctx.fillStyle = "#000000";
    else ctx.fillStyle = "#ffffff"

    ctx.fillRect(rectx, recty, rectx+CELL_SIZE, recty+CELL_SIZE);
}

// �Z���}�b�v�ɏ]���ĕ`��
function renderCell()
{
    var x,y;
    for (x=0;x<CELL_MAP_SIZE;x++) {
        for (y=0;y<CELL_MAP_SIZE;y++) {
            fillCell(x, y, cellMap.getCellState(x,y));
        }
    }
}

var Cell = {
    // �I�u�W�F�N�g�̃����o������
    create(x, y){
        var self = Object.create(Cell.prototype);
        self.x = x;
        self.y = y;
        self.state = false;
        self.nextState = false;
        return self;
    },
    // �v���g�^�C�v�̃����o
    prototype: {
        kill()     { this.state = false; },
        birth()    { this.state = true; },
        reverse()  { this.state = !this.state; },
        getState() { return this.state; }
    }
}

var CellMap = {
    create(mapSize){
        var self = Object.create(CellMap.prototype);
        self.cellArray = [[]];
        self.mapSize = mapSize;

        var x,y;
        for (x=0;x<self.mapSize;x++) {
            self.cellArray[x]=[];
            for (y=0;y<self.mapSize;y++) {
                self.cellArray[x][y] = Cell.create(x, y);
            }
        }
        return self;
    },
    prototype: {
        // �^����ꂽ���W���Z���}�b�v�����ǂ����𔻒�
        validateMapSize(x, y) {
            if(x<0) return false;
            if(y<0) return false;
            if(x>=this.mapSize) return false;
            if(y>=this.mapSize) return false;
            return true;
        },

        getCellState(x, y) {
            if(!this.validateMapSize(x,y)) return false;
            return this.cellArray[x][y].getState();
        },

        killCell(x, y)  { this.cellArray[x][y].state = false; },
        birthCell(x, y) { this.cellArray[x][y].state = true; },

        // �[�̏���
        exceedBoundary(x) {
            if(x<0) return this.mapSize-1 ;
            else if(x>=this.mapSize) return 0;
            else return x
        },

        // �Z�����W��^����Ƃ��̎��͂ɂ����������Ă���Z�������邩�Ԃ�
        countAroundAliveCell(x, y) {
            var count = 0;
            var curx,cury;

            var right_x = exceedBoundary(x+1);
            var left_x  = exceedBoundary(x-1);
            var up_y    = exceedBoundary(y-1);
            var down_y  = exceedBoundary(y+1);

            if (this.cellArray[left_x ][up_y  ].getState()) count++;
            if (this.cellArray[x      ][up_y  ].getState()) count++;
            if (this.cellArray[right_x][up_y  ].getState()) count++;
            if (this.cellArray[left_x ][y     ].getState()) count++;
            if (this.cellArray[right_x][y     ].getState()) count++;
            if (this.cellArray[left_x ][down_y].getState()) count++;
            if (this.cellArray[x      ][down_y].getState()) count++;
            if (this.cellArray[right_x][down_y].getState()) count++;
            return count;
        },

        // �Z���}�b�v���̎w�肵���Z���̎��̏�Ԃ����肷��
        decisionNextState(x, y) {
            var count = this.countAroundAliveCell(x,y);
            if (count == 3)
                this.cellArray[x][y].nextState = true;
            else if (count == 2)
                this.cellArray[x][y].nextState = this.cellArray[x][y].state;
            else
                this.cellArray[x][y].nextState = false;
        },

        // �w�肵���Z���̏�Ԃ𔽓]
        reverseState(x, y) { this.cellArray[x][y].reverse(); },

        // �S�ẴZ���̎��̏�Ԃ����肷��
        // �ڍs�͂܂����Ȃ�
        decisionNextGeneration() {
            var x,y;
            for (x=0;x<this.mapSize;x++) {
                for (y=0;y<this.mapSize;y++) {
                    this.decisionNextState(x,y);
                }
            }
        },

        // �S�ẴZ�������̏�ԂɈڍs������
        goToNextGeneration() {
            var x,y;
            for (x=0;x<this.mapSize;x++) {
                for (y=0;y<this.mapSize;y++) {
                    this.cellArray[x][y].state = this.cellArray[x][y].nextState;
                }
            }
        }
    }
}
