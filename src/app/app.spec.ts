import { TestBed } from '@angular/core/testing';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Bubble Sort');
  });

  it('should have initial bars', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.bars().length).toBe(6);
    expect(app.bars().map((b) => b.value)).toEqual([50, 30, 80, 20, 60, 10]);
  });

  it('should generate a new array with 7 elements', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    app.generateArray();
    expect(app.bars().length).toBe(7);
  });

  it('should load presets correctly', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.loadPreset('reversed');
    expect(app.activePreset()).toBe('reversed');
    expect(app.bars().length).toBe(8);
    expect(app.bars()[0].value).toBeGreaterThan(app.bars()[7].value);

    app.loadPreset('few-unique');
    expect(app.activePreset()).toBe('few-unique');
    expect(app.bars().length).toBe(8);
  });

  it('should toggle sound on and off', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app.soundEnabled()).toBe(true);

    app.toggleSound();
    expect(app.soundEnabled()).toBe(false);

    app.toggleSound();
    expect(app.soundEnabled()).toBe(true);
  });

  it('should update speed multiplier', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;

    app.setSpeed(2);
    expect(app.speedMultiplier()).toBe(2);

    app.setSpeed(4);
    expect(app.speedMultiplier()).toBe(4);
  });
});
