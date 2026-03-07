import * as p5 from 'p5';

export function sketch(p5: p5) {
  const makeArray = (cols: number, rows: number) =>
    new Array(cols * rows).fill(0);
  let grid: number[];
  let next: number[];
  let lifespans: number[]; // Array to track lifespans of cells created by mouseDragged
  let cols: number;
  let rows: number;
  let resolution = 8;
  let longevity = 30;
  let hueValue = 90;
  let dragRange = 2;
  let hueVariation = 5;
  let spawns = 100;

  p5.setup = () => {
    p5.createCanvas(1800, 1000).parent('sketch-holder');
    p5.colorMode(p5.HSB, 360, 255, 255);
    cols = p5.width / resolution;
    rows = p5.height / resolution;

    grid = makeArray(cols, rows);
    next = makeArray(cols, rows);
    lifespans = makeArray(cols, rows); // Initialize lifespan array

    for (let i = 0; i < cols * rows; i++) {
      grid[i] = p5.random(1) < 0.01 ? 0 : p5.random(1, 180);
      if ((i % cols) % 4 == 0) {
        p5.fill(grid[i], 255, 255 );
        p5.noStroke();
        p5.rect(i * resolution, ((p5.floor(i/cols)) * resolution), resolution, resolution);
      }

      // grid[i] = 0;
    }
  };

  p5.mouseDragged = () => {
    let col = Math.floor(p5.mouseX / resolution);
    let row = Math.floor(p5.mouseY / resolution);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {

      for (let i = -dragRange; i < dragRange; i++) {
        for (let j = -dragRange; j < dragRange; j++) {
          let idx = (col-i) + ((row-j) * (cols));
          grid[idx] = hueValue;
          lifespans[idx] = longevity; // Cells created by mouseDragged get 5 generations of life
        }
      }
    }

    hueValue += hueVariation;
    if (hueValue > 360) {
      hueValue = 1;
    }
  };

  p5.draw = () => {
    p5.background(0);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let idx = i + j * cols;
        if (grid[idx] > 0) {
          p5.fill(grid[idx], 255, 255);
          p5.noStroke();
          p5.rect(i * resolution, j * resolution, resolution, resolution);
        }
      }
    }

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let idx = i + j * cols;
        let state = grid[idx];
        let neighbors = countNeighbors(grid, i, j, cols, rows);
        let totalHue = neighborsAverageHue(grid, i, j, cols, rows);

        if (state == 0 && neighbors == 3) {
          next[idx] = totalHue / neighbors;
          // next[idx+(-300)] = totalHue / neighbors;
          // next[idx+300] = totalHue / neighbors;
        } else if (state > 0 && (neighbors < 2 || neighbors > 3)) {
          if (lifespans[idx] != 0) {
            lifespans[idx]--; // Decrease lifespan if it's still greater than 0
            next[idx] = hueValue; // Keep alive while lifespan is positive
          } else {
            next[idx] = 0; // Die if lifespan has expired or wasn't set
          }
        } else {
          next[idx] = state;
        }
      }
    }

    // Swap grids and reset lifespans of cells that died
    let temp = grid;
    grid = next;
    next = temp;
    for (let i = 0; i < cols * rows; i++) {
      if (grid[i] === 0) lifespans[i] = 0;
    }
  };

  const countNeighbors = (
    grid: number[],
    x: number,
    y: number,
    cols: number,
    rows: number
  ) => {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        let cellValue = grid[col + row * cols];

        // Normalizes cellValue if not 0
        if (cellValue > 0) {
          sum += cellValue / cellValue;
        } else {
          sum += cellValue;
        }
      }
    }
    if (grid[x + y * cols] / grid[x + y * cols] > 0) {
      return sum - grid[x + y * cols] / grid[x + y * cols];
    } else {
      return sum;
    }
  };

  const neighborsAverageHue = (
    grid: number[],
    x: number,
    y: number,
    cols: number,
    rows: number
  ) => {
    let sum = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        let col = (x + i + cols) % cols;
        let row = (y + j + rows) % rows;
        let cellValue = grid[col + row * cols];

        sum += cellValue;
      }
    }

    return sum;
  };
}
