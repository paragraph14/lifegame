window.addEventListener('load', TestMain);

//assert

function assert(expected, actual)
{
    console.log('.');
    console.assert(actual == expected, '\nActual: ' + actual + '\nExpcted: ' + expected);
}

function CellBirthAndKill()
{
    var testCell = new Cell(0,0);
    assert(false, testCell.getState());

    testCell.birth();
    assert(true, testCell.getState());

    testCell.kill();
    assert(false, testCell.getState());
}

function MakeCellMap()
{
    var cellMapSize = 3;
    var testMap = new CellMap(cellMapSize);

    assert(false, testMap.getCellState(0, 0));
    assert(false, testMap.getCellState(3, 3));
    assert(false, testMap.getCellState(4, 3));
    assert(false, testMap.getCellState(3, 4));

    testMap.birthCell(0,0);
    assert(true, testMap.getCellState(0, 0));

    testMap.killCell(0,0);
    assert(false, testMap.getCellState(0, 0));
}

function CountAroundAliveCell()
{
    var cellMapSize = 3;
    var testMap = new CellMap(cellMapSize);

    testMap.birthCell(0,0);
    testMap.birthCell(1,0);
    testMap.birthCell(2,0);

    assert(3, testMap.countAroundAliveCell(1,1));
    assert(1, testMap.countAroundAliveCell(0,0));
}

function NextGeneration()
{
    var cellMapSize = 3;
    var testMap = new CellMap(cellMapSize);

    testMap.birthCell(0,0);
    testMap.birthCell(1,0);
    testMap.birthCell(2,0);
    testMap.birthCell(1,1);

    testMap.decisionNextGeneration();
    testMap.goToNextGeneration();

    assert(true, testMap.getCellState(0, 0));
    assert(true, testMap.getCellState(1, 0));
    assert(true, testMap.getCellState(2, 0));
    assert(true, testMap.getCellState(0, 1));
    assert(true, testMap.getCellState(1, 1));
    assert(true, testMap.getCellState(2, 1));
    assert(false, testMap.getCellState(0, 2));
    assert(false, testMap.getCellState(1, 2));
    assert(false, testMap.getCellState(2, 2));
}

function Fillcell()
{
    fillCell(0,0,false);
}

function TestMain()
{
    CellBirthAndKill();
    MakeCellMap();
    CountAroundAliveCell();
    NextGeneration();
    // Fillcell();
}
