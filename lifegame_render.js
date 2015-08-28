window.addEventListener('load', init);
//HTMLが読みこまれたときにinit()を実行

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
    // HTML内のcanvasを取得
    canvas = document.getElementById('maincanvas');
    // クリックイベントのイベントハンドラを追加
    canvas.addEventListener('click', onClick, false);
    // 描画のためのコンテキストオブジェクトを取得
    ctx = canvas.getContext('2d');

    // サイズの設定
    canvas.width = SCREEN_SIZE
    canvas.height = SCREEN_SIZE

    cellInit();

    render();
    // requestAnimationFrame(update);
}

function cellInit()
{
    cellMap = CellMap.create(CELL_MAP_SIZE);
    genarateCellRandom();
}

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

// セル座標と状態を指定するとそのように画面を塗る
function fillCell(x, y, state)
{
    var rectx = x * CELL_SIZE;
    var recty = y * CELL_SIZE;

    if(state) ctx.fillStyle = "#000000";
    else ctx.fillStyle = "#ffffff"

    ctx.fillRect(rectx, recty, rectx+CELL_SIZE, recty+CELL_SIZE);
}

// セルマップに従って描画
function renderCell()
{
    var x,y;
    for (x=0;x<CELL_MAP_SIZE;x++) {
        for (y=0;y<CELL_MAP_SIZE;y++) {
            fillCell(x, y, cellMap.getCellState(x,y));
        }
    }
}
