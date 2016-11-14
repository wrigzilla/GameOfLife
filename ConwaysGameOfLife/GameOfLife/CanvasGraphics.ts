namespace life
{
	export class Point
	{
		constructor(public x: number, public y: number)
		{}
	}

	export class CanvasRendering
	{
		private context: CanvasRenderingContext2D;

		constructor(private canvas: HTMLCanvasElement, private scale: number = 10)
		{
			if (canvas) this.context = canvas.getContext('2d');
			this.context.fillStyle = "black";
		}

		public paintSquare(point: Point): void
		{
			this.context.fillRect(point.x * this.scale, point.y * this.scale, this.scale, this.scale);
		}

		public clearSquare(point: Point): void
		{
			this.context.clearRect(point.x * this.scale, point.y * this.scale, this.scale, this.scale);
		}

		public drawCellList(cells: Cell[]): void
		{
			var i: number = 0; var len: number = cells.length;
			while (i < len)
			{
				this.paintSquare(cells[i++]);
			}
		}

		public clearCellList(cells: Cell[]): void
		{
			var i: number = 0; var len: number = cells.length;
			while (i < len)
			{
				this.clearSquare(cells[i++]);
			}
		}

		public clearCanvas(): void
		{
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}
}