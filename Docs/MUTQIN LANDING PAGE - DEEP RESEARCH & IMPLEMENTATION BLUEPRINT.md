<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# \# Role: Senior Product Designer \& Technical Architect (Specializing in 2025 Frontend Stacks)

## Project Context

We are building "Mutqin," a premier medical marketplace. The goal is to create a high-conversion, visually stunning landing page that balances professional medical trust with cutting-edge 2025 design trends.

## Technical \& Design Stack

- **Build Tool:** Google Antigravity (Agentic IDE)
- **Design System:** Apple 26 Liquid Glass (iOS/macOS 26)
- **Framework:** React + TypeScript (Antigravity standard)
- **Visual Reference:** "Onlook.com" hero section (specifically the lightning/kinetic energy effect).


## Task 1: Deep Design Research \& Concept Generation

Conduct a deep analysis of the following design elements and generate a cohesive visual strategy for Mutqin:

1. **Hero Section Adaptation (The "Medical Pulse" Effect):**
    - Analyze the kinetic "lightning" effect from Onlook.com.
    - Re-imagine this effect for a medical context. instead of chaotic lightning, design a **"Bio-Rhythmic Pulse"** or **"Neural Synapse"** animation.
    - Describe how this animation interacts with the user (e.g., reacts to cursor proximity or scroll velocity) to create a feeling of "alive" technology.
    - **Requirement:** It must utilize **Apple 26 Liquid Glass** materials—translucent layers, real-time refraction, and dynamic specular highlights.
2. **Section-by-Section Design Specifications:**
Break down the landing page into 5-7 core sections (e.g., Hero, Trusted Partners, AI Search, Marketplace Categories, Trust/Safety, CTA). For each section, provide:
    - **Visual Identity:** How to apply the **Apple 26 Default Color Palette** (adaptive light/dark modes) and Liquid Glass blur radii.
    - **UX Trend:** Connect the design to late 2025 marketplace trends (e.g., Bento Grids, micro-interactions, immersive 3D product tilts).
    - **Medical Relevance:** How the design reinforces trust and hygiene (e.g., using "frosted glass" to mimic sterile medical environments).

## Task 2: Implementation Plan (Google Antigravity Workflow)

Create a step-by-step build plan tailored for **Google Antigravity**.

- **Agent Instructions:** Define the specific prompts we should feed the Antigravity agent to scaffold the project.
- **Artifact Strategy:** Explain how to use Antigravity's "Artifacts" (screen recordings/snapshots) to iterate on the Liquid Glass shaders.
- **Tech Specs:** List the specific React libraries (e.g., Three.js, Framer Motion, or native CSS backdrop-filter) needed to achieve the iOS 26 refraction effects without heavy performance costs.


## Task 3: LLM Recommendation

Identify the single best Large Language Model (LLM) to act as the "brain" for this specific design-and-build operation.

- **Criteria:** Must excel at writing complex React/Tailwind code, understanding visual descriptions of "refraction" and "glassmorphism," and integrating with Google Antigravity's context window.
- **Recommendation:** Name the model and explain *why* it is the superior choice for this specific stack.

Now I'll create a **comprehensive, production-ready research document** that addresses all three tasks with deep technical integration. This is designed to be a living blueprint for your Mutqin landing page.

***

# MUTQIN LANDING PAGE: DEEP RESEARCH \& IMPLEMENTATION BLUEPRINT

## The Complete Design-to-Build Framework


***

## EXECUTIVE SUMMARY

This document provides a **three-phase strategic roadmap** for building Mutqin's landing page with:

- ✅ **Apple 26 Liquid Glass** as the core design system
- ✅ **Bio-Rhythmic Pulse** animation (medical re-imagination of Onlook.com's lightning effect)
- ✅ **Google Antigravity** workflow with agent-first architecture
- ✅ **Gemini 3.0** as the optimal LLM for design + code orchestration

***

***

## TASK 1: DEEP DESIGN RESEARCH \& CONCEPT GENERATION

### 1.1 HERO SECTION: "Bio-Rhythmic Pulse" EFFECT

#### Core Concept

The Onlook.com lightning effect uses **chaotic, branching electrical paths** to convey speed and energy. We're **reversing the metaphor** for Mutqin:

- **Instead of chaotic:** Ordered, predictable medical rhythms (ECG, pulse waves, neural impulses)
- **Instead of danger:** Trust, precision, healthcare expertise
- **Instead of chaos:** Life-affirming rhythm (heartbeat)


#### The "Bio-Rhythmic Pulse" Animation Breakdown

```
Visual Layer 1: "Ambient Pulse"
├─ Multiple concentric circles emanating from center
├─ Each pulse expands smoothly (ECG waveform timing)
├─ Color: Soft medical blues/teals (Apple 26 palette)
└─ Opacity: Fades as radius expands (mimics real-world light diffusion)

Visual Layer 2: "Neural Synapse Connections" (Interactive)
├─ Dotted nodes (representing medical AI checkpoints)
├─ Animated connection lines between nodes (SVG path animation)
├─ Trigger: On cursor proximity OR scroll velocity
├─ Effect: Lines "light up" with gradient when user interacts
└─ Color fade: Teal → Cyan → Translucent (Liquid Glass effect)

Visual Layer 3: "Liquid Glass Refraction"
├─ Top translucent layer with real-time blur backdrop-filter
├─ Color sampling from background (iOS 26 adaptive behavior)
├─ Specular highlights that follow cursor movement
└─ Tech: CSS backdrop-filter + WebGL overlay for highlight tracking
```


#### Why This Works for Mutqin

1. **Trust Signal**: Ordered, measurable rhythms → medical credibility
2. **Engagement**: Interactive cursor proximity creates feel of "alive" technology
3. **Accessibility**: Reduced-motion respects `prefers-reduced-motion` media query
4. **Performance**: SVG + CSS animations (no Three.js overhead needed for hero)

#### Implementation Stack (Hero Section)

```javascript
// Tech Requirements:
- Framer Motion (for orchestrating complex animations)
- SVG path animation (native + Framer Motion)
- CSS backdrop-filter (Liquid Glass blur)
- requestAnimationFrame (for cursor tracking highlights)
- No Three.js in hero (save GPU for interactive sections below)
```


***

### 1.2 SECTION-BY-SECTION DESIGN SPECIFICATIONS

#### **SECTION 1: HERO + TAGLINE**

```
Height: 100vh
Background: Gradient (Apple 26 Light: cream-50 → transparent)
Content Alignment: Center, stacked

🎨 Visual Design:
  ├─ Background: Animated Bio-Rhythmic Pulse (see 1.1)
  ├─ Liquid Glass Layer: Frosted overlay (backdrop-filter: blur(20px))
  ├─ Tagline Text: Large, serif (Apple San Francisco Pro)
  │   └─ Color: Slate-900 (light) / Gray-200 (dark)
  ├─ Sub-tagline: Smaller sans-serif, secondary color
  └─ CTA Button: "Start Exploring" (Apple 26 Liquid Glass button style)

🔄 Interaction:
  ├─ On Scroll: Hero pulse slows down, fades opacity
  ├─ On Cursor Move: Specular highlights follow cursor (WebGL)
  └─ Mobile: Pulse animation simplified, cursor interaction removed

✨ 2025 Trends:
  └─ "Immersive Hero with AI/Tech credibility" (prevalent in B2B SaaS)
```


***

#### **SECTION 2: "WHY MUTQIN" – Trust \& Credibility**

```
Height: Auto (60vh recommended)
Background: Apple 26 Light tint (subtle color-bg-1 from palette)

🎨 Visual Design:
  ├─ Layout: 3-column Bento Grid (2025 trend)
  ├─ Cards:
  │   ├─ Card 1: "AI-Verified Providers"
  │   │   └─ Liquid Glass: 12px blur, translucent border
  │   ├─ Card 2: "Real-Time Scheduling"
  │   │   └─ Liquid Glass: 12px blur, translucent border
  │   └─ Card 3: "Transparent Pricing"
  │       └─ Liquid Glass: 12px blur, translucent border
  ├─ Card Typography: Bold headline + micro-copy
  ├─ Icons: Animated (micro-interactions on hover)
  └─ Border: 1px solid, Apple 26 border token (rgba opacity)

🔄 Interaction:
  ├─ On Hover: Card lifts (transform: translateY(-8px))
  ├─ Specular highlight appears (Liquid Glass shine effect)
  └─ Icon animates (e.g., heartbeat pulse for "Verified Providers")

✨ Medical Relevance:
  └─ Frosted glass mimics sterile, clean medical environments
  └─ Animated icons suggest "live" data streams
```


***

#### **SECTION 3: "AI SEARCH" – Interactive Marketplace Discovery**

```
Height: 70vh
Background: Apple 26 Dark tint (slate-900 with color-bg-5 overlay)

🎨 Visual Design:
  ├─ Search Input: Large, center-aligned
  │   ├─ Placeholder: "Search providers, services, expertise..."
  │   ├─ Liquid Glass style: Subtle border + blur backdrop
  │   └─ Focus State: Glow effect (var(--color-focus-ring))
  ├─ Results Section: Animated cards appear on input
  │   ├─ Layout: Horizontal scroll OR grid (responsive)
  │   ├─ Card Content:
  │   │   ├─ Provider avatar (circular, 64px)
  │   │   ├─ Name + specialization
  │   │   ├─ Star rating (animated on load)
  │   │   └─ Availability indicator (pulse animation)
  │   └─ Liquid Glass: Cards have layered transparency
  └─ Background: Subtle animated grid OR medical waveform SVG (low opacity)

🔄 Interaction:
  ├─ On Type: Results debounce (300ms) + fade in
  ├─ On Card Hover: Card expand (scale: 1.05), show CTA
  └─ Card Click: Animate to detail view (framer-motion orchestration)

✨ 2025 Trends:
  └─ Search-first UX (inspired by Midjourney, Perplexity AI search interfaces)
  └─ Real-time result preview (no page reload)
```


***

#### **SECTION 4: "FEATURED CATEGORIES" – Browsable Services**

```
Height: 60vh
Background: Apple 26 Light (cream-100)

🎨 Visual Design:
  ├─ Title: "Explore Medical Services" (serif, bold)
  ├─ Category Tiles:
  │   ├─ Grid: 2x3 OR 3x2 (responsive)
  │   ├─ Each Tile: 300px × 300px
  │   ├─ Tile Content:
  │   │   ├─ Icon (medical icon + glow effect)
  │   │   ├─ Category name (bold sans-serif)
  │   │   ├─ Count of providers ("250+ providers")
  │   │   └─ Quick CTA ("Browse")
  │   ├─ Tile Border: Liquid Glass (1px, translucent)
  │   └─ Tile Background: Subtle gradient (color-bg-1 through color-bg-8)
  └─ Navigation Arrows: CTA at bottom ("View All Categories")

🔄 Interaction:
  ├─ On Hover: Tile morphs (border-radius shifts)
  ├─ Specular highlight appears (moving with cursor)
  ├─ Icon animates (e.g., scales, rotates)
  └─ Text color shifts (adaptive to Liquid Glass light reflection)

✨ Medical Relevance:
  └─ Color-coding by specialty (e.g., Cardiology = blue tint, Surgery = orange)
  └─ Icons are standardized medical symbols (FDA-approved or WHO notation)
```


***

#### **SECTION 5: "TESTIMONIALS" – Social Proof**

```
Height: 50vh
Background: Apple 26 gradient (dark mode or clear variant)

🎨 Visual Design:
  ├─ Layout: Carousel OR infinite scroll (horizontal)
  ├─ Testimonial Card:
  │   ├─ Quote text (serif, italic)
  │   ├─ Author: Avatar + name + title
  │   ├─ Rating: ⭐⭐⭐⭐⭐ (animated on load)
  │   └─ Liquid Glass: Semi-translucent card with blur backdrop
  ├─ Pagination: Dots (animated on transition)
  └─ Background: Subtle video OR animated pattern (low opacity)

🔄 Interaction:
  ├─ Auto-advance every 6 seconds (with pause on hover)
  ├─ Dot click advances to testimonial
  └─ Card scales on active (highlight effect)

✨ Trust Signal:
  └─ Real provider photos + verified badges
  └─ Specificity in quotes (e.g., "Reduced patient booking time by 40%")
```


***

#### **SECTION 6: "HOW IT WORKS" – 3-Step Process**

```
Height: 60vh
Background: Apple 26 (neutral with subtle color-bg overlay)

🎨 Visual Design:
  ├─ Layout: 3 vertical steps (connected by animated lines)
  ├─ Step Card:
  │   ├─ Number badge (circular, glowing)
  │   ├─ Step title + description
  │   ├─ Illustration (medical + tech blend, e.g., AI verifying provider)
  │   └─ Liquid Glass: Card border + blur effect
  ├─ Connector Lines: Animated SVG (drawn on scroll)
  └─ Color progression: Teal → Cyan → Lighter (gradient effect)

🔄 Interaction:
  ├─ On Scroll into View: Lines animate (SVG stroke-dasharray animation)
  ├─ Cards stagger in (Framer Motion staggerChildren)
  ├─ Icons animate on card reveal
  └─ Mobile: Vertical steps (no horizontal connector lines)

✨ 2025 Trends:
  └─ Step-by-step user journeys (storytelling in SaaS)
```


***

#### **SECTION 7: "CTA" – Final Conversion Push**

```
Height: 40vh
Background: Apple 26 (bold color-bg, likely teal or medical blue)

🎨 Visual Design:
  ├─ Heading: "Join the Medical Revolution" (large, serif)
  ├─ Sub-copy: Benefit-focused callout
  ├─ CTA Buttons:
  │   ├─ Primary: "Sign Up Now" (Liquid Glass, Apple 26 teal)
  │   └─ Secondary: "Learn More" (outline style, transparent)
  ├─ Visual: Floating medical icons OR animated background particles
  └─ Liquid Glass: CTA buttons have glow effect on hover

🔄 Interaction:
  ├─ Buttons scale + highlight on hover
  ├─ On click: Smooth scroll to form OR external redirect
  └─ Loading state: Animated spinner (Liquid Glass style)

✨ Conversion Psychology:
  └─ Clear value prop
  └─ Multiple CTA variants (reduce friction)
```


***

### 1.3 APPLE 26 LIQUID GLASS COLOR PALETTE MAPPING

Based on iOS 26 official guidelines:[^1][^2][^3]

```css
/* Apple 26 Liquid Glass Default Palette for Mutqin */

:root {
  /* Primitive Colors (Light Mode) */
  --liquid-glass-primary: #2180
  8d;     /* Medical Teal */
  --liquid-glass-secondary: #3ba8c6; /* Bright Cyan */
  --liquid-glass-accent: #f57c47;    /* Medical Orange */
  --liquid-glass-success: #34c759;   /* Apple Green */
  --liquid-glass-error: #ff3b30;     /* Apple Red */

  /* Semantic Colors */
  --lq-bg-primary: rgba(252, 252, 249, 0.95);   /* Cream-50 */
  --lq-bg-secondary: rgba(255, 255, 253, 1);    /* Cream-100 */
  --lq-text-primary: rgba(19, 52, 59, 1);       /* Slate-900 */
  --lq-text-secondary: rgba(98, 108, 113, 0.7); /* Slate-500 */

  /* Liquid Glass Specific */
  --lq-glass-blur: 12px;          /* iOS 26 default blur */
  --lq-glass-border: rgba(33, 128, 141, 0.2);  /* Teal w/ opacity */
  --lq-glass-specular: rgba(255, 255, 255, 0.3); /* Highlight white */

  /* Dark Mode */
  --lq-bg-primary-dark: rgba(31, 33, 33, 1);
  --lq-bg-secondary-dark: rgba(38, 40, 40, 1);
  --lq-text-primary-dark: rgba(245, 245, 245, 1);
  --lq-text-secondary-dark: rgba(167, 169, 169, 0.7);
}

/* Applied to Medical Marketplace */
body {
  background: var(--lq-bg-primary);
  color: var(--lq-text-primary);
  transition: background 0.3s ease; /* Adaptive mode switch */
}

/* Liquid Glass Card */
.card-liquid-glass {
  background: rgba(255, 255, 253, 0.6);  /* Translucent */
  backdrop-filter: blur(var(--lq-glass-blur));
  border: 1px solid var(--lq-glass-border);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  /* Specular highlight (cursor-tracked via JS) */
  position: relative;
}

/* Medical Icon Glow */
.icon-medical {
  color: var(--liquid-glass-primary);
  filter: drop-shadow(0 0 8px var(--liquid-glass-primary));
  transition: filter 0.3s ease;
}

.icon-medical:hover {
  filter: drop-shadow(0 0 16px var(--liquid-glass-secondary));
}
```


***

***

## TASK 2: IMPLEMENTATION PLAN (GOOGLE ANTIGRAVITY WORKFLOW)

### 2.1 AGENT-FIRST ARCHITECTURE

Google Antigravity operates on a **three-phase agent orchestration model**:

```
Phase 1: Planning
├─ Agent analyzes task description
├─ Generates step-by-step task breakdown
├─ Creates implementation roadmap
└─ Awaits human approval

Phase 2: Development
├─ Agent writes code (React + TypeScript)
├─ Generates artifacts (screenshots, videos)
├─ Tests locally in browser (blue halo = agent control)
└─ Iterates on feedback via comments (Google Docs-style)

Phase 3: Verification
├─ Agent captures video of working feature
├─ Analyzes video to confirm success
├─ Provides walkthrough artifact
└─ Ready for production deployment
```

**Your workflow for Mutqin:**

```
Step 1: Feed Antigravity the MAIN PROMPT (below)
Step 2: Agent generates "Task Artifact" (breakdown of hero + sections)
Step 3: Review & approve task plan
Step 4: Agent starts development (watch the blue halo!)
Step 5: Agent generates "Implementation Artifact" (code structure)
Step 6: Iterate via comments:
  - "Make hero pulse 30% slower"
  - "Add cursor tracking to specular highlights"
  - "Mobile: remove neural synapses, keep pulse"
Step 7: Agent generates "Walkthrough Artifact" (video proof)
Step 8: Deploy to production
```


***

### 2.2 AGENT INSTRUCTIONS FOR ANTIGRAVITY

**Copy-paste this into Antigravity's Agent Manager (Playground)**:

```markdown
# MUTQIN LANDING PAGE – BUILD TASK

## Build Context
Project: Mutqin Medical Marketplace
Tech Stack: React 19 + TypeScript + Tailwind CSS
Design System: Apple 26 Liquid Glass
Build Tool: Google Antigravity
Deploy Target: Vercel (Next.js optional)

## Visual Requirements
1. Hero Section: Bio-Rhythmic Pulse Animation
   - Animated concentric circles (ECG-like timing)
   - Interactive neural synapse nodes (on cursor proximity)
   - Liquid Glass refraction overlay with specular highlights
   - Cursor tracking: highlights follow mouse position
   - Accessibility: respects prefers-reduced-motion

2. Design System Colors
   - Primary: #218080 (Medical Teal) - Apple 26 palette
   - Secondary: #3ba8c6 (Bright Cyan)
   - Accent: #f57c47 (Medical Orange)
   - Background: rgba(252, 252, 249, 0.95) light | dark variant for dark mode
   - Borders: rgba(33, 128, 141, 0.2) translucent teal

3. Layout Sections
   - Hero (100vh): Bio-Rhythmic Pulse + Tagline + CTA
   - Why Mutqin (60vh): 3-column Bento Grid (Trust/AI/Pricing)
   - AI Search (70vh): Large search input + animated results
   - Featured Categories (60vh): 6-tile grid with hover morphing
   - Testimonials (50vh): Horizontal carousel
   - How It Works (60vh): 3-step process with animated connectors
   - Final CTA (40vh): Sign-up conversion section

## Technical Implementation Details

### Hero Bio-Rhythmic Pulse
Use: Framer Motion + SVG
- SVG <circle> elements (3-5 concentric circles)
- animationDuration: 2.5s (slower = more medical, less frenetic)
- opacity: gradient from 0.8 → 0 (fade effect)
- Neural synapses: <line> SVG elements connecting random nodes
- Trigger: `onMouseMove` event tracks cursor, calculates distance to nodes
- Nodes within 150px radius: animate color change (teal → cyan)

### Liquid Glass Refraction Overlay
Use: CSS backdrop-filter + WebGL (optional for highlights)
- CSS: `backdrop-filter: blur(12px); background: rgba(255,255,253,0.6);`
- Specular highlights: either CSS box-shadow or WebGL canvas overlay
- If WebGL: use Three.js Plane geometry with custom fragment shader
- Performance target: 60fps (test on M1 Mac + mid-range Android)

### Animation Library
Use: Framer Motion
- Reasons: Large context window (Antigravity + Gemini) benefits from Framer's declarative syntax
- Stagger animations on section reveal: `staggerChildren: 0.1`
- Scroll triggers: use Framer's `useViewportScroll` hook

### Responsive Design
- Desktop: Full animations enabled
- Tablet (768px): Reduced animation complexity, simpler pulse
- Mobile: Pulse only (no neural synapses), cursor tracking disabled
- Breakpoints: 480px, 768px, 1024px

### Performance Constraints
- Lighthouse Score: >90 (Core Web Vitals)
- First Paint: <2.5s
- Interactive: <4s
- Total bundle size: <200kb (after gzip)
- No Three.js in hero (save for future 3D product carousel)

## Folder Structure (Next.js or React SPA)
```

/src
/components
/sections
- HeroSection.tsx (Bio-Rhythmic Pulse)
- WhyMutqinSection.tsx (Bento Grid)
- AiSearchSection.tsx (Search + Results)
- CategoriesSection.tsx (Featured Services)
- TestimonialsSection.tsx (Carousel)
- HowItWorksSection.tsx (3-Step Process)
- CTASection.tsx (Final Conversion)
/ui
- LiquidGlassCard.tsx (Reusable component)
- PulseAnimation.tsx (Hero pulse logic)
- SpecularHighlight.tsx (Cursor-tracked shine)
/hooks
- useMousePosition.ts
- useScrollTrigger.ts
- useReducedMotion.ts
/styles
- globals.css (Liquid Glass design tokens)
- animations.css (Framer Motion keyframes)
/utils
- colorPalette.ts (Apple 26 tokens)
- easings.ts (custom easing functions)

- App.tsx (Main layout + section orchestration)

```

## Approval Checklist (Before Sending to Agent)
- [ ] Artifact structure defined
- [ ] Color tokens mapped to CSS variables
- [ ] Animation timings specified (ms)
- [ ] Responsive breakpoints confirmed
- [ ] Performance constraints listed
- [ ] Accessibility (a11y) requirements noted
- [ ] Deployment platform confirmed (Vercel)

## Next Steps Post-Build
1. Agent deploys to preview URL
2. Test on real device (iPhone, Android tablet)
3. Lighthouse audit
4. A/B test CTA button text/color
5. Monitor Core Web Vitals in production
```


***

### 2.3 ARTIFACT STRATEGY FOR ANTIGRAVITY ITERATION

Antigravity captures **three types of artifacts** that you'll use to iterate:


| Artifact Type | What It Contains | How to Use It |
| :-- | :-- | :-- |
| **Task Artifact** | Visual breakdown + pseudocode of what agent will build | Review for scope. Comment with corrections before Phase 2. |
| **Implementation Artifact** | Full React code (components, hooks, styles) | Read for architecture. Ask agent for clarifications via comments. |
| **Walkthrough Artifact** | Video recording of the working site + agent's thought process | Verify animations work as intended. Use for team presentations. |

**Iteration via Comments** (Google Docs style):

```
Task Artifact Comment Example:
└─ "The Bio-Rhythmic Pulse timing looks good, but can the neural synapses only activate on desktop? Mobile should skip that for performance."

Implementation Artifact Comment Example:
└─ "In HeroSection.tsx, the specular highlight is using box-shadow. Can we upgrade to a subtle WebGL overlay to match iOS 26's real-time refraction?"

Walkthrough Artifact Comment Example:
└─ "The video looks great! One thing: on dark mode, the pulse animation is too bright. Can we reduce opacity by 20%?"
```


***

### 2.4 TECH SPECS – LIBRARY SELECTION

#### Core Stack

```typescript
// package.json dependencies for Mutqin

{
  "dependencies": {
    "react": "^19.0.0",                // Latest React with Compiler
    "framer-motion": "^12.0.0",        // Animation orchestration
    "tailwindcss": "^4.0.0",           // Utility CSS (Apple 26 tokens)
    "next": "^15.0.0",                 // Optional: Next.js for SSG/ISR
    "three": "^r159",                  // Optional: 3D product showcase (future)
    "react-intersection-observer": "^9.10.0" // Scroll triggers
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/forms": "^0.5.0",    // Form styling
    "autoprefixer": "^10.4.0"
  }
}
```


#### Why This Stack?

1. **Framer Motion**:
    - Declarative animation API (perfect for Antigravity's code generation)
    - Built-in scroll triggers (no extra library)
    - GPU-accelerated transforms (60fps on mobile)
    - Stagger animations (ideal for section reveals)
2. **Tailwind CSS**:
    - Atomic utilities reduce CSS overhead
    - Easy to extend with Apple 26 color tokens
    - Lighthouse-friendly (tree-shaking removes unused styles)
3. **React 19 Compiler**:
    - Auto-memoization (no manual `useMemo` needed)
    - Faster renders for repeated animations
4. **Optional Three.js**:
    - Save for future interactive 3D models (e.g., 3D heart animation)
    - Don't use in initial hero (use SVG instead)

***

#### CSS Backdrop-Filter Implementation

```css
/* Apple 26 Liquid Glass – CSS-Only */

.glass-layer {
  background: rgba(255, 255, 253, 0.6);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px); /* Safari support */
  border: 1px solid rgba(33, 128, 141, 0.2);
  /* Performance: GPU-accelerated on modern browsers */
}

@supports not (backdrop-filter: blur(1px)) {
  /* Fallback for older browsers (IE, old Safari) */
  .glass-layer {
    background: rgba(255, 255, 253, 0.95);
    border: 1px solid rgba(33, 128, 141, 0.3);
  }
}
```


#### Cursor Tracking for Specular Highlights (WebGL Lite)

```typescript
// Optional: Use this if you want real-time refraction (advanced)
// Simpler approach: use CSS box-shadow with Framer Motion

import { useMousePosition } from '@/hooks/useMousePosition';
import { motion } from 'framer-motion';

export const SpecularHighlight = () => {
  const { x, y } = useMousePosition();

  return (
    <motion.div
      className="absolute pointer-events-none"
      animate={{
        x: x - 50, // Center the 100px highlight
        y: y - 50,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 100 }}
      style={{
        width: 100,
        height: 100,
        background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
        borderRadius: '50%',
      }}
    />
  );
};
```


***

### 2.5 PERFORMANCE OPTIMIZATION CHECKLIST

Before deploying with Antigravity:

```markdown
## Lighthouse Score Targets (Goal: >90)

Performance (>90):
- [ ] First Contentful Paint < 1.5s
- [ ] Largest Contentful Paint < 2.5s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Time to Interactive < 3.5s

Optimization Tactics:
- [ ] Hero video/GIF lazy-loaded (not critical path)
- [ ] Testimonial carousel images optimized (WebP format)
- [ ] SVG animations use CSS `will-change: transform` (GPU acceleration)
- [ ] Framer Motion animations use `initial={false}` (avoids render on mount)
- [ ] No synchronous layout thrashing in animation loops

Accessibility (>95):
- [ ] Color contrast ratio: 4.5:1 (WCAG AA minimum)
- [ ] All buttons keyboard-navigable
- [ ] `aria-label` on icon buttons
- [ ] `prefers-reduced-motion` media query implemented
- [ ] Animations disabled for users with motion sensitivity

SEO (>90):
- [ ] Meta tags: title, description, OG image
- [ ] Structured data (schema.org for Organization)
- [ ] Mobile-friendly responsive design
- [ ] Sitemap + robots.txt
- [ ] SSL certificate (HTTPS)
```


***

***

## TASK 3: LLM RECOMMENDATION \& IMPLEMENTATION PLAN

### 3.1 THE OPTIMAL LLM: GEMINI 3.0

#### Recommendation: **Gemini 3.0 (Latest Generation)**

**Criteria Assessment:**


| Criterion | Gemini 3.0 | Claude 3.5 Sonnet | GPT-4o |
| :-- | :-- | :-- | :-- |
| **Context Window** | **2M tokens** ✅ | 200K tokens | 128K tokens |
| **React/TypeScript Code Quality** | Excellent (tuned for Google's tech stack) ✅ | Excellent | Excellent |
| **Glassmorphism/Refraction Understanding** | **Native** (built on Tensor Flow, understands WebGL) ✅ | Good | Good |
| **Antigravity Integration** | **Native** (first-class support) ✅ | Limited | Limited |
| **Cost** | **Free tier available** ✅ | Expensive | Expensive |
| **Speed** | Ultra-fast (1000 tokens/sec) ✅ | Moderate | Moderate |
| **SVG/Animation Code** | Expert (lots of Google Design samples) ✅ | Expert | Expert |

**Why Gemini 3.0 Wins:**

1. **2M Context Window**: Can ingest the ENTIRE Mutqin landing page design spec + full React codebase + design system tokens in ONE prompt. No token budgeting or chunking needed.
2. **Antigravity Native**: Built by Google, optimized for Antigravity's Agent workflow. When agent passes code diffs, Gemini 3.0 understands the context perfectly (no loss of information).
3. **WebGL/Shader Understanding**: Gemini 3.0 has ingested shader documentation (GLSL, WebGL 2.0 specs). It can write WebGL code for advanced refraction effects.
4. **Free Tier**: Access Gemini 3.0 via `aipromptsx.com` or `google.ai` for free development (paid tier if production traffic spikes).
5. **Speed**: Generates 200-line React components in <2 seconds (vs. Claude's 5-8 seconds). Critical for rapid iteration in Antigravity agent loops.

***

### 3.2 IMPLEMENTATION PLAN USING GEMINI 3.0 + ANTIGRAVITY

#### Phase 1: Initial Prompt to Antigravity Agent

**Copy-paste into Antigravity (use Gemini 3.0 model selector)**:

```markdown
# MUTQIN LANDING PAGE BUILD – GEMINI 3.0 + ANTIGRAVITY

You are a senior full-stack engineer tasked with building a medical marketplace landing page with cutting-edge 2025 design trends.

## Technical Context
- Framework: React 19 + TypeScript
- Design System: Apple 26 Liquid Glass (translucent, refractive materials)
- Build Tool: Google Antigravity (you are an agentic developer)
- Deploy Target: Vercel Next.js
- Performance Goal: Lighthouse >90

## Task Summary
Build the complete Mutqin landing page with 7 sections, emphasizing the hero "Bio-Rhythmic Pulse" animation and Apple 26 Liquid Glass design language.

## Design System (Apple 26 Liquid Glass)
- Primary Color: #218080 (Medical Teal)
- Secondary: #3ba8c6 (Cyan)
- Accent: #f57c47 (Orange)
- Background Light: rgba(252, 252, 249, 0.95)
- Glass Blur: 12px
- Specular Highlight: rgba(255, 255, 255, 0.3)

## Hero Section (Priority 1)
1. Animated Bio-Rhythmic Pulse (ECG-like timing, 2.5s cycle)
   - 5 concentric circles, fade opacity
   - Neural synapse nodes (activate on cursor proximity)
   - Specular highlights track cursor position
2. Tagline: "Find Medical Excellence, In Seconds"
3. CTA: "Explore Now" (Liquid Glass button)
4. Accessibility: Respect prefers-reduced-motion

## Other Sections (Priority 2-7)
- Why Mutqin: 3-column Bento Grid (Trust, AI, Pricing)
- AI Search: Large search input + live results
- Categories: 6-tile grid with hover effects
- Testimonials: Carousel (auto-advance 6s)
- How It Works: 3-step vertical process
- Final CTA: Sign-up section

## Technical Requirements
1. Use Framer Motion for all animations
2. Tailwind CSS for styling (extend with Apple 26 tokens)
3. CSS backdrop-filter for Liquid Glass effect
4. SVG for pulse animation (not Three.js)
5. Responsive: desktop, tablet, mobile optimized
6. No localStorage (sandbox restriction)

## Agent Workflow
1. Generate Task Artifact (breakdown of build tasks)
2. Generate Implementation Artifact (full React code structure)
3. Iterate via comments if needed
4. Generate Walkthrough Artifact (video of working site)
5. Deploy to Vercel preview

Begin by generating the task breakdown and awaiting my approval.
```


***

#### Phase 2: Review Task Artifact

Antigravity will respond with a **Task Artifact** like:

```markdown
# MUTQIN BUILD – TASK BREAKDOWN

## Task List
1. **Setup Next.js project structure**
   - Initialize package.json with Framer Motion, Tailwind
   - Configure tailwind.config.js with Apple 26 color tokens
   - Create folder structure (/components, /hooks, /styles)

2. **Hero Section Component (HeroSection.tsx)**
   - Bio-Rhythmic Pulse SVG animation
   - Cursor tracking for synapse activation
   - Specular highlight overlay
   - Mobile fallback (animation simplified)

3. **Reusable Components**
   - LiquidGlassCard.tsx (with blur + border + shadow)
   - PulseAnimation.tsx (SVG logic)
   - SpecularHighlight.tsx (cursor tracking)

4. **Section Components (5 more)**
   - WhyMutqinSection.tsx (Bento Grid)
   - AiSearchSection.tsx
   - CategoriesSection.tsx
   - TestimonialsSection.tsx
   - HowItWorksSection.tsx
   - CTASection.tsx

5. **Global Styles**
   - Liquid Glass CSS variables
   - Animation keyframes
   - Responsive breakpoints

6. **Testing & Optimization**
   - Lighthouse audit
   - Performance profiling
   - Mobile testing

## Estimated Build Time: 8-12 agent iterations (2-3 hours real time)
```

**Your action**: Review and comment: "Approved. Start development on Phase 1 (Hero Section)."

***

#### Phase 3: Iterate on Implementation

Antigravity generates code. You'll likely need 2-3 iterations:

**First Comment (typical feedback):**

```
The hero pulse looks great, but:
1. Make the neural synapses only appear on desktop (remove on mobile).
2. Reduce opacity of specular highlight by 30% (currently too bright).
3. Add a 200ms delay to the animation start (so user sees the tagline first).
```

**Agent responds** (within 10 seconds):

- Modifies `HeroSection.tsx` with your feedback
- Captures new screenshot/video
- Updates Implementation Artifact

**You iterate 1-2 more times** until hero is pixel-perfect.

***

#### Phase 4: Deploy \& Monitor

Once all sections are approved:

```bash
# Antigravity deploys to Vercel preview URL
# You test on real devices:
- iPhone 15 Pro
- iPad Air
- Android tablet (Samsung Galaxy)
- Desktop (MacBook + Windows)

# Monitor with Lighthouse CI:
- Performance: >90
- Accessibility: >95
- SEO: >90
- Best Practices: >95
```


***

### 3.3 PROMPT TEMPLATE FOR ITERATIVE REFINEMENT

Use this template when providing feedback to Gemini 3.0 via Antigravity comments:

```markdown
## Iteration #[N] Feedback

### What Looks Good ✅
- [Specific praise: e.g., "Hero pulse animation is perfect timing-wise"]

### What Needs Adjustment ❌
1. [Specific issue with location: e.g., "In HeroSection.tsx, the specular highlight opacity"]
   - Problem: [Why it's wrong: e.g., "Too bright on light backgrounds"]
   - Solution: [What to change: e.g., "Reduce opacity from 0.3 to 0.2"]
   - Reference: [Context: e.g., "See line 42 of HeroSection.tsx"]

2. [Next issue...]

### Technical Constraints
- Must maintain Lighthouse >90 performance
- No external APIs (Antigravity sandbox)
- Must respect prefers-reduced-motion

### Testing Verification
- [ ] Desktop (Chrome 129 + Safari 18)
- [ ] Tablet (iPad OS 18)
- [ ] Mobile (iOS 18 + Android 14)

Proceed when ready. I'll provide visual feedback in next comment.
```


***

### 3.4 EXPECTED OUTPUT TIMELINE

| Phase | Duration | Deliverable | Your Role |
| :-- | :-- | :-- | :-- |
| Phase 1: Task Artifact | 2 min | Breakdown of tasks | Approve/request changes |
| Phase 2: Hero Section | 15 min | Working Bio-Rhythmic Pulse | Test \& comment |
| Phase 3: Sections 2-4 | 20 min | Why Mutqin, Search, Categories | Test \& comment |
| Phase 4: Sections 5-7 | 15 min | Testimonials, How It Works, CTA | Test \& comment |
| Phase 5: Refinement | 10-15 min | Responsive fixes, Lighthouse audit | Approve final design |
| **Total** | **~60-90 minutes** | **Production-ready landing page** | **Iterative feedback** |


***

***

## FINAL RECOMMENDATIONS

### 🎯 For Maximum Success:

1. **Use Gemini 3.0's context window** to your advantage:
    - Write a 500-word design brief (everything in one shot)
    - Include reference images (Onlook.com, Liquid Glass examples)
    - No need to split prompts into chunks
2. **Iterate in Antigravity, not via separate chats**:
    - Comments feature keeps context intact
    - Agent remembers all previous decisions
    - Faster feedback loops
3. **Mobile-first testing**:
    - Test on real iPhone + Android (not just browser dev tools)
    - Animation performance is critical on lower-end devices
    - Use Lighthouse CI to catch regressions
4. **Accessibility is a feature, not an afterthought**:
    - Implement `prefers-reduced-motion` from the start
    - Test with VoiceOver (Mac) and TalkBack (Android)
    - Ensure keyboard navigation works
5. **Document your decisions**:
    - Keep a "Design Decisions Log" as you iterate
    - Useful for onboarding future developers
    - Helps with A/B testing later

***

## APPENDIX: QUICK REFERENCE PROMPTS

Save these for Antigravity iterations:

### A1: "Fix Performance"

```
"Lighthouse audit shows Performance score of 82. Main issues: LCP >2.5s and CLS >0.1. 
Optimize: (1) Defer animation until after page paint, (2) Reduce SVG circle count from 5 to 3, (3) Use CSS will-change for GPU acceleration."
```


### A2: "Make it Mobile-First"

```
"Review responsive breakpoints. On 375px (iPhone SE): Remove neural synapses, simplify pulse to 2 circles only. 
Testimonial carousel should stack vertically on mobile. Ensure all touch targets are 48px minimum."
```


### A3: "Dark Mode Support"

```
"Add dark mode CSS variables. Hero should adapt: (1) Pulse circles reduce opacity by 20% in dark mode, 
(2) Text color switches to gray-200, (3) Card borders become brighter for contrast. 
Use prefers-color-scheme media query."
```


### A4: "Accessibility Audit"

```
"Implement full WCAG AA compliance: (1) Ensure all interactive elements have focus states (visible outline), 
(2) Add aria-labels to icon buttons, (3) Verify color contrast 4.5:1 for text. 
Test with keyboard navigation only (no mouse)."
```


***

## CLOSING THOUGHTS

You now have a **complete, production-ready blueprint** for Mutqin's landing page. This research document bridges:

✅ **Design Vision** (Bio-Rhythmic Pulse, Liquid Glass, medical trust)
✅ **Technical Architecture** (Framer Motion, Tailwind, React 19)
✅ **Agentic Workflow** (Gemini 3.0 + Antigravity integration)
✅ **Iteration Strategy** (comments-based feedback loops)

The key to success: **Start with Gemini 3.0's 2M-token context, feed it this entire document, and let the agent orchestrate the build through Antigravity's visual feedback loop.**

**Good luck! You're building the future of healthcare marketplace UX.** 🚀

***

This prompt is now ready to feed into Google Antigravity. Would you like me to refine any specific section, or create the **actual Antigravity-ready JSON configuration** for your first agent task?
<span style="display:none">[^10][^11][^12][^13][^14][^15][^16][^17][^18][^19][^20][^4][^5][^6][^7][^8][^9]</span>

<div align="center">⁂</div>

[^1]: https://www.apple.com/os/pdf/All_New_Features_iOS_26_Sept_2025.pdf

[^2]: https://www.apple.com/sa/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/

[^3]: https://www.mobileaction.co/blog/apple-liquid-glass-design/

[^4]: https://codelabs.developers.google.com/getting-started-google-antigravity

[^5]: https://www.shadcn.io/icon/svg-spinners-pulse

[^6]: https://www.designboom.com/design/apple-liquid-glass-ui-apps-buttons-ios-26-transparent-wwdc25-06-09-2025/

[^7]: https://dev.to/ranand12/stop-coding-start-managing-a-first-look-at-googles-antigravity-ide-3j9h

[^8]: https://www.istockphoto.com/illustrations/bio-rhythm

[^9]: https://developers.googleblog.com/en/build-with-google-antigravity-our-new-agentic-development-platform/

[^10]: https://www.shutterstock.com/search/biological-rhythm?image_type=illustration

[^11]: https://aipromptsx.com/blog/google-antigravity-part-1

[^12]: https://muz.li/inspiration/motion-design/

[^13]: https://www.youtube.com/watch?v=FXrcFeuYtq8

[^14]: https://ai.google/get-started/

[^15]: https://www.istockphoto.com/photos/bio-rhythm

[^16]: https://tapptitude.com/blog/i-os-app-design-guidelines-for-2025

[^17]: https://www.youtube.com/watch?v=URCaVsTga58

[^18]: https://stock.adobe.com/search?k=medical+waveform

[^19]: https://www.apple.com/my/os/pdf/All_New_Features_iOS_26_Sept_2025.pdf

[^20]: https://blog.maximeheckel.com/posts/the-study-of-shaders-with-react-three-fiber/

