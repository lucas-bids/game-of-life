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
  const maxCanvasWidth = 1200;
  const maxCanvasHeight = 800;
  const paletteHues = [30, 120, 210, 280];
  let paletteIndex = 0;
  let resolution = 0;
  let longevity = 30;
  let hueValue = paletteHues[0];
  let dragRange = 5;
  let spawns = 100;
  let lastTouchAt = 0;

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

  const getCanvasSize = () => {
    return {
      width: Math.min(p5.windowWidth, maxCanvasWidth),
      height: Math.min(p5.windowHeight, maxCanvasHeight),
    };
  };

  const getResolution = (width: number, height: number) => {
    const minDim = Math.min(width, height);
    if (minDim < 320) return 2;
    if (minDim < 420) return 3;
    return 4;
  };

  const seedGrid = (drawPreview: boolean) => {
    for (let i = 0; i < cols * rows; i++) {
      grid[i] = p5.random(1) < 0.01 ? 0 : p5.random(1, 180);
      if (drawPreview && (i % cols) % 4 == 0) {
        p5.fill(grid[i], 255, 255);
        p5.noStroke();
        p5.rect(i * resolution, p5.floor(i / cols) * resolution, resolution, resolution);
      }
    }
  };

  const applySizing = (drawPreview: boolean) => {
    const { width, height } = getCanvasSize();
    const nextResolution = getResolution(width, height);
    const sizeChanged = width !== p5.width || height !== p5.height;
    const resolutionChanged = nextResolution !== resolution;

    if (!sizeChanged && !resolutionChanged) return;

    if (sizeChanged) {
      p5.resizeCanvas(width, height);
    }

    resolution = nextResolution;
    cols = Math.floor(p5.width / resolution);
    rows = Math.floor(p5.height / resolution);
    initBuffers();
    seedGrid(drawPreview);
    resume();
  };

  p5.setup = () => {
    const { width, height } = getCanvasSize();
    const canvas = p5.createCanvas(width, height);
    canvas.parent('sketch-holder');
    canvas.elt.style.touchAction = 'none';
    canvas.elt.style.userSelect = 'none';
    p5.colorMode(p5.HSB, 360, 255, 255);
    resolution = getResolution(width, height);
    cols = Math.floor(p5.width / resolution);
    rows = Math.floor(p5.height / resolution);

    initBuffers();
    seedGrid(true);
  };

  const handlePress = () => {
    resume();
    hueValue = paletteHues[paletteIndex];
    paletteIndex = (paletteIndex + 1) % paletteHues.length;
  };

  const handleDragAt = (x: number, y: number) => {
    resume();
    let col = Math.floor(x / resolution);
    let row = Math.floor(y / resolution);
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
  };

  p5.mousePressed = () => {
    if (Date.now() - lastTouchAt < 500) return;
    handlePress();
  };

  p5.mouseDragged = () => {
    handleDragAt(p5.mouseX, p5.mouseY);
  };

  p5.touchStarted = () => {
    lastTouchAt = Date.now();
    handlePress();
    if (p5.touches.length > 0) {
      const touch = p5.touches[0];
      handleDragAt(touch.x, touch.y);
    }
    return false;
  };

  p5.touchMoved = () => {
    if (p5.touches.length > 0) {
      const touch = p5.touches[0];
      handleDragAt(touch.x, touch.y);
    }
    return false;
  };

  p5.draw = () => {
    p5.background(247);
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

  p5.windowResized = () => {
    applySizing(false);
  };
}
