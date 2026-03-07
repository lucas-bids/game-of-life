import * as p5 from 'p5';

export function sketch(p5: p5) {
  let grid: Float64Array;
  let next: Float64Array;
  let lifespans: Uint8Array; // Array to track lifespans of cells created by mouseDragged
  let nextLifespans: Uint8Array;
  let cols: number;
  let rows: number;
  let colLeft: Int32Array;
  let colRight: Int32Array;
  let rowUp: Int32Array;
  let rowDown: Int32Array;
  let isPaused = false;
  let resolution = 4;
  let longevity = 30;
  let hueValue = 90;
  let dragRange = 5;
  let hueVariation = 5;
  let spawns = 100;

  const setPaused = (paused: boolean) => {
    isPaused = paused;
    (p5 as any).__paused = paused;
  };

  const resume = () => {
    if (isPaused) {
      setPaused(false);
      p5.loop();
    }
  };

  const initBuffers = () => {
    const size = cols * rows;
    grid = new Float64Array(size);
    next = new Float64Array(size);
    lifespans = new Uint8Array(size);
    nextLifespans = new Uint8Array(size);
    colLeft = new Int32Array(cols);
    colRight = new Int32Array(cols);
    rowUp = new Int32Array(rows);
    rowDown = new Int32Array(rows);

    for (let i = 0; i < cols; i++) {
      colLeft[i] = (i - 1 + cols) % cols;
      colRight[i] = (i + 1) % cols;
    }
    for (let j = 0; j < rows; j++) {
      rowUp[j] = (j - 1 + rows) % rows;
      rowDown[j] = (j + 1) % rows;
    }
  };

  p5.setup = () => {
    p5.createCanvas(1800, 1000).parent('sketch-holder');
    p5.colorMode(p5.HSB, 360, 255, 255);
    cols = p5.width / resolution;
    rows = p5.height / resolution;

    initBuffers(); // Initialize lifespan array

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
    resume();
    let col = Math.floor(p5.mouseX / resolution);
    let row = Math.floor(p5.mouseY / resolution);
    if (col >= 0 && col < cols && row >= 0 && row < rows) {

      for (let i = -dragRange; i < dragRange; i++) {
        for (let j = -dragRange; j < dragRange; j++) {
          let x = col - i;
          let y = row - j;
          if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
          let idx = x + (y * cols);
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
    p5.noStroke();
    let changed = false;

    for (let y = 0; y < rows; y++) {
      const yUp = rowUp[y];
      const yDown = rowDown[y];
      const row = y * cols;
      const rowUpOff = yUp * cols;
      const rowDownOff = yDown * cols;

      for (let x = 0; x < cols; x++) {
        const idx = row + x;
        const state = grid[idx];

        if (state > 0) {
          p5.fill(state, 255, 255);
          p5.rect(x * resolution, y * resolution, resolution, resolution);
        }

        const xL = colLeft[x];
        const xR = colRight[x];

        let neighbors = 0;
        let hueSum = 0;

        let v = grid[rowUpOff + xL];
        if (v > 0) neighbors++;
        hueSum += v;
        v = grid[rowUpOff + x];
        if (v > 0) neighbors++;
        hueSum += v;
        v = grid[rowUpOff + xR];
        if (v > 0) neighbors++;
        hueSum += v;
        v = grid[row + xL];
        if (v > 0) neighbors++;
        hueSum += v;
        v = grid[row + xR];
        if (v > 0) neighbors++;
        hueSum += v;
        v = grid[rowDownOff + xL];
        if (v > 0) neighbors++;
        hueSum += v;
        v = grid[rowDownOff + x];
        if (v > 0) neighbors++;
        hueSum += v;
        v = grid[rowDownOff + xR];
        if (v > 0) neighbors++;
        hueSum += v;

        let nextValue = state;
        let nextLife = lifespans[idx];

        if (state == 0 && neighbors == 3) {
          nextValue = hueSum / neighbors;
          nextLife = 0;
        } else if (state > 0 && (neighbors < 2 || neighbors > 3)) {
          if (nextLife != 0) {
            nextLife = nextLife - 1;
            nextValue = hueValue;
          } else {
            nextValue = 0;
            nextLife = 0;
          }
        }

        next[idx] = nextValue;
        nextLifespans[idx] = nextLife;
        if (!changed && (nextValue !== state || nextLife !== lifespans[idx])) {
          changed = true;
        }
      }
    }

    // Swap grids and lifespans
    let temp = grid;
    grid = next;
    next = temp;
    let tempLife = lifespans;
    lifespans = nextLifespans;
    nextLifespans = tempLife;

    if (!changed) {
      setPaused(true);
      p5.noLoop();
    }
  };
}
