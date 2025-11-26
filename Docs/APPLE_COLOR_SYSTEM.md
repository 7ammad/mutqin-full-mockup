# Apple Color System Implementation
## Official Guidelines for Web Implementation

**Source:** Apple Human Interface Guidelines  
**Last Updated:** 2025  
**Reference:** [Apple HIG - Color](https://developer.apple.com/design/human-interface-guidelines/visual-design/color)

---

## Core Principles

### 1. Use Semantic Colors
Apple recommends using **semantic color names** (like `labelColor`, `systemBlue`) rather than fixed RGB values. This ensures colors adapt automatically to light/dark mode.

### 2. Adaptive Colors
Colors should adapt automatically to the underlying interface style. Light and dark interfaces use very different color palettes.

### 3. System Colors
Apple provides a set of system colors designed to work individually and in combination, on both light and dark backgrounds.

---

## Apple System Colors (RGB)

These are Apple's official system colors for iOS/macOS:

```css
/* Apple System Colors */
--apple-red: rgb(255, 59, 48);
--apple-orange: rgb(255, 149, 0);
--apple-yellow: rgb(255, 204, 0);
--apple-green: rgb(76, 217, 100);
--apple-teal-blue: rgb(90, 200, 250);
--apple-blue: rgb(0, 122, 255);
--apple-purple: rgb(88, 86, 214);
--apple-pink: rgb(255, 45, 85);
```

**Usage:** These colors indicate interactivity, impart vitality, and provide visual continuity.

---

## Semantic Color System

Apple uses semantic color names that adapt to light/dark mode:

### Primary Semantic Colors

```css
/* Label Colors (Text) */
--label: /* Primary text color */
--secondary-label: /* Secondary text color */
--tertiary-label: /* Tertiary text color */
--quaternary-label: /* Quaternary text color */

/* Background Colors */
--system-background: /* Primary background */
--secondary-system-background: /* Secondary background */
--tertiary-system-background: /* Tertiary background */

/* Fill Colors */
--system-fill: /* Standard fill */
--secondary-system-fill: /* Secondary fill */
--tertiary-system-fill: /* Tertiary fill */
--quaternary-system-fill: /* Quaternary fill */

/* Separator Colors */
--separator: /* Standard separator */
--opaque-separator: /* Opaque separator */

/* Grouped Background */
--system-grouped-background: /* Grouped background */
--secondary-system-grouped-background: /* Secondary grouped */
--tertiary-system-grouped-background: /* Tertiary grouped */
```

### System Accent Colors

```css
/* System Accent (Adaptive) */
--system-blue: /* Primary accent */
--system-green: /* Success/Positive */
--system-indigo: /* Secondary accent */
--system-orange: /* Warning */
--system-pink: /* Highlight */
--system-purple: /* Tertiary accent */
--system-red: /* Destructive/Error */
--system-teal: /* Information */
--system-yellow: /* Caution */
```

---

## Implementation Strategy

### 1. CSS Variables with Adaptive Values

Define colors that adapt to light/dark mode:

```css
:root {
  /* Light Mode Colors */
  --label: rgb(0, 0, 0);
  --secondary-label: rgb(60, 60, 67);
  --tertiary-label: rgb(60, 60, 67, 0.6);
  --quaternary-label: rgb(60, 60, 67, 0.3);
  
  --system-background: rgb(255, 255, 255);
  --secondary-system-background: rgb(242, 242, 247);
  --tertiary-system-background: rgb(255, 255, 255);
  
  --system-blue: rgb(0, 122, 255);
  --system-green: rgb(52, 199, 89);
  --system-red: rgb(255, 59, 48);
  /* ... */
}

.dark {
  /* Dark Mode Colors */
  --label: rgb(255, 255, 255);
  --secondary-label: rgb(235, 235, 245);
  --tertiary-label: rgba(235, 235, 245, 0.6);
  --quaternary-label: rgba(235, 235, 245, 0.3);
  
  --system-background: rgb(0, 0, 0);
  --secondary-system-background: rgb(28, 28, 30);
  --tertiary-system-background: rgb(44, 44, 46);
  
  --system-blue: rgb(10, 132, 255);
  --system-green: rgb(48, 209, 88);
  --system-red: rgb(255, 69, 58);
  /* ... */
}
```

### 2. OKLCH Color Space (Modern Approach)

For better color consistency and perceptual uniformity, use OKLCH:

```css
:root {
  --label: oklch(0.145 0 0); /* Black */
  --system-blue: oklch(0.55 0.22 264); /* Blue */
  --system-green: oklch(0.7 0.18 145); /* Green */
}

.dark {
  --label: oklch(0.985 0 0); /* White */
  --system-blue: oklch(0.6 0.22 264); /* Lighter blue */
  --system-green: oklch(0.75 0.18 145); /* Lighter green */
}
```

---

## Color Usage Guidelines

### 1. Indicate Interactivity
Choose a **key color** to denote interactivity throughout your app:
- Notes app: Yellow
- Calendar app: Red
- Messages app: Blue

### 2. Maintain Color Harmony
- Ensure colors work well together
- Don't use conflicting colors
- Use coordinating sets (e.g., all pastels)

### 3. Accessibility
- Test under various lighting conditions
- Ensure sufficient contrast ratios (WCAG AA minimum)
- Support high contrast mode

### 4. Wide Color Support
- Default: sRGB color space
- Enhanced: P3 color space for vivid imagery
- Use 16-bit PNG with Display P3 profile for best results

---

## Best Practices

1. **Use Semantic Names**: `--label` not `--black-text`
2. **Adaptive by Default**: All colors should have light/dark variants
3. **System Colors First**: Use system colors before custom ones
4. **Test Both Modes**: Always preview in light and dark
5. **High Contrast**: Support high contrast accessibility mode

---

## Implementation Checklist

- [x] Define semantic color variables
- [x] Create light/dark mode variants
- [x] Include Apple system colors
- [x] Use OKLCH for perceptual uniformity
- [x] Support high contrast mode
- [x] Document color usage guidelines

---

## Resources

- [Apple HIG - Color](https://developer.apple.com/design/human-interface-guidelines/visual-design/color)
- [Supporting Dark Mode](https://developer.apple.com/documentation/uikit/supporting-dark-mode-in-your-interface)
- [Specifying Color Scheme](https://developer.apple.com/documentation/xcode/specifying-your-apps-color-scheme)

---

**Note:** This implementation translates Apple's native color system to web/CSS while maintaining the same principles and visual consistency.

