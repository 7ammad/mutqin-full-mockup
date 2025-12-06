import { test as setup } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/event-manager.json');

setup('authenticate as event manager', async ({ page, context }) => {
  // Navigate to base URL to establish context
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  
  // Initialize MSW
  await page.waitForFunction(() => typeof navigator !== 'undefined' && !!navigator.serviceWorker);
  await page.evaluate(async () => {
    if (navigator.serviceWorker?.ready) {
      await navigator.serviceWorker.ready;
    }
  });
  await page.waitForFunction(() => (window as any).__mswReady === true, { timeout: 10000 });
  await page.evaluate(() => fetch('/api/demo/reset', { method: 'POST' }));
  await page.waitForTimeout(500);

  // Set auth session directly (demo app - no real auth needed)
  // Create session matching what AuthContext expects
  const session = {
    user: {
      id: 'em1',
      email: 'eventmanager@demo.com',
      name: 'Advanced Event Management Co.',
      nameAr: 'شركة إدارة الفعاليات المتقدمة',
      nameEn: 'Advanced Event Management Co.',
      role: 'EVENT_MANAGER',
    },
    role: 'EVENT_MANAGER',
    expiresAt: Date.now() + (7 * 24 * 60 * 60 * 1000), // 7 days
  };
  
  const sessionStr = JSON.stringify(session);
  
  // Set cookie for proxy middleware (server-side)
  const baseURL = process.env.BASE_URL || 'http://localhost:3000';
  await context.addCookies([{
    name: 'auth_session',
    value: sessionStr,
    url: baseURL,
    sameSite: 'Lax',
  }]);
  
  // Set localStorage for client-side AuthContext
  await page.evaluate((session) => {
    localStorage.setItem('auth_session', session);
    // Also set cookie in browser context
    document.cookie = `auth_session=${session}; path=/; max-age=${7 * 24 * 60 * 60}`;
  }, sessionStr);
  
  // Save authenticated state (cookies and localStorage)
  await context.storageState({ path: authFile });
  
  console.log(`[Auth Setup] Saved authenticated state to ${authFile}`);
});

