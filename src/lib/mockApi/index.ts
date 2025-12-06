/**
 * MSW bootstrap - browser only, dev only.
 * Stable initialization with retry logic and proper error handling.
 */

let started = false;
let startPromise: Promise<void> | null = null;
let mswAvailable = false;

// Check if MSW service worker is actually active
async function checkMSWActive(): Promise<boolean> {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return false;
  }

  try {
    const registrations = await navigator.serviceWorker.getRegistrations();
    const mswRegistration = registrations.find(reg => 
      reg.active?.scriptURL?.includes('mockServiceWorker.js')
    );
    return !!mswRegistration?.active;
  } catch {
    return false;
  }
}

export async function startMockApi(): Promise<void> {
  // Return existing promise if already starting
  if (startPromise) return startPromise;
  
  // Return immediately if already started
  if (started) {
    if (typeof window !== 'undefined') {
      (window as Window & { __mswReady?: boolean }).__mswReady = mswAvailable;
    }
    return Promise.resolve();
  }
  
  if (process.env.NODE_ENV !== 'development') {
    if (typeof window !== 'undefined') {
      (window as Window & { __mswReady?: boolean }).__mswReady = true;
    }
    return Promise.resolve();
  }
  
  if (typeof window === 'undefined') {
    return Promise.resolve();
  }

  startPromise = (async () => {
    const maxRetries = 3;
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { worker } = await import('./browser');
        
      await worker.start({
        onUnhandledRequest: 'bypass',
        serviceWorker: {
          url: '/mockServiceWorker.js',
        },
        waitUntilReady: true,
      });
      
        // Wait longer to ensure service worker is fully registered
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify service worker is actually active
        const isActive = await checkMSWActive();
        
        if (isActive) {
          mswAvailable = true;
          started = true;
      
      if (typeof window !== 'undefined') {
        (window as Window & { __mswReady?: boolean }).__mswReady = true;
      }
          
          console.log('[MSW] Started successfully and verified active');
          return;
        } else {
          console.warn(`[MSW] Service worker not active after attempt ${attempt}, retrying...`);
          if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            continue;
          }
        }
    } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        console.warn(`[MSW] Start attempt ${attempt} failed:`, lastError.message);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
          continue;
        }
      }
    }

    // If all retries failed, log but don't block the app
    console.error('[MSW] Failed to start after all retries:', lastError);
    mswAvailable = false;
    started = true; // Mark as started to prevent infinite retries
    
      if (typeof window !== 'undefined') {
      (window as Window & { __mswReady?: boolean }).__mswReady = false;
    }
  })();

  return startPromise;
}

export function isMSWReady(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as Window & { __mswReady?: boolean }).__mswReady;
}

export function isMSWAvailable(): boolean {
  return mswAvailable;
}
