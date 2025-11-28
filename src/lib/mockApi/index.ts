/**
 * MSW bootstrap - browser only, dev only.
 */

let started = false;

export async function startMockApi(): Promise<void> {
  if (started) return;
  if (process.env.NODE_ENV !== 'development') return;
  if (typeof window === 'undefined') return;

  const { worker } = await import('./browser');
  await worker.start({
    onUnhandledRequest: 'bypass',
  });
  started = true;
}
