# Browser Testing Guide for Cursor

This guide shows you how to leverage Cursor's browser MCP tools for comprehensive testing of your landing page and other features.

## Available Browser Tools

### 1. **Navigation & Setup**
- `browser_navigate(url)` - Navigate to any URL
- `browser_resize(width, height)` - Test responsive design
- `browser_navigate_back()` - Go back in history

### 2. **Page Inspection**
- `browser_snapshot()` - Get accessibility tree (best for finding elements)
- `browser_take_screenshot()` - Visual verification
- `browser_console_messages()` - Check for errors/warnings
- `browser_network_requests()` - Monitor API calls and resources

### 3. **Interaction Testing**
- `browser_click(element, ref)` - Click buttons, links, etc.
- `browser_type(element, ref, text)` - Fill forms
- `browser_hover(element, ref)` - Test hover states
- `browser_select_option(element, ref, values)` - Test dropdowns
- `browser_press_key(key)` - Keyboard navigation (ArrowDown, Enter, etc.)

### 4. **Timing & Waiting**
- `browser_wait_for(time)` - Wait for animations/transitions
- `browser_wait_for(text)` - Wait for text to appear
- `browser_wait_for(textGone)` - Wait for text to disappear

## Testing Workflows

### **1. Initial Page Load Test**

```typescript
// Navigate and check console
browser_navigate("http://localhost:3000")
browser_console_messages() // Check for errors
browser_network_requests() // Verify all resources loaded
browser_take_screenshot("initial-load.png")
```

**What to check:**
- No console errors (only warnings are acceptable)
- All network requests return 200 status
- Page renders correctly in screenshot

### **2. i18n Language Toggle Test**

```typescript
// Test Arabic → English
browser_snapshot() // Get current state
browser_click("Language toggle", ref-92123ken3sg)
browser_wait_for("Mutqin") // Wait for English text
browser_snapshot() // Verify language changed
browser_take_screenshot("english-mode.png")

// Test English → Arabic
browser_click("Language toggle", ref-92123ken3sg)
browser_wait_for("متقِن") // Wait for Arabic text
browser_take_screenshot("arabic-mode.png")
```

**What to check:**
- Text changes correctly
- RTL/LTR layout switches properly
- All sections update (hero, nav, footer)

### **3. Navigation & Scroll Test**

```typescript
// Test header navigation links
browser_click("What is Mutqin link", ref-z8omncv7r1a)
browser_wait_for(1) // Wait for smooth scroll
browser_snapshot() // Verify section is visible

// Test scroll behavior
browser_press_key("PageDown")
browser_wait_for(0.5)
browser_take_screenshot("scrolled.png")
```

**What to check:**
- Smooth scrolling to sections
- Header auto-hide on scroll down
- Active section highlighting works

### **4. Interactive Component Test (FAQ Accordion)**

```typescript
// Test FAQ accordion
browser_click("First FAQ question", ref-mxj3aeapcnc)
browser_wait_for(0.5) // Wait for animation
browser_snapshot() // Verify answer is visible

// Test closing
browser_click("First FAQ question", ref-mxj3aeapcnc)
browser_wait_for(0.5)
browser_snapshot() // Verify answer is hidden

// Test multiple FAQs (only one open at a time)
browser_click("Second FAQ question", ref-bfism3xavev)
browser_wait_for(0.5)
browser_snapshot() // Verify first closed, second open
```

**What to check:**
- Smooth open/close animations
- Only one FAQ open at a time
- Content is readable when expanded

### **5. Responsive Design Test**

```typescript
// Test mobile view
browser_resize(375, 667) // iPhone SE size
browser_wait_for(0.5)
browser_take_screenshot("mobile-view.png")

// Test tablet view
browser_resize(768, 1024) // iPad size
browser_wait_for(0.5)
browser_take_screenshot("tablet-view.png")

// Test desktop view
browser_resize(1920, 1080) // Full HD
browser_wait_for(0.5)
browser_take_screenshot("desktop-view.png")
```

**What to check:**
- Layout adapts correctly
- Text is readable at all sizes
- Navigation works on mobile (hamburger menu if applicable)

### **6. Form & CTA Testing**

```typescript
// Test primary CTA button
browser_click("Book a demo button", ref-83vicdsgmgu)
browser_wait_for(1)
browser_snapshot() // Verify navigation to register page

// Test secondary CTA
browser_navigate("http://localhost:3000")
browser_click("Watch overview button", ref-01c2wju0w1nh)
browser_wait_for(1)
browser_snapshot() // Verify scroll or modal behavior
```

**What to check:**
- Buttons navigate correctly
- Loading states work
- Error handling for failed requests

### **7. Theme Toggle Test**

```typescript
// Test dark → light
browser_click("Theme toggle", ref-l8znxxanlb)
browser_wait_for(0.5)
browser_take_screenshot("light-theme.png")

// Test light → dark
browser_click("Theme toggle", ref-l8znxxanlb)
browser_wait_for(0.5)
browser_take_screenshot("dark-theme.png")
```

**What to check:**
- Colors switch correctly
- Text remains readable
- All components respect theme

### **8. Error Detection Test**

```typescript
// Comprehensive error check
browser_navigate("http://localhost:3000")
browser_console_messages() // Check for:
// - Errors (red flags)
// - Warnings (yellow flags - investigate)
// - Deprecation notices

browser_network_requests() // Check for:
// - Failed requests (statusCode !== 200)
// - Slow loading resources
// - Missing assets
```

**Common issues to catch:**
- Empty `src` attributes (like the video source we fixed)
- Hydration mismatches
- Missing i18n keys
- Failed API calls

## Best Practices

### 1. **Always Use Snapshots Before Interactions**
```typescript
browser_snapshot() // Get current state
browser_click(...) // Perform action
browser_snapshot() // Verify change
```

### 2. **Wait for Animations**
```typescript
browser_click(...)
browser_wait_for(0.5) // Wait for smooth animations
browser_snapshot() // Then verify
```

### 3. **Take Screenshots at Key Points**
```typescript
browser_take_screenshot("before-change.png")
// ... make change ...
browser_take_screenshot("after-change.png")
```

### 4. **Test Both Languages**
```typescript
// Always test AR and EN
browser_navigate("http://localhost:3000")
// Test in Arabic
// Switch to English
browser_click("Language toggle", ...)
// Test in English
```

### 5. **Monitor Console Continuously**
```typescript
// Check console before and after changes
browser_console_messages() // Before
// ... make change ...
browser_console_messages() // After - verify no new errors
```

## Example: Complete Landing Page Test

```typescript
// 1. Initial load
browser_navigate("http://localhost:3000")
browser_console_messages()
browser_network_requests()
browser_take_screenshot("01-initial-load.png")

// 2. Test language toggle
browser_click("Language toggle", ref-92123ken3sg)
browser_wait_for(1)
browser_take_screenshot("02-english-mode.png")

// 3. Test navigation
browser_click("What is Mutqin", ref-z8omncv7r1a)
browser_wait_for(1)
browser_take_screenshot("03-navigated-to-section.png")

// 4. Test FAQ
browser_press_key("PageDown") // Scroll to FAQ
browser_wait_for(1)
browser_click("First FAQ", ref-mxj3aeapcnc)
browser_wait_for(0.5)
browser_take_screenshot("04-faq-open.png")

// 5. Test responsive
browser_resize(375, 667)
browser_wait_for(0.5)
browser_take_screenshot("05-mobile-view.png")

// 6. Final error check
browser_console_messages()
browser_network_requests()
```

## Tips for Effective Testing

1. **Use descriptive screenshot names** - Include step numbers and what you're testing
2. **Test in both languages** - i18n bugs are common
3. **Test all breakpoints** - Mobile, tablet, desktop
4. **Check console after every change** - Catch errors early
5. **Test interactions** - Don't just check static rendering
6. **Verify network requests** - Ensure API calls work correctly
7. **Test edge cases** - Empty states, error states, loading states

## Common Issues Found

Based on our testing, here are issues we've caught:

1. ✅ **Empty video src** - Fixed by removing placeholder source
2. ⚠️ **Hydration warnings** - Monitor for SSR/client mismatches
3. ⚠️ **MSW deprecation** - Update mock service worker config
4. ✅ **i18n key errors** - Verify all keys exist in both languages

## Next Steps

- Set up automated browser tests using these tools
- Create test scripts for each major feature
- Integrate with CI/CD pipeline
- Add visual regression testing with screenshots

