var life;
(function (life) {
    var LifeApp = (function () {
        function LifeApp(cells) {
            var _this = this;
            this.iterations = 50;
            this.iterationsMin = 1;
            this.iterationsMax = 10000;
            this.speed = 1;
            this.speedMin = 1;
            this.speedMax = 10;
            this.iterator = 0;
            this.timer = -1;
            this.canvas = document.getElementById('life');
            this.beginBtn = document.getElementById('begin');
            this.resetBtn = document.getElementById('reset');
            this.iterationsInput = document.getElementById('iterations');
            this.speedInput = document.getElementById('speed');
            this.randomBtn = document.getElementById('random');
            this.counter = document.getElementById('counter');
            this.rendering = new life.CanvasRendering(this.canvas);
            this.universe = new life.Universe(cells);
            this.beginBtn.addEventListener('click', function (e) { return _this.onBegin(e); });
            this.resetBtn.addEventListener('click', function (e) { return _this.onReset(e); });
            this.randomBtn.addEventListener('click', function (e) { return _this.onRandom(e); });
            this.rendering.clearCellList(this.universe.clearCells);
            this.rendering.drawCellList(this.universe.newCells);
        }
        LifeApp.prototype.onBegin = function (e) {
            var _this = this;
            this.iterations = parseInt(this.iterationsInput.value);
            if (this.iterations < this.iterationsMin)
                this.iterations = this.iterationsMin;
            if (this.iterations > this.iterationsMax)
                this.iterations = this.iterationsMax;
            this.speed = parseInt(this.speedInput.value);
            if (this.speed > this.speedMax)
                this.speed = this.speedMax;
            if (this.speed < this.speedMin)
                this.speed = this.speedMin;
            this.timer = setInterval(function () { return _this.drawOneStep(); }, 500 / this.speed);
        };
        LifeApp.prototype.onReset = function (e) {
            this.resetLifeApp();
            this.universe.reset();
            this.rendering.clearCanvas();
            this.rendering.drawCellList(this.universe.newCells);
        };
        LifeApp.prototype.resetLifeApp = function () {
            clearInterval(this.timer);
            this.timer = -1;
            this.iterator = 0;
            this.counter.innerHTML = "1";
        };
        LifeApp.prototype.onRandom = function (e) {
            this.resetLifeApp();
            this.universe.randomise((this.canvas.height * this.canvas.width) * 0.01);
            this.rendering.clearCanvas();
            this.rendering.drawCellList(this.universe.newCells);
        };
        LifeApp.prototype.drawOneStep = function () {
            this.iterator++;
            this.universe.applyRules();
            this.rendering.clearCellList(this.universe.clearCells);
            this.rendering.drawCellList(this.universe.newCells);
            this.counter.innerHTML = this.iterator.toString();
            if (this.iterations <= this.iterator) {
                clearInterval(this.timer);
            }
        };
        return LifeApp;
    }());
    life.LifeApp = LifeApp;
    window.onload = function () {
        var a = new life.Cell(1, 1);
        var b = new life.Cell(1, 2);
        var c = new life.Cell(1, 3);
        var d = new life.Cell(2, 1);
        var e = new life.Cell(3, 3);
        var cells = {};
        cells[a.toString()] = a;
        cells[b.toString()] = b;
        cells[c.toString()] = c;
        cells[d.toString()] = d;
        cells[e.toString()] = e;
        new LifeApp(cells);
    };
})(life || (life = {}));
var life;
(function (life) {
    var Point = (function () {
        function Point(x, y) {
            this.x = x;
            this.y = y;
        }
        return Point;
    }());
    life.Point = Point;
    var CanvasRendering = (function () {
        function CanvasRendering(canvas, scale) {
            if (scale === void 0) { scale = 10; }
            this.canvas = canvas;
            this.scale = scale;
            if (canvas)
                this.context = canvas.getContext('2d');
            this.context.fillStyle = "black";
        }
        CanvasRendering.prototype.paintSquare = function (point) {
            this.context.fillRect(point.x * this.scale, point.y * this.scale, this.scale, this.scale);
        };
        CanvasRendering.prototype.clearSquare = function (point) {
            this.context.clearRect(point.x * this.scale, point.y * this.scale, this.scale, this.scale);
        };
        CanvasRendering.prototype.drawCellList = function (cells) {
            var i = 0;
            var len = cells.length;
            while (i < len) {
                this.paintSquare(cells[i++]);
            }
        };
        CanvasRendering.prototype.clearCellList = function (cells) {
            var i = 0;
            var len = cells.length;
            while (i < len) {
                this.clearSquare(cells[i++]);
            }
        };
        CanvasRendering.prototype.clearCanvas = function () {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        };
        return CanvasRendering;
    }());
    life.CanvasRendering = CanvasRendering;
})(life || (life = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var life;
(function (life) {
    var Cell = (function (_super) {
        __extends(Cell, _super);
        function Cell(x, y) {
            _super.call(this, x, y);
        }
        Cell.prototype.toString = function () {
            return this.x + '_' + this.y;
        };
        return Cell;
    }(life.Point));
    life.Cell = Cell;
    var CellOperations = (function () {
        function CellOperations() {
        }
        CellOperations.aliveNeighbours = function (cell, collection) {
            var count = 0;
            if (collection[(cell.x - 1) + '_' + (cell.y - 1)] != null)
                count++;
            if (collection[(cell.x) + '_' + (cell.y - 1)] != null)
                count++;
            if (collection[(cell.x + 1) + '_' + (cell.y - 1)] != null)
                count++;
            if (collection[(cell.x + 1) + '_' + (cell.y)] != null)
                count++;
            if (collection[(cell.x + 1) + '_' + (cell.y + 1)] != null)
                count++;
            if (collection[(cell.x) + '_' + (cell.y + 1)] != null)
                count++;
            if (collection[(cell.x - 1) + '_' + (cell.y + 1)] != null)
                count++;
            if (collection[(cell.x - 1) + '_' + (cell.y)] != null)
                count++;
            return count;
        };
        CellOperations.deadNeighbours = function (cell, collection) {
            var neighbours = [];
            if (collection[(cell.x - 1) + '_' + (cell.y - 1)] == null)
                neighbours.push(new Cell(cell.x - 1, cell.y - 1));
            if (collection[(cell.x) + '_' + (cell.y - 1)] == null)
                neighbours.push(new Cell(cell.x, cell.y - 1));
            if (collection[(cell.x + 1) + '_' + (cell.y - 1)] == null)
                neighbours.push(new Cell(cell.x + 1, cell.y - 1));
            if (collection[(cell.x + 1) + '_' + (cell.y)] == null)
                neighbours.push(new Cell(cell.x + 1, cell.y));
            if (collection[(cell.x + 1) + '_' + (cell.y + 1)] == null)
                neighbours.push(new Cell(cell.x + 1, cell.y + 1));
            if (collection[(cell.x) + '_' + (cell.y + 1)] == null)
                neighbours.push(new Cell(cell.x, cell.y + 1));
            if (collection[(cell.x - 1) + '_' + (cell.y + 1)] == null)
                neighbours.push(new Cell(cell.x - 1, cell.y + 1));
            if (collection[(cell.x - 1) + '_' + (cell.y)] == null)
                neighbours.push(new Cell(cell.x - 1, cell.y));
            return neighbours;
        };
        return CellOperations;
    }());
    life.CellOperations = CellOperations;
    var Universe = (function () {
        function Universe(universe) {
            if (universe === void 0) { universe = {}; }
            this.universe = universe;
            this.killList = [];
            this.newCellList = [];
            this.cachedUniverse = [];
            for (var i in this.universe) {
                this.cachedUniverse.push(this.universe[i]);
                this.newCellList.push(this.universe[i]);
            }
        }
        Object.defineProperty(Universe.prototype, "newCells", {
            get: function () {
                return this.newCellList;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Universe.prototype, "clearCells", {
            get: function () {
                return this.killList;
            },
            enumerable: true,
            configurable: true
        });
        Universe.prototype.reset = function () {
            this.newCellList = [];
            this.killList = [];
            this.universe = {};
            for (var i in this.cachedUniverse) {
                var item = this.cachedUniverse[i];
                this.universe[item.toString()] = item;
                this.newCellList.push(item);
            }
        };
        Universe.prototype.randomise = function (max) {
            this.universe = {};
            this.newCellList = [];
            this.killList = [];
            var numCellsToGenerate = Math.round(Math.random() * max);
            var i = 0;
            while (i++ < numCellsToGenerate) {
                var point = new Cell(Math.round(Math.random() * 50), Math.round(Math.random() * 50));
                this.newCellList.push(point);
                this.universe[point.toString()] = point;
            }
            this.cachedUniverse = [];
            for (var item in this.universe) {
                this.cachedUniverse.push(this.universe[item]);
            }
        };
        Universe.prototype.applyRules = function () {
            this.killList = [];
            this.newCellList = [];
            for (var cell in this.universe) {
                var currentCell = this.universe[cell];
                var aliveneighbours = CellOperations.aliveNeighbours(currentCell, this.universe);
                if (aliveneighbours < 2)
                    this.killList.push(currentCell);
                if (aliveneighbours > 3)
                    this.killList.push(currentCell);
                var deadNeighbours = CellOperations.deadNeighbours(currentCell, this.universe);
                var i = 0;
                var len = deadNeighbours.length;
                while (i < len) {
                    var deadCell = deadNeighbours[i++];
                    if (CellOperations.aliveNeighbours(deadCell, this.universe) === 3)
                        this.newCellList.push(deadCell);
                }
            }
            this.applyQueues();
        };
        Universe.prototype.applyQueues = function () {
            var i = 0;
            var len = this.killList.length;
            while (i < len) {
                delete this.universe[this.killList[i++].toString()];
            }
            i = 0;
            len = this.newCellList.length;
            while (i < len) {
                this.universe[this.newCellList[i].toString()] = this.newCellList[i++];
            }
        };
        return Universe;
    }());
    life.Universe = Universe;
})(life || (life = {}));
