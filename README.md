
# Game of Life

An interactive, browser-based implementation of Conway’s Game of Life built with Angular, TypeScript, SCSS, and p5.js.

This project turns a classic computer science simulation into a responsive visual experience. Users can interact with the grid directly, paint living cells, trigger new patterns, and watch simple rules produce complex motion.

**Live project:** https://game-of-life-94.netlify.app

![Game of Life preview](https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExeXd4c2Y5bmtvbXZyc2NmdWc0aGhzNjV5bXJkdGVuaHp2emxvcGg1aSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/tb4eVLcwWjyY8inLph/giphy.gif)

## Why I built this

I built this project to practice front-end engineering beyond static interfaces: rendering, interaction, animation loops, state updates, performance, and responsive behavior.

Conway’s Game of Life is a good challenge because the visual output is simple, but the implementation requires clear thinking around data structures, update cycles, edge handling, and user interaction.

## Features

- Interactive cellular automaton inspired by Conway’s Game of Life
- Canvas rendering with p5.js
- Angular service layer for managing the p5 sketch lifecycle
- Responsive canvas sizing for different screen sizes
- Mouse and touch interaction for painting new cells
- Color variation through hue-based cell states
- Optimized grid storage using typed arrays
- Automatic pause when the simulation reaches a stable state
- Visibility handling to stop rendering when the browser tab is hidden

## Tech stack

- Angular
- TypeScript
- p5.js
- SCSS
- RxJS
- Angular CLI

## Technical highlights

The project uses typed arrays to represent the grid, lifespan data, and precomputed neighbor indexes. This keeps the simulation logic efficient and avoids unnecessary object-heavy state updates.

The p5.js sketch is initialized through an Angular service and runs outside Angular’s zone, keeping the rendering loop separate from Angular’s change detection cycle.

The simulation also precomputes wrapped grid edges, allowing cells at the borders to interact with cells on the opposite side of the grid. This creates a continuous toroidal simulation space instead of hard edges.

## What this project demonstrates

This project demonstrates practical front-end skills that are useful in production work:

- Breaking interactive behavior into clear rendering and state-update logic
- Integrating a creative coding library inside an Angular application
- Managing component and service lifecycles
- Handling browser events such as resize, visibility changes, mouse input, and touch input
- Thinking about performance when rendering many elements repeatedly
- Building a small but complete interactive experience from scratch

## Getting started

Clone the repository:

```bash
git clone https://github.com/lucas-bids/game-of-life.git
cd game-of-life
````

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm start
```

Then open:

```bash
http://localhost:4200
```

## Available scripts

Run the local development server:

```bash
npm start
```

Build the project:

```bash
npm run build
```

Run tests:

```bash
npm test
```

## Project structure

```bash
src/
  app/
    app.component.ts
    app.component.scss
    p5.service.ts
    sketch.ts
  assets/
  styles.scss
  main.ts
```

Key files:

* `sketch.ts` contains the simulation, rendering loop, cell rules, interaction handling, and responsive canvas behavior.
* `p5.service.ts` manages the p5.js lifecycle inside Angular.
* `app.component.ts` initializes and destroys the p5 sketch with the Angular component lifecycle.
* `app.component.scss` and `styles.scss` handle layout and full-screen canvas behavior.

## Future improvements

Potential next steps for this project:

* Add UI controls for speed, resolution, color palette, and pause/play
* Add preset patterns such as gliders, blinkers, and pulsars
* Add a randomize/reset button
* Add a live generation counter
* Improve accessibility with keyboard controls
* Add deployment notes for Netlify

## About

This is a small front-end engineering project focused on interactive rendering, simulation logic, and clean integration between Angular and p5.js.

It is part of my portfolio as a developer building practical, visual, and user-facing web experiences.

```
```
