namespace life
{
	export class LifeApp
	{
		private rendering: CanvasRendering;
		private universe: Universe;

		private canvas: HTMLCanvasElement;
		private iterationsInput: HTMLInputElement;
		private speedInput: HTMLInputElement;
		private beginBtn: HTMLInputElement;
		private resetBtn: HTMLInputElement;
		private randomBtn: HTMLInputElement;
		private counter: HTMLSpanElement;

		private iterations: number = 50;
		private iterationsMin: number = 1;
		private iterationsMax: number = 10000;

		private speed: number = 1;
		private speedMin: number = 1;
		private speedMax: number = 10;

		private iterator: number = 0;
		private timer: number = -1;

		constructor(cells: Object)
		{
			this.canvas = <HTMLCanvasElement>document.getElementById('life');
			this.beginBtn = <HTMLInputElement>document.getElementById('begin');
			this.resetBtn = <HTMLInputElement>document.getElementById('reset');
			this.iterationsInput = <HTMLInputElement>document.getElementById('iterations');
			this.speedInput = <HTMLInputElement>document.getElementById('speed');
			this.randomBtn = <HTMLInputElement>document.getElementById('random');
			this.counter = <HTMLSpanElement>document.getElementById('counter');

			this.rendering = new CanvasRendering(this.canvas);
			this.universe = new Universe(cells);

			this.beginBtn.addEventListener('click', (e: Event) => this.onBegin(e));
			this.resetBtn.addEventListener('click', (e: Event) => this.onReset(e));
			this.randomBtn.addEventListener('click', (e: Event) => this.onRandom(e));

			this.rendering.clearCellList(this.universe.clearCells);
			this.rendering.drawCellList(this.universe.newCells);
		}

		private onBegin(e: Event): void
		{
			this.iterations = parseInt(this.iterationsInput.value);
			if (this.iterations < this.iterationsMin) this.iterations = this.iterationsMin;
			if (this.iterations > this.iterationsMax) this.iterations = this.iterationsMax;

			this.speed = parseInt(this.speedInput.value);
			if (this.speed > this.speedMax) this.speed = this.speedMax;
			if (this.speed < this.speedMin) this.speed = this.speedMin;

			this.timer = setInterval(() => this.drawOneStep(), 500 / this.speed);
		}

		private onReset(e: Event): void
		{
			this.resetLifeApp();
			this.universe.reset();
			this.rendering.clearCanvas();
			this.rendering.drawCellList(this.universe.newCells);
		}

		private resetLifeApp(): void
		{
			clearInterval(this.timer);
			this.timer = -1;
			this.iterator = 0;
			this.counter.innerHTML = "1";
		}

		private onRandom(e: Event): void
		{
			this.resetLifeApp();
			this.universe.randomise((this.canvas.height * this.canvas.width) * 0.01);
			this.rendering.clearCanvas();
			this.rendering.drawCellList(this.universe.newCells);
		}

		private drawOneStep()
		{
			this.iterator++;
			this.universe.applyRules();
			this.rendering.clearCellList(this.universe.clearCells);
			this.rendering.drawCellList(this.universe.newCells);
			this.counter.innerHTML = this.iterator.toString();

			if (this.iterations <= this.iterator)
			{
				clearInterval(this.timer);
			}
		}
	}


	window.onload = () => 
	{
		var a: Cell = new Cell(1, 1);
		var b: Cell = new Cell(1, 2);
		var c: Cell = new Cell(1, 3);
		var d: Cell = new Cell(2, 1);
		var e: Cell = new Cell(3, 3);
		var cells: Object = {};

		cells[a.toString()] = a;
		cells[b.toString()] = b;
		cells[c.toString()] = c;
		cells[d.toString()] = d;
		cells[e.toString()] = e;

		new LifeApp(cells);
	};
}