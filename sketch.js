const canvasWidth = 800;
const canvasHeight = 600;
const w = 10;
const h = 10;
const rows = canvasHeight / h;
const cols = canvasWidth / w;
const brushSize = 4;
const hueStep = 0.05;

let grid = [];
let hueVal = 1;

const drawGrid = (grid) => {
  strokeWeight(1);
  stroke(255);

  loopGrid(grid, (x, y, cell) => {
    if (isEmpty(cell)) fill(0);
    else fill(cell, 255, 255);

    rect(x * w, y * h, w, h);
  });
};

const createGrid = (x, y) =>
  Array.from({ length: y }, () => Array.from({ length: x }, () => 0));

function setup() {
  colorMode(HSB, 360, 255, 255);

  createCanvas(canvasWidth, canvasHeight);

  grid = createGrid(cols, rows);
}

function draw() {
  const newGrid = createGrid(cols, rows);

  loopGrid(grid, (x, y, cell) => {
    if (isEmpty(cell)) return;

    const mark = (_x = x, _y = y) => (newGrid[_y][_x] = cell);

    /** Floor */
    if (y >= rows - 1) return mark();

    /** Go one down */
    if (isEmpty(grid[y + 1][x])) return mark(x, y + 1);

    /** Randomly move to bottom right/left  */
    const moves = [-1, 1].filter((dir) => grid[y + 1][x + dir] === 0);

    if (isEmpty(moves.length)) return mark();

    mark(x + random(moves), y + 1);
  });

  grid = newGrid;

  drawGrid(grid);
}

function mouseMoved() {
  const r = floor(mouseX / w);
  const c = floor(mouseY / h);

  loopGrid(createGrid(brushSize, brushSize), (_x, _y) => {
    let x = _x + r - brushSize / 2,
      y = _y + c - brushSize / 2;

    if (!isEmpty(grid[y]?.[x])) return;

    grid[y][x] = hueVal += hueStep;

    hueVal %= 360;
  });
}

const isEmpty = (cell) => cell === 0;

const loopGrid = (grid, cb) => {
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      cb(x, y, grid[y][x]);
    }
  }
};
