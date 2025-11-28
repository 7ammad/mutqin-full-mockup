import type { DemoState } from './demoSeed';
import { DEMO_STORAGE_KEY, DEMO_STATE_VERSION, seedDemoState } from './demoSeed';

function hasWindow(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function loadState(): DemoState {
  if (!hasWindow()) {
    return seedDemoState();
  }

  try {
    const raw = window.localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) {
      return seedDemoState();
    }
    const parsed = JSON.parse(raw) as DemoState;
    if (!parsed.version || parsed.version !== DEMO_STATE_VERSION) {
      return seedDemoState();
    }
    return parsed;
  } catch {
    return seedDemoState();
  }
}

export function saveState(state: DemoState): void {
  if (!hasWindow()) return;
  try {
    const serialized = JSON.stringify(state);
    window.localStorage.setItem(DEMO_STORAGE_KEY, serialized);
  } catch {
    // ignore persistence errors in demo mode
  }
}

export function clearState(): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(DEMO_STORAGE_KEY);
  } catch {
    // ignore
  }
}
