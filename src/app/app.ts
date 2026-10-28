import {
  Component,
  ElementRef,
  computed,
  signal,
  viewChildren,
} from '@angular/core';
import { CommonModule } from '@angular/common';

export interface BarItem {
  id: number;
  value: number;
}

export type PresetType = 'random' | 'reversed' | 'nearly-sorted' | 'few-unique';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private nextId = 1;
  private isCancelled = false;

  // Web Audio Context
  private audioCtx: AudioContext | null = null;
  readonly soundEnabled = signal<boolean>(true);

  // Bars State
  readonly bars = signal<BarItem[]>([
    { id: 1, value: 50 },
    { id: 2, value: 30 },
    { id: 3, value: 80 },
    { id: 4, value: 20 },
    { id: 5, value: 60 },
    { id: 6, value: 10 },
  ]);

  // Highlighting State
  readonly comparingIds = signal<number[]>([]);
  readonly swappingIds = signal<number[]>([]);
  readonly sortedIds = signal<number[]>([]);

  // Execution & Speed State
  readonly running = signal<boolean>(false);
  readonly paused = signal<boolean>(false);
  readonly speedMultiplier = signal<number>(1); // 0.5, 1, 2, 4
  readonly activePreset = signal<PresetType>('random');

  // Live Metrics
  readonly comparisons = signal<number>(0);
  readonly swaps = signal<number>(0);
  readonly currentPass = signal<number>(0);
  readonly totalPasses = computed(() => Math.max(1, this.bars().length - 1));
  readonly statusMessage = signal<string>('Gata de pornire');

  readonly barElements = viewChildren<ElementRef<HTMLElement>>('barRef');

  constructor() {
    this.nextId = 7;
  }

  // --- AUDIO SYNTHESIS (Sound of Sorting) ---
  private initAudio(): void {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.audioCtx = new AudioCtx();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound(): void {
    this.initAudio();
    this.soundEnabled.update((v) => !v);
  }

  private playTone(value: number, type: 'compare' | 'swap' | 'sorted' = 'compare'): void {
    if (!this.soundEnabled()) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      const normalized = Math.max(0.1, Math.min(1, value / 100));
      const freq = 200 + normalized * 650; // 200Hz - 850Hz

      osc.type = type === 'swap' ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      const duration = type === 'swap' ? 0.12 : 0.08;
      const vol = type === 'swap' ? 0.09 : 0.05;

      gain.gain.setValueAtTime(vol, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + duration);
    } catch {
      // Audio fallback
    }
  }

  private playSuccessArpeggio(): void {
    if (!this.soundEnabled()) return;
    const notes = [261.63, 329.63, 392.0, 523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        try {
          this.initAudio();
          if (!this.audioCtx) return;
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);
          gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start();
          osc.stop(this.audioCtx.currentTime + 0.3);
        } catch {
          // Ignore
        }
      }, idx * 70);
    });
  }

  // --- HELPERS ---
  private sleep(ms: number): Promise<void> {
    const adjusted = ms / this.speedMultiplier();
    return new Promise((resolve) => setTimeout(resolve, adjusted));
  }

  isComparing(id: number): boolean {
    return this.comparingIds().includes(id);
  }

  isSwapping(id: number): boolean {
    return this.swappingIds().includes(id);
  }

  isSorted(id: number): boolean {
    return this.sortedIds().includes(id);
  }

  // --- FLIP ANIMATION ---
  private recordPositions(): Map<number, number> {
    const positions = new Map<number, number>();
    for (const ref of this.barElements()) {
      const el = ref.nativeElement;
      const id = Number(el.getAttribute('data-id'));
      positions.set(id, el.getBoundingClientRect().left);
    }
    return positions;
  }

  private async animateSwap(prevPositions: Map<number, number>): Promise<void> {
    await new Promise((resolve) => requestAnimationFrame(resolve));
    const durationMs = Math.min(600, Math.max(140, 550 / this.speedMultiplier()));

    for (const ref of this.barElements()) {
      const el = ref.nativeElement;
      const id = Number(el.getAttribute('data-id'));
      const oldLeft = prevPositions.get(id);

      if (oldLeft !== undefined) {
        const newLeft = el.getBoundingClientRect().left;
        const deltaX = oldLeft - newLeft;

        if (Math.abs(deltaX) > 0.5) {
          el.style.transform = `translateX(${deltaX}px)`;
          el.style.transition = 'none';

          void el.offsetHeight; // Force reflow

          el.style.transition = `transform ${durationMs}ms cubic-bezier(0.34, 1.56, 0.64, 1)`;
          el.style.transform = 'translateX(0)';

          setTimeout(() => {
            el.style.transform = '';
            el.style.transition = '';
          }, durationMs + 30);
        }
      }
    }
  }

  // --- BUBBLE SORT CORE ---
  async bubbleSort(): Promise<void> {
    if (this.running()) {
      if (this.paused()) {
        this.paused.set(false);
        this.statusMessage.set('Sortare reluată...');
      }
      return;
    }

    this.initAudio();
    this.running.set(true);
    this.paused.set(false);
    this.isCancelled = false;
    this.sortedIds.set([]);
    this.comparisons.set(0);
    this.swaps.set(0);
    this.currentPass.set(0);

    const arr = [...this.bars()];
    const n = arr.length;

    for (let i = 0; i < n; i++) {
      if (this.isCancelled) break;
      this.currentPass.set(i + 1);
      let swappedInThisPass = false;

      for (let j = 0; j < n - i - 1; j++) {
        if (this.isCancelled) break;

        // Așteaptă dacă utilizatorul a apăsat Pauză
        while (this.paused() && !this.isCancelled) {
          await this.sleep(100);
        }
        if (this.isCancelled) break;

        const valA = arr[j].value;
        const valB = arr[j + 1].value;

        // Evidențiere comparare
        this.comparingIds.set([arr[j].id, arr[j + 1].id]);
        this.comparisons.update((c) => c + 1);
        this.statusMessage.set(`Compară: ${valA} cu ${valB}`);
        this.playTone(valA, 'compare');

        await this.sleep(500);

        if (valA > valB) {
          // Evidențiere swap
          this.swappingIds.set([arr[j].id, arr[j + 1].id]);
          this.swaps.update((s) => s + 1);
          this.statusMessage.set(`Interschimbare: ${valA} > ${valB}`);
          this.playTone(valB, 'swap');

          await this.sleep(250);

          const prevPositions = this.recordPositions();

          // Interschimbare fizică în vector
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swappedInThisPass = true;

          this.bars.set([...arr]);
          await this.animateSwap(prevPositions);

          await this.sleep(550);
        }

        this.comparingIds.set([]);
        this.swappingIds.set([]);
      }

      // Elementul de la poziția finală n - i - 1 este acum sortat
      const settled = arr[n - i - 1];
      if (settled) {
        this.sortedIds.update((ids) => [...ids, settled.id]);
      }

      // Optimizare Bubble Sort: dacă nu s-a făcut niciun swap, vectorul e gata sortat
      if (!swappedInThisPass && !this.isCancelled) {
        break;
      }
    }

    if (!this.isCancelled) {
      this.sortedIds.set(arr.map((item) => item.id));
      this.statusMessage.set('✓ Sortare completă!');
      this.playSuccessArpeggio();
    }

    this.running.set(false);
    this.paused.set(false);
  }

  togglePause(): void {
    if (!this.running()) return;
    this.paused.update((p) => !p);
    this.statusMessage.set(this.paused() ? '⏸ În pauză' : 'Sortare în desfășurare...');
  }

  reset(): void {
    this.isCancelled = true;
    this.running.set(false);
    this.paused.set(false);
    this.comparingIds.set([]);
    this.swappingIds.set([]);
    this.sortedIds.set([]);
    this.comparisons.set(0);
    this.swaps.set(0);
    this.currentPass.set(0);
    this.statusMessage.set('Resetat');
  }

  setSpeed(multiplier: number): void {
    this.speedMultiplier.set(multiplier);
  }

  // --- PRESETS & GENERATION ---
  loadPreset(preset: PresetType): void {
    if (this.running()) return;
    this.activePreset.set(preset);

    let values: number[] = [];
    const count = 8;

    switch (preset) {
      case 'reversed':
        values = [90, 78, 65, 52, 40, 31, 20, 12];
        break;
      case 'nearly-sorted':
        values = [15, 26, 34, 58, 45, 67, 82, 94];
        break;
      case 'few-unique':
        values = [30, 75, 30, 90, 75, 30, 90, 75];
        break;
      case 'random':
      default:
        values = Array.from({ length: count }, () => Math.floor(Math.random() * 85) + 12);
        break;
    }

    this.bars.set(
      values.map((val) => ({
        id: this.nextId++,
        value: val,
      }))
    );

    this.comparingIds.set([]);
    this.swappingIds.set([]);
    this.sortedIds.set([]);
    this.comparisons.set(0);
    this.swaps.set(0);
    this.currentPass.set(0);
    this.statusMessage.set(`Generat set: ${preset}`);
  }

  generateArray(): void {
    if (this.running()) return;
    const newValues = Array.from(
      { length: 7 },
      () => Math.floor(Math.random() * 90) + 10
    );

    this.bars.set(
      newValues.map((val) => ({
        id: this.nextId++,
        value: val,
      }))
    );

    this.comparingIds.set([]);
    this.swappingIds.set([]);
    this.sortedIds.set([]);
    this.comparisons.set(0);
    this.swaps.set(0);
    this.currentPass.set(0);
    this.statusMessage.set('Array nou generat');
  }
}
