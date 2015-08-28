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

function next()
{
    update();
}
