# Bubble Sort Visualizer (Angular)

A visualizer for the Bubble Sort algorithm, converted to **Angular 22** using standalone components, signals, and smooth FLIP layout animations.

## Features

- **Bubble Sort Visualizer**: Step-by-step visualization of comparisons, swaps, and sorted elements.
- **Color Feedback**:
  - Blue (`#3498db`): Unsorted bars.
  - Orange (`#f39c12`): Elements currently being compared.
  - Red (`#e74c3c`): Elements currently being swapped.
  - Green (`#2ecc71`): Elements placed in their final sorted positions.
- **Smooth FLIP Animations**: Swapping elements glide smoothly past each other using CSS transforms.
- **Controls**:
  - `Generate`: Generates a new random array of 7 elements.
  - `Start` / `Sorting...`: Runs the Bubble Sort algorithm.

## Development Server

To run the development server:

```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`.

## Build

To build the production application:

```bash
npm run build
```

The output will be placed in `dist/bubblesort-visualizer`.

## Tests

To run the unit tests:

```bash
npm test -- --watch=false
```
