namespace life
{
	export class Cell extends Point
	{
		constructor(x: number, y: number)
		{
			super(x, y);
		}

		public toString(): string
		{
			return this.x + '_' + this.y;
		}
	}

	export class CellOperations
	{
		public static aliveNeighbours(cell: Cell, collection: Object): number
		{
			var count: number = 0;
			if (collection[(cell.x - 1) + '_' + (cell.y - 1)] != null) count++;
			if (collection[(cell.x) + '_' + (cell.y -1)] != null) count++;
			if (collection[(cell.x + 1) + '_' + (cell.y -1)] != null) count++;
			if (collection[(cell.x + 1) + '_' + (cell.y)] != null) count++;
			if (collection[(cell.x + 1) + '_' + (cell.y + 1)] != null) count++;
			if (collection[(cell.x) + '_' + (cell.y + 1)] != null) count++;
			if (collection[(cell.x - 1) + '_' + (cell.y + 1)] != null) count++;
			if (collection[(cell.x - 1) + '_' + (cell.y)] != null) count++;
			return count;
		}

		public static deadNeighbours(cell: Cell, collection: Object): Cell[]
		{
			var neighbours: Cell[] = [];
			if (collection[(cell.x - 1) + '_' + (cell.y - 1)] == null) neighbours.push(new Cell(cell.x - 1, cell.y - 1));
			if (collection[(cell.x) + '_' + (cell.y - 1)] == null) neighbours.push(new Cell(cell.x, cell.y - 1));
			if (collection[(cell.x + 1) + '_' + (cell.y - 1)] == null) neighbours.push(new Cell(cell.x + 1, cell.y - 1));
			if (collection[(cell.x + 1) + '_' + (cell.y)] == null) neighbours.push(new Cell(cell.x + 1, cell.y));
			if (collection[(cell.x + 1) + '_' + (cell.y + 1)] == null) neighbours.push(new Cell(cell.x + 1, cell.y + 1));
			if (collection[(cell.x) + '_' + (cell.y + 1)] == null) neighbours.push(new Cell(cell.x, cell.y + 1));
			if (collection[(cell.x - 1) + '_' + (cell.y + 1)] == null) neighbours.push(new Cell(cell.x - 1, cell.y + 1));
			if (collection[(cell.x - 1) + '_' + (cell.y)] == null) neighbours.push(new Cell(cell.x - 1, cell.y));
			return neighbours;
		}
	}

	export class Universe
	{
		/*
			rules:
			Any live cell with fewer than two live neighbours dies, as if caused by under-population.
			Any live cell with two or three live neighbours lives on to the next generation.
			Any live cell with more than three live neighbours dies, as if by over-population.
			Any dead cell with exactly three live neighbours becomes a live cell, as if by reproduction.
		*/

		private killList: Cell[] = [];
		private newCellList: Cell[] = [];
		private cachedUniverse: Cell[] = [];

		constructor(
			private universe: Object = {}
		)
		{
			for (var i in this.universe)
			{
				this.cachedUniverse.push(this.universe[i]);
				this.newCellList.push(this.universe[i]);
			}
		}

		public get newCells(): Cell[]
		{
			return this.newCellList;
		}

		public get clearCells(): Cell[]
		{
			return this.killList;
		}

		public reset(): void
		{
			this.newCellList = [];
			this.killList = [];

			this.universe = {};
			for (var i in this.cachedUniverse)
			{
				var item: Cell = this.cachedUniverse[i];
				this.universe[item.toString()] = item;
				this.newCellList.push(item);
			}
		}

		public randomise(max: number): void
		{
			this.universe = {};
			this.newCellList = [];
			this.killList = [];

			var numCellsToGenerate: number = Math.round(Math.random() * max);
			var i = 0;

			while (i++ < numCellsToGenerate)
			{
				var point: Cell = new Cell(Math.round(Math.random() * 50), Math.round(Math.random() * 50));
				this.newCellList.push(point);
				this.universe[point.toString()] = point;
			}
			this.cachedUniverse = [];

			for (var item in this.universe)
			{
				this.cachedUniverse.push(this.universe[item]);
			}
		}

		public applyRules(): void
		{
			this.killList = [];
			this.newCellList = [];

			for (var cell in this.universe)
			{
				var currentCell: Cell = this.universe[cell];

				var aliveneighbours: number = CellOperations.aliveNeighbours(currentCell, this.universe);

				if (aliveneighbours < 2) this.killList.push(currentCell);
				if (aliveneighbours > 3) this.killList.push(currentCell);

				var deadNeighbours: Cell[] = CellOperations.deadNeighbours(currentCell, this.universe);

				var i: number = 0; var len: number = deadNeighbours.length;
				while (i < len)
				{
					var deadCell: Cell = deadNeighbours[i++];
					if (CellOperations.aliveNeighbours(deadCell, this.universe) === 3) this.newCellList.push(deadCell);
				}
			}

			this.applyQueues();
		}

		private applyQueues(): void
		{
			var i: number = 0; var len: number = this.killList.length;
			while (i < len)
			{
				delete this.universe[this.killList[i++].toString()];
			}

			i = 0; len = this.newCellList.length;
			while (i < len)
			{
				this.universe[this.newCellList[i].toString()] = this.newCellList[i++];
			}
		}
	}
}