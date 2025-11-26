# iOS Design System Implementation
## Liquid Glass & Glassmorphism

**Status:** Active  
**Version:** 1.0  
**Inspired by:** iOS 18+ Liquid Glass Design System  
**Reference:** [Apple Developer Documentation](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)

---

## Overview

This design system implements Apple's official **Liquid Glass** design system (iOS 18+) with:
- **Layered Design** - Background, Middle, and Foreground layers (Apple's approach)
- **System-Handled Effects** - Reflection, refraction, shadow, blur, highlights applied automatically
- **Interactive Responses** - Touch and pointer interactions with fluid reactions
- **Tint Colors** - Color overlays for prominence (Apple's tint system)
- **Smooth Animations** - Spring physics matching iOS behavior
- **Glass Variants** - Regular and Prominent glass styles

---

## Core Components

### 1. LiquidGlassCard

The signature component for glassmorphism effects with interactive 3D tilt.

```tsx
import { LiquidGlassCard } from "@/components/ui/liquid-glass-card";

<LiquidGlassCard
  blurIntensity="xl"
  glowIntensity="md"
  interactive={true}
  borderRadius="24px"
>
  {/* Your content */}
</LiquidGlassCard>
```

**Props:**
- `blurIntensity`: "sm" | "md" | "lg" | "xl" | "2xl" - Backdrop blur strength
- `glowIntensity`: "none" | "sm" | "md" | "lg" | "xl" - Outer glow effect
- `interactive`: boolean - Enable 3D tilt on mouse move (Apple's `interactive()` equivalent)
- `borderRadius`: string - Custom border radius (supports Capsule, Circle, RoundedRectangle shapes)
- `padding`: string - Custom padding (default: "p-6")
- `tint`: string - Tint color for prominence (Apple's tint system)
- `variant`: "regular" | "prominent" - Glass variant (Apple's glass variants)

**Features:**
- ✅ **Layered Structure** - Background, Middle (reflection), Foreground (refraction) layers
- ✅ **3D Tilt Effect** - Interactive mouse tracking (Apple's `interactive()` behavior)
- ✅ **System Effects** - Reflection, refraction, shadow, blur, highlights (simulated)
- ✅ **Tint Support** - Color overlays for prominence
- ✅ **Glass Variants** - Regular and Prominent styles
- ✅ **Smooth Spring Animations** - iOS-like physics

### 2. GlassButton

Buttons with glassmorphism styling and smooth interactions.

```tsx
import { GlassButton } from "@/components/ui/glass-button";

<GlassButton variant="primary" size="default">
  Click Me
</GlassButton>
```

**Variants:**
- `default` - White glass with subtle tint
- `primary` - Primary color glass
- `secondary` - Secondary color glass
- `ghost` - Transparent with hover effect

**Sizes:**
- `sm` - Small (h-9)
- `default` - Default (h-11)
- `lg` - Large (h-14)
- `icon` - Icon button (h-11 w-11)

**Features:**
- ✅ Hover scale and lift effect
- ✅ Tap feedback
- ✅ Shine effect on hover
- ✅ Spring physics animations

---

## Utility Classes

### Glass Morphism

```css
.glass-sm    /* Light blur, subtle glass */
.glass-md    /* Medium blur */
.glass-lg    /* Strong blur */
.glass-xl    /* Very strong blur */
.glass-2xl   /* Maximum blur */
.liquid-glass /* Enhanced blur with saturation */
```

### Glow Effects

```css
.glow-sm     /* Subtle glow */
.glow-md     /* Medium glow */
.glow-lg     /* Strong glow */
.glow-xl     /* Maximum glow */
```

### Border Radius (iOS-like)

```css
.rounded-ios      /* 24px - Standard iOS radius */
.rounded-ios-sm   /* 16px - Small radius */
.rounded-ios-lg   /* 32px - Large radius */
```

### Background Gradients

```css
.bg-glass-gradient      /* Light mode gradient */
.bg-glass-gradient-dark /* Dark mode gradient */
```

---

## Design Tokens

Access design tokens programmatically:

```tsx
import { designTokens, getGlassClasses } from "@/lib/design-system";

// Get glass classes
const glassClass = getGlassClasses("lg", "auto");

// Access tokens
designTokens.blur.xl
designTokens.radius.md
designTokens.animations.spring.medium
```

**Available Tokens:**
- `blur` - Backdrop blur utilities
- `opacity` - Glass opacity levels (light/dark)
- `borders` - Border styles
- `radius` - Border radius values
- `shadows` - Glow and depth shadows
- `animations` - Spring physics configs
- `zIndex` - Layer system

---

## Usage Examples

### Basic Glass Card

```tsx
<div className="liquid-glass rounded-ios p-6">
  <h2>Glass Card</h2>
  <p>Content with glassmorphism effect</p>
</div>
```

### Interactive Glass Card

```tsx
<LiquidGlassCard
  interactive={true}
  blurIntensity="xl"
  glowIntensity="md"
>
  <h2>Interactive Card</h2>
  <p>Tilt follows mouse movement</p>
</LiquidGlassCard>
```

### Glass Button

```tsx
<GlassButton variant="primary" size="lg">
  Get Started
</GlassButton>
```

### Custom Glass Component

```tsx
<div className={getGlassClasses("lg", "auto") + " rounded-ios p-6 glow-md"}>
  Custom glass component
</div>
```

---

## Animation Guidelines

### Spring Physics

Use iOS-like spring animations for natural motion:

```tsx
import { designTokens } from "@/lib/design-system";

<motion.div
  animate={{ scale: 1.1 }}
  transition={designTokens.animations.spring.medium}
>
  Content
</motion.div>
```

**Available Spring Configs:**
- `gentle` - Soft, slow spring (stiffness: 300, damping: 30)
- `medium` - Balanced spring (stiffness: 400, damping: 25)
- `snappy` - Quick, responsive spring (stiffness: 500, damping: 20)

### Hover Effects

```tsx
import { hoverScale } from "@/lib/design-system";

<motion.div
  whileHover={hoverScale.hover}
  whileTap={hoverScale.tap}
>
  Interactive element
</motion.div>
```

---

## Best Practices

### 1. Blur Intensity

- **Cards/Panels**: Use `xl` or `2xl` for strong glass effect
- **Buttons**: Use `md` or `lg` for subtle effect
- **Overlays**: Use `2xl` for maximum blur

### 2. Opacity Levels

- **Light backgrounds**: Use higher opacity (20-30%)
- **Dark backgrounds**: Use lower opacity (5-15%)
- **Auto mode**: Automatically adjusts based on theme

### 3. Interactive Elements

- Enable `interactive` only for cards that benefit from 3D tilt
- Use sparingly to avoid overwhelming the UI
- Works best on larger cards (not buttons)

### 4. Performance

- Backdrop blur can be expensive on low-end devices
- Use `sm` or `md` blur for mobile if needed
- Test on actual devices for performance

### 5. Accessibility

- Ensure sufficient contrast with glass backgrounds
- Test with reduced motion preferences
- Provide fallbacks for browsers without backdrop-filter support

---

## Browser Support

- ✅ Chrome/Edge 76+
- ✅ Safari 9+
- ✅ Firefox 103+
- ⚠️ IE11: No support (use solid backgrounds as fallback)

---

## Migration Guide

### Updating Existing Components

**Before:**
```tsx
<div className="bg-card border rounded-lg p-6">
  Content
</div>
```

**After:**
```tsx
<LiquidGlassCard blurIntensity="lg" borderRadius="24px">
  Content
</LiquidGlassCard>
```

### Updating Buttons

**Before:**
```tsx
<button className="bg-primary text-white rounded-lg px-4 py-2">
  Click
</button>
```

**After:**
```tsx
<GlassButton variant="primary" size="default">
  Click
</GlassButton>
```

---

## Component Roadmap

- [x] LiquidGlassCard
- [x] GlassButton
- [ ] GlassInput
- [ ] GlassModal
- [ ] GlassDropdown
- [ ] GlassNavigation
- [ ] GlassSidebar
- [ ] GlassTable
- [ ] GlassForm

---

## Apple's Official Documentation

This implementation is based on Apple's official Liquid Glass design system:

- **[Adopting Liquid Glass](https://developer.apple.com/documentation/TechnologyOverviews/adopting-liquid-glass)** - Overview and principles
- **[Applying Liquid Glass to Custom Views](https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views)** - Implementation guide
- **[View Styles with Liquid Glass](https://developer.apple.com/documentation/swiftui/view-styles#Styling-views-with-Liquid-Glass)** - API reference
- **[Apple Design Resources](https://developer.apple.com/design/resources/)** - Design assets and grids

See `APPLE_LIQUID_GLASS_REFERENCE.md` for detailed notes from Apple's documentation.

## Additional Resources

- [Apple Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [Framer Motion Spring Physics](https://www.framer.com/motion/transition/)

---

**Last Updated:** 2025  
**Based on:** iOS 18+ Liquid Glass Design System  
**Maintained By:** Design System Team

