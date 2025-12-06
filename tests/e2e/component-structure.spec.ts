import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

test.use({
  baseURL: BASE_URL,
  trace: 'on-first-retry',
});

/**
 * Component Structure Validation Tests
 * 
 * These tests validate component structure, layout, and design system compliance.
 * Based on best practices from React Testing Library, Playwright, and visual regression testing.
 * 
 * Reference: Docs/IOS_DESIGN_SYSTEM.md, Docs/TEST-PLAN.md
 */

test.describe('HCP Dashboard - Component Structure', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => (window as any).__mswReady === true);
  });

  test('HCP Registrations tab - no nested cards', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=registrations');
    await page.waitForLoadState('networkidle');

    // Get all LiquidGlassCard elements
    const liquidGlassCards = page.locator('[class*="LiquidGlassCard"], [data-testid*="liquid-glass-card"]');
    const cardCount = await liquidGlassCards.count();

    // For each card, check that it doesn't contain another LiquidGlassCard
    for (let i = 0; i < cardCount; i++) {
      const card = liquidGlassCards.nth(i);
      
      // Check if this card contains another LiquidGlassCard (nested cards)
      const nestedCards = card.locator('[class*="LiquidGlassCard"], [data-testid*="liquid-glass-card"]');
      const nestedCount = await nestedCards.count();
      
      // Also check for Card components nested inside
      const nestedCardComponents = card.locator('[class*="Card"][class*="glass"], [data-testid*="card"]');
      const nestedCardCount = await nestedCardComponents.count();
      
      if (nestedCount > 0 || nestedCardCount > 0) {
        // Get the card's HTML for debugging
        const cardHTML = await card.innerHTML();
        throw new Error(
          `Nested cards detected in HCP registrations tab. ` +
          `Card ${i} contains ${nestedCount} LiquidGlassCard(s) and ${nestedCardCount} Card component(s). ` +
          `This violates the design system - cards should not be nested. ` +
          `Card HTML preview: ${cardHTML.substring(0, 200)}...`
        );
      }
    }
  });

  test('HCP Registrations tab - proper spacing and layout', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=registrations');
    await page.waitForLoadState('networkidle');

    // Check grid layout exists
    const grid = page.locator('[class*="grid"]').first();
    await expect(grid).toBeVisible();

    // Check grid has proper gap spacing
    const gridGap = await grid.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.gap || styles.gridGap;
    });
    
    // Gap should be at least 1rem (16px) for proper spacing
    const gapValue = parseInt(gridGap);
    if (gapValue < 16) {
      throw new Error(
        `Grid gap is too small: ${gridGap}. ` +
        `Minimum recommended gap is 1rem (16px) for proper spacing.`
      );
    }

    // Check that ticket cards have proper padding
    const ticketCards = page.locator('[class*="LiquidGlassCard"]');
    const firstCard = ticketCards.first();
    
    if (await firstCard.count() > 0) {
      const padding = await firstCard.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return {
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom,
          paddingLeft: styles.paddingLeft,
          paddingRight: styles.paddingRight,
        };
      });

      const minPadding = 16; // 1rem
      const paddingValues = Object.values(padding).map(p => parseInt(p));
      const minPaddingValue = Math.min(...paddingValues);

      if (minPaddingValue < minPadding) {
        throw new Error(
          `Card padding is too small: minimum is ${minPadding}px, found ${minPaddingValue}px. ` +
          `Padding values: ${JSON.stringify(padding)}`
        );
      }
    }
  });

  test('HCP Registrations tab - QR code structure', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=registrations');
    await page.waitForLoadState('networkidle');

    // Check that QR codes are not wrapped in their own cards when inside ticket cards
    const ticketCards = page.locator('[class*="LiquidGlassCard"]');
    const cardCount = await ticketCards.count();

    for (let i = 0; i < cardCount; i++) {
      const card = ticketCards.nth(i);
      
      // Find QR code canvas elements
      const qrCanvases = card.locator('canvas');
      const qrCount = await qrCanvases.count();

      if (qrCount > 0) {
        // Check that QR code is not wrapped in another LiquidGlassCard
        const qrParent = qrCanvases.first().locator('xpath=ancestor::*[contains(@class, "LiquidGlassCard")]');
        const qrParentCount = await qrParent.count();
        
        // QR code should be directly in the ticket card, not in a nested card
        // (We allow one level - the ticket card itself)
        if (qrParentCount > 1) {
          throw new Error(
            `QR code is wrapped in nested cards. ` +
            `QR code should be directly in the ticket card, not in a nested LiquidGlassCard.`
          );
        }
      }
    }
  });

  test('HCP Registrations tab - button layout', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=registrations');
    await page.waitForLoadState('networkidle');

    // Check that action buttons are properly laid out
    const viewTicketButtons = page.getByRole('button', { name: /view ticket|عرض التذكرة/i });
    const viewEventButtons = page.getByRole('button', { name: /view event|عرض الحدث/i });

    const ticketButtonCount = await viewTicketButtons.count();
    const eventButtonCount = await viewEventButtons.count();

    // If buttons exist, they should be in a flex container with proper gap
    if (ticketButtonCount > 0) {
      const firstButton = viewTicketButtons.first();
      const buttonContainer = firstButton.locator('xpath=ancestor::*[contains(@class, "flex")]').first();
      
      if (await buttonContainer.count() > 0) {
        const gap = await buttonContainer.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.gap;
        });

        const gapValue = parseInt(gap);
        if (gapValue < 8) {
          throw new Error(
            `Button container gap is too small: ${gap}. ` +
            `Minimum recommended gap is 0.5rem (8px) for proper button spacing.`
          );
        }
      }
    }
  });
});

test.describe('Component Structure - All Personas', () => {
  const personas = [
    { name: 'HCP', baseUrl: '/dashboard/hcp' },
    { name: 'Organizer', baseUrl: '/dashboard/organizer' },
    { name: 'Event Manager', baseUrl: '/dashboard/event-manager' },
    { name: 'Vendor', baseUrl: '/dashboard/vendor' },
    { name: 'Regulator', baseUrl: '/dashboard/regulator' },
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => (window as any).__mswReady === true);
  });

  for (const persona of personas) {
    test(`${persona.name} - no excessive card nesting`, async ({ page }) => {
      await page.goto(persona.baseUrl);
      await page.waitForLoadState('networkidle');

      // Get all cards
      const allCards = page.locator('[class*="Card"], [class*="LiquidGlassCard"]');
      const cardCount = await allCards.count();

      // Check for deeply nested cards (more than 2 levels)
      for (let i = 0; i < cardCount; i++) {
        const card = allCards.nth(i);
        
        // Count nesting depth
        const nestedCards = card.locator('[class*="Card"], [class*="LiquidGlassCard"]');
        const nestedCount = await nestedCards.count();
        
        // If a card contains more than 2 nested cards, it's likely a problem
        if (nestedCount > 2) {
          const cardHTML = await card.innerHTML();
          throw new Error(
            `Excessive card nesting detected in ${persona.name} dashboard. ` +
            `Card contains ${nestedCount} nested cards. ` +
            `Maximum recommended nesting is 2 levels. ` +
            `Card HTML preview: ${cardHTML.substring(0, 200)}...`
          );
        }
      }
    });

    test(`${persona.name} - proper spacing between elements`, async ({ page }) => {
      await page.goto(persona.baseUrl);
      await page.waitForLoadState('networkidle');

      // Check main content area has proper spacing
      const mainContent = page.locator('main, [role="main"], [class*="container"]').first();
      
      if (await mainContent.count() > 0) {
        const padding = await mainContent.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return {
            paddingTop: parseInt(styles.paddingTop),
            paddingBottom: parseInt(styles.paddingBottom),
          };
        });

        const minPadding = 24; // 1.5rem
        if (padding.paddingTop < minPadding || padding.paddingBottom < minPadding) {
          throw new Error(
            `${persona.name} dashboard main content padding is too small. ` +
            `Minimum recommended: ${minPadding}px, found: top=${padding.paddingTop}px, bottom=${padding.paddingBottom}px`
          );
        }
      }
    });
  }
});

test.describe('Design System Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.waitForFunction(() => (window as any).__mswReady === true);
  });

  test('No raw Tailwind colors in HCP dashboard', async ({ page }) => {
    await page.goto('/dashboard/hcp');
    await page.waitForLoadState('networkidle');

    // Get all elements and check for raw Tailwind color classes
    const allElements = page.locator('*');
    const rawColorClasses = [
      'bg-red-', 'bg-blue-', 'bg-green-', 'bg-yellow-', 'bg-purple-',
      'text-red-', 'text-blue-', 'text-green-', 'text-yellow-', 'text-purple-',
      'border-red-', 'border-blue-', 'border-green-', 'border-yellow-', 'border-purple-',
    ];

    for (const colorClass of rawColorClasses) {
      const elements = page.locator(`[class*="${colorClass}"]`);
      const count = await elements.count();
      
      if (count > 0) {
        // Get first element for debugging
        const firstElement = elements.first();
        const className = await firstElement.getAttribute('class');
        
        throw new Error(
          `Raw Tailwind color class detected: ${colorClass}. ` +
          `Found ${count} element(s) using raw colors. ` +
          `Use design system tokens (CSS variables) instead. ` +
          `Example element class: ${className}`
        );
      }
    }
  });

  test('All cards use design system components', async ({ page }) => {
    await page.goto('/dashboard/hcp?tab=registrations');
    await page.waitForLoadState('networkidle');

    // Check that cards use LiquidGlassCard or Card components
    // (not raw divs with card-like styling)
    const allDivs = page.locator('div[class*="rounded"], div[class*="border"], div[class*="shadow"]');
    const divCount = await allDivs.count();

    // Check if any divs look like cards but aren't using Card components
    for (let i = 0; i < Math.min(divCount, 10); i++) {
      const div = allDivs.nth(i);
      const className = await div.getAttribute('class');
      
      // If a div has card-like styling but doesn't use Card or LiquidGlassCard, it's a problem
      const hasCardStyling = className?.includes('rounded') && 
                            (className?.includes('border') || className?.includes('shadow'));
      const usesCardComponent = className?.includes('Card') || className?.includes('LiquidGlassCard');
      
      if (hasCardStyling && !usesCardComponent) {
        throw new Error(
          `Card-like div detected without using Card component. ` +
          `Use LiquidGlassCard or Card component instead of raw divs. ` +
          `Element class: ${className}`
        );
      }
    }
  });
});

