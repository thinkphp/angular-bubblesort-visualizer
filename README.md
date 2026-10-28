# Bubble Sort Visualizer (Angular)

A visualizer for the Bubble Sort algorithm, converted to **Angular 22** using standalone components, reactive signals, Web Audio API procedural sound synthesis, and smooth FLIP layout animations.

## 🚀 Live Demo

[View live application](https://USERNAME.github.io/bubblesort-visualizer/)

> *(Înlocuiește `USERNAME` cu username-ul tău de GitHub)*

---

## 📋 Features

- **Bubble Sort Visualizer**: Step-by-step visualization of comparisons, swaps, and sorted elements.
- **Audio Synthesis (*Sound of Sorting*)**: Procedural sound tones generated via Web Audio API, with pitch proportional to element value and celebration victory arpeggios.
- **Dynamic Telemetry HUD**: Live metrics tracking Comparisons, Swaps, Pass Progress, and O(n²) complexity.
- **Dataset Presets**:
  - 🎲 Random
  - 📉 Reversed (Worst-case)
  - 📈 Nearly Sorted
  - 🔁 Few Unique (Duplicates)
- **Fluid FLIP Animations**: High-performance hardware-accelerated bar swapping without heavy external animation dependencies.
- **Interactive Controls**: Play, Pause, Resume, Reset, and Speed toggles (`0.5×`, `1×`, `2×`, `4×`).

---

## 💻 Development Server

To run the application locally:

```bash
npm start
# sau: ng serve
```

Deschide în browser la `http://localhost:4200/`.

---

## 🚀 Deploy pe GitHub Pages

### Metoda 1: Folosind scriptul automat `npm run deploy`

1. Asigură-te că ai creat repository-ul pe GitHub (de exemplu `bubblesort-visualizer`) și ai adăugat remote-ul:
   ```bash
   git remote add origin git@github.com:USERNAME/bubblesort-visualizer.git
   ```

2. Rulează comanda de deploy:
   ```bash
   npm run deploy
   ```
   *(Această comandă rulează `ng build --base-href /bubblesort-visualizer/` și publică automat directorul de browser pe branch-ul `gh-pages`)*

3. În setările repository-ului de pe GitHub (`Settings` -> `Pages`):
   - La **Source**, selectează `Deploy from a branch`.
   - La branch, selectează `gh-pages` și folderul `/(root)`.
   - Salvează. Aplicația va fi online la `https://USERNAME.github.io/bubblesort-visualizer/`.

---

## 🧪 Testare & Build

Pentru rularea testelor unitare:
```bash
npm test -- --watch=false
```

Pentru generarea build-ului de producție:
```bash
npm run build
```
