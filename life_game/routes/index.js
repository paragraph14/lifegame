var express = require('express');
var router = express.Router();
var Cell = require('../mod/Cell');

var cellMap;

var CELL_SIZE = 10;
var SCREEN_SIZE = 500;
var CELL_MAP_SIZE = SCREEN_SIZE/CELL_SIZE;
var SPEED = 500;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
  cellInit();
});

function cellInit()
{
    cellMap = new CellMap(CELL_MAP_SIZE);
    genarateCellRandom();
}

module.exports = router;
