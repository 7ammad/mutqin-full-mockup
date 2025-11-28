import { seedDemoState, type DemoState } from './demoSeed';
import { loadState, saveState, clearState } from './demoPersistence';

type Listener = (state: DemoState) => void;

let state: DemoState = loadState();
const listeners = new Set<Listener>();
let saveTimeout: ReturnType<typeof setTimeout> | undefined;

function notify() {
  listeners.forEach((listener) => listener(state));
}

function persist(next: DemoState) {
  state = next;
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = setTimeout(() => saveState(state), 10);
  notify();
}

export function getState(): DemoState {
  return state;
}

export function setState(updater: (prev: DemoState) => DemoState): void {
  const next = updater(state);
  persist(next);
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function resetDemo(): void {
  clearState();
  const seeded = seedDemoState();
  persist(seeded);
}
