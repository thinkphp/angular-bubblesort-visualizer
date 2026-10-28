# Bubble Sort Visualizer

An interactive visualization of the Bubble Sort algorithm, built with **Angular 22**. It uses standalone components, reactive signals, smooth FLIP animations, and procedural audio generated with the Web Audio API.

## Live Demo

[View the application](https://thinkphp.github.io/angular-bubblesort-visualizer/)

## Features

- **Step-by-step sorting:** See comparisons, swaps, and sorted elements as Bubble Sort runs.
- **Procedural audio:** Hear tones whose pitch corresponds to each element's value, plus a completion arpeggio.
- **Live metrics:** Track comparisons, swaps, pass progress, and the algorithm's O(n²) complexity.
- **Dataset presets:** Choose Random, Reversed (worst case), Nearly Sorted, or Few Unique (duplicates).
- **Smooth animations:** Bar swaps use FLIP animations without an external animation library.
- **Playback controls:** Play, pause, resume, reset, and adjust the speed (0.5×, 1×, 2×, or 4×).

## Getting Started

### Requirements

- Node.js and npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm start
```

Then open [http://localhost:4200/](http://localhost:4200/) in your browser. You can also start the server with `npx ng serve`.

## Build

Create a production build with:

```bash
npm run build
```

The generated files are written to `dist/angular-bubblesort-visualizer/browser`.

## Tests

Run the project tests with:

```bash
npm test
```

## Deploy to GitHub Pages

The project includes a deploy script configured for the `angular-bubblesort-visualizer` GitHub repository. Make sure the repository's GitHub Pages deployment permissions are configured, then run:

```bash
npm run deploy
```

The script builds the app with the `/angular-bubblesort-visualizer/` base path and publishes the browser output to the `gh-pages` branch. The application is available at:

```text
https://USERNAME.github.io/angular-bubblesort-visualizer/
```

Replace `USERNAME` with your GitHub username. For a differently named repository, update the `--base-href` and `--dir` values in the `deploy` script in `package.json`.
