// only dungeon part of https://github.com/munificent/hauberk
// see: https://github.com/munificent/hauberk/blob/master/lib/src/content/dungeon.dart

var defaults = {
  seed: 12345678,
  rows: 50,
  cols: 50,
  comfortZone: 1
};
var random = require('./random.js');

var tileTypes = {
  WALL: 0,
  FLOOR: 1
};

function Tile(x, y, type){
  this.x = x;
  this.y = y;
  this.type = (type) ? type : tileTypes.WALL;
  this.room = null;
}

function Room(x, y, width, height, tiles){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.tiles = tiles || [];

  this.withinComfortZone = function(other){
    var topLeft = other.x > (this.x - defaults.comfortZone)
    && other.x < (this.x + this.width + defaults.comfortZone)
    && other.y > (this.y - defaults.comfortZone)
    && other.y < (this.y + this.height + defaults.comfortZone);

    var topRight = (other.x + other.width) > (this.x - defaults.comfortZone)
    && (other.x + other.width) < (this.x + this.width + defaults.comfortZone)
    && other.y > (this.y - defaults.comfortZone)
    && other.y < (this.y + this.height + defaults.comfortZone);

    var bottomLeft = other.x > (this.x - defaults.comfortZone)
    && other.x < (this.x + this.width + defaults.comfortZone)
    && (other.y + other.height) > (this.y - defaults.comfortZone)
    && (other.y + other.height) < (this.y + this.height + defaults.comfortZone);

    var bottomRight= (other.x + other.width) > (this.x - defaults.comfortZone)
    && (other.x + other.width) < (this.x + this.width + defaults.comfortZone)
    && (other.y + other.height) > (this.y - defaults.comfortZone)
    && (other.y + other.height) < (this.y + this.height + defaults.comfortZone);

    return topLeft || topRight || bottomLeft || bottomRight;
  };
}

function Stage(rows, cols){
  this.rows = (rows % 2 == 1) ? rows : rows + 1;
  this.cols = (cols % 2 == 1) ? cols : cols + 1;

  this.tiles = [];
  for(var i = 0; i < this.rows; i++){
    this.tiles[i] = [];
    for(var j = 0; j < this.cols; j++){
      this.tiles[i][j] = new Tile(i, j, tileTypes.WALL);
    }
  }
  
  this.rooms = [];
}

function Dungeon(seed, rows, cols){
  var dungeonInstance = this;
  this.seed = seed || defaults.seed;
  this.rows = rows || defaults.rows;
  this.cols = cols || defaults.cols;

  this.stage = new Stage(this.rows, this.cols);

  var rng = new random(this.seed);

  _addRooms(this.stage, rng, 3, 9, 100);

  this.print = function(){
    _printStage(dungeonInstance.stage);
  };
}

function _printStage(stage){
  var x, y, row;
  for(x = 0; x < stage.rows; x++){
    row = "";
    for(y = 0; y < stage.cols; y++){
      row += (stage.tiles[x][y].type === 0) ? '#' : ' ';
    }
    console.log(row);
  }
}

function _addRooms(stage, rng, minSize, maxSize, attempts){
  minSize = Math.max((minSize - 1) / 2, 1);
  maxSize = Math.max((maxSize - 1) / 2, minSize + 1);

  for(var i = 0; i < attempts; i++){
    var size = rng.range(minSize, maxSize) * 2 + 1; // ensure odd size
    var rectangularity = rng.range(0, 1 + ~~(size /2)) * 2;
    var width = size;
    var height = size;
    if(rng.isOneIn(2)){
      width += rectangularity;
    } else {
      height += rectangularity;
    }
    var x = rng.range(~~((stage.rows - width) / 2)) * 2 + 1;
    var y = rng.range(~~((stage.cols - height) / 2)) * 2 + 1;
    
    var room = new Room(x, y, width, height);
    
    var overlaps = false;
    for(var r = 0; r < stage.rooms.length; r++){
      if(room.withinComfortZone(stage.rooms[r])){
        overlaps = true;
        break;
      }
    }
    if(overlaps) continue;
    
    stage.rooms.push(room);
    
    for(var rx = room.x; rx < room.x + room.width; rx++){
      for(var ry = room.y; ry < room.y + room.height; ry++){
        var currentTile = stage.tiles[rx][ry];
        room.tiles.push(currentTile);
        currentTile.room = room;
        currentTile.type = tileTypes.FLOOR;
      }
    }
  }  
}

module.exports = Dungeon;
