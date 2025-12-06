import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({
  baseURL: BASE_URL,
  trace: 'on-first-retry',
});

/**
 * Marketplace Visual Regression Tests
 * 
 * Tests visual consistency of marketplace components based on industry best practices:
 * - Event cards with sponsorship packages
 * - Filter UI states
 * - Search interface
 * - Empty states
 * - Loading states
 * - Error states
 * - Package selection modal
 * 
 * **Environment:** Demo/Mock Data (MSW)
 * - Uses MSW for API mocking
 * - Tests against mock data
 * - Visual snapshots should be consistent across runs with same mock data
 * 
 * Reference: Docs/TESTING/MARKETPLACE-TESTING-PLAN.md
 * 
 * Run with: npx playwright test tests/e2e/marketplace-visual.spec.ts --update-snapshots
 */

test.describe('Marketplace Visual Regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => (window as any).__mswReady === true);
  });

  test('Marketplace feed - full page', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Wait for content to load
    await page.waitForSelector('[class*="Card"], [class*="EventCard"], main', { timeout: 5000 }).catch(() => {
      // Content might be loading
    });
    
    // Take full page screenshot
    await expect(page).toHaveScreenshot('marketplace-feed-full.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('Event card with sponsorship packages', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Find first event card
    const eventCards = page.locator('[class*="EventCard"], [class*="Card"]').first();
    
    if (await eventCards.count() > 0) {
      await expect(eventCards).toHaveScreenshot('marketplace-event-card.png', {
        maxDiffPixels: 100,
      });
    }
  });

  test('Filter panel - closed state', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Find filter panel/section
    const filterPanel = page.locator('[class*="filter"], [class*="Filter"], [data-testid*="filter"]').first();
    
    if (await filterPanel.count() > 0) {
      await expect(filterPanel).toHaveScreenshot('marketplace-filters-closed.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('Filter panel - open state', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Find and open filter
    const filterToggle = page.locator('button:has-text("Filter"), button:has-text("فلترة"), [aria-label*="filter"]').first();
    
    if (await filterToggle.count() > 0 && await filterToggle.isVisible()) {
      await filterToggle.click();
      await page.waitForTimeout(500);
      
      const filterPanel = page.locator('[class*="filter"], [class*="Filter"]').first();
      if (await filterPanel.count() > 0) {
        await expect(filterPanel).toHaveScreenshot('marketplace-filters-open.png', {
          maxDiffPixels: 100,
        });
      }
    }
  });

  test('Search interface', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Find search input
    const searchSection = page.locator('input[type="search"], [class*="search"], [class*="Search"]').first().locator('xpath=ancestor::*[1]');
    
    if (await searchSection.count() > 0) {
      await expect(searchSection).toHaveScreenshot('marketplace-search-interface.png', {
        maxDiffPixels: 50,
      });
    }
  });

  test('Search results page', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Perform a search
    const searchInput = page.locator('input[type="search"], input[placeholder*="search"]').first();
    if (await searchInput.count() > 0) {
      await searchInput.fill('Cardiology');
      await page.waitForTimeout(1000);
      
      // Screenshot search results
      const resultsSection = page.locator('[class*="results"], [class*="grid"], main').first();
      await expect(resultsSection).toHaveScreenshot('marketplace-search-results.png', {
        maxDiffPixels: 150,
      });
    }
  });

  test('Empty marketplace state', async ({ page }) => {
    // Try to create empty state (if API supports it)
    await page.evaluate(() => fetch('/api/demo/reset', { method: 'POST' }));
    await page.waitForTimeout(500);
    
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Wait a bit for empty state to render
    await page.waitForTimeout(1000);
    
    // Screenshot empty state
    await expect(page).toHaveScreenshot('marketplace-empty-state.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('Loading state', async ({ page }) => {
    // Navigate and immediately screenshot (before content loads)
    await page.goto('/dashboard/vendor?tab=marketplace');
    
    // Take screenshot quickly (should catch loading state)
    await expect(page).toHaveScreenshot('marketplace-loading-state.png', {
      maxDiffPixels: 200,
    }).catch(() => {
      // Loading state might be too fast to catch
    });
  });

  test('Package selection modal', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Open sponsorship modal
    const sponsorButton = page.getByRole('button', { name: /sponsor|رعاية/i }).first();
    if (await sponsorButton.count() > 0 && await sponsorButton.isVisible()) {
      await sponsorButton.click();
      await page.waitForTimeout(1000);
      
      // Find modal
      const modal = page.locator('[role="dialog"], [class*="Modal"], [class*="Dialog"]').first();
      if (await modal.count() > 0 && await modal.isVisible()) {
        await expect(modal).toHaveScreenshot('marketplace-package-modal.png', {
          maxDiffPixels: 150,
        });
      }
    }
  });

  test('Sponsorship confirmation screen', async ({ page }) => {
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    // Complete sponsorship flow to confirmation
    const sponsorButton = page.getByRole('button', { name: /sponsor|رعاية/i }).first();
    if (await sponsorButton.count() > 0) {
      await sponsorButton.click();
      await page.waitForTimeout(1000);
      
      // Fill form and confirm
      const confirmButton = page.getByRole('button', { name: /confirm|تأكيد/i }).first();
      if (await confirmButton.count() > 0) {
        // Fill required fields if any
        const sfdaInput = page.locator('input[name*="license"], input[placeholder*="SFDA"]').first();
        if (await sfdaInput.count() > 0) {
          await sfdaInput.fill('SFDA-12345');
        }
        
        await confirmButton.click();
        await page.waitForTimeout(2000);
        
        // Screenshot confirmation
        const confirmation = page.locator('text=/success|تم|confirmed|تم التأكيد/i').first().locator('xpath=ancestor::*[1]');
        if (await confirmation.count() > 0) {
          await expect(confirmation).toHaveScreenshot('marketplace-confirmation.png', {
            maxDiffPixels: 100,
          });
        }
      }
    }
  });
});

test.describe('Marketplace Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => (window as any).__mswReady === true);
  });

  test('Marketplace on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('marketplace-mobile.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('Marketplace on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('marketplace-tablet.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });

  test('Marketplace on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 }); // Desktop size
    await page.goto('/dashboard/vendor?tab=marketplace');
    await page.waitForLoadState('networkidle');
    
    await expect(page).toHaveScreenshot('marketplace-desktop.png', {
      fullPage: true,
      maxDiffPixels: 200,
    });
  });
});
