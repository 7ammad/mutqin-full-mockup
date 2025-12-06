# Mutqin Visual Direction – Network Nodes

## 1. Core Visual Concept

### 1.1 Primary Metaphor

Mutqin is a **structured activities network**.

Visually, this is represented as:

- Nodes = activities, stakeholders, or key states.
- Edges = relationships and flows.
- Space = system context (national CME/CPD ecosystem).

### 1.2 Style Keywords

- Premium, calm, and institutional.
- Structured, not chaotic.
- “Digital network for healthcare governance”, not “generic SaaS graphs”.
- Less “dashboard screenshots”, more “conceptual network”.

Color and mood:

- Dark navy / charcoal base.
- Soft blue/teal accent glows.
- Occasional warm highlight if needed (gold/amber) for emphasis.
- High clarity, no noisy gradients.

---

## 2. Design Principles

1. **Clarity over spectacle**
   - No heavy glitch, noise, or particle chaos.
   - Compositions must read instantly as “organised network”.

2. **Abstraction, not literal UI**
   - Avoid fake detailed dashboards.
   - Use abstract panels, lines, and nodes as symbols, not screenshots.

3. **Positive, enabling mood**
   - No “problem” visuals (broken chains, warning icons, red tones).
   - Everything flows smoothly; network looks healthy, connected, and governed.

4. **Consistent language across sections**
   - Same node/rail visual language is reused:
     - Hero
     - What Mutqin is
     - How it works
     - Who Mutqin serves
     - Footer
   - Users should feel they’re in one coherent world.

5. **Arabic compatibility**
   - Avoid embedding real text in imagery.
   - If any text appears in visuals, it should be abstract or easily replaced; UI copy stays in the front-end, not baked into images.

---

## 3. Section-by-Section Visual Guidelines

### 3.1 Hero – “Live Activities Network”

**Goal**

Show a calm, structured network where activity nodes move or pulse along clean connections. This is the first impression of Mutqin as the **national CME/CPD activities network**.

**Composition**

- Central or slightly off-center cluster of glowing nodes.
- Connections radiating out smoothly, forming a clear pattern (e.g. radial or layered grid).
- Some nodes are more prominent (authorities, councils); others are smaller (activities).
- The left/centre of the frame must have a relatively calm area for overlaying the hero card.

**Motion (Veo)**

- Slow camera drift around the node cluster.
- Subtle pulses from central nodes to outer nodes.
- No fast movement, no aggressive zooms.

**Hero “Do / Don’t”**

- Do: simple glowing nodes, clear lines, soft pulses.
- Don’t: tiny unreadable UI, heavy 3D scenes, or hospital photography.

---

### 3.2 “What Mutqin Is” – Network as Digital Home

**Goal**

Convey that Mutqin is the **home** for CME/CPD activities: a well-organised constellation, not a scattered mess.

**Composition**

- One central, slightly larger node = Mutqin “core”.
- Around it, multiple nodes in balanced orbits = activities and stakeholders.
- Connections between core and nodes are clearly visible.
- The graphic feels like an **organised map**, not random dots.

**Usage**

- Static image in the right column beside the “What Mutqin is” text.
- Medium contrast, so text remains the main focus.

---

### 3.3 “How Mutqin Works” – Activity Journey

**Goal**

Show a **clear path** that an activity follows across steps and stakeholders.

**Composition**

- A main horizontal or gently curved path (rail).
- 5–6 nodes along this path, equally spaced = steps 0–5.
- Optional branching edges that reconnect, hinting at collaboration, not complexity.

**Usage**

- As a background illustration behind or above the stepper UI.
- Steps in the UI (“0. Activities flow in… 5. Practitioners receive hours…”) can align visually with the nodes.

**Motion (optional Veo strip)**

- Very slow movement along the path.
- Node glows when passing a “station”.
- Designed to sit under semi-transparent UI without distraction.

---

### 3.4 “Who Mutqin Serves” – Stakeholder Nodes

**Goal**

Reinforce that each persona is part of the same network, not separate worlds.

**Composition**

- A subtle background network diagram:
  - Central node → authorities.
  - Surrounding nodes → providers, hospitals, vendors, sponsors, practitioners.
- Foreground cards show persona details; icons reference nodes (e.g. small network glyphs).

**Persona Icon Style**

- Minimal line icons inside circular or rounded shapes.
- Hints of network motifs (small nodes, thin linking lines).
- No cartoony characters, no detailed objects; keep abstract and institutional.

---

### 3.5 “Why Mutqin Matters” – Structured Foundation

**Goal**

Suggest stability, structure, and growth potential.

**Composition**

- Subtle layered grids and nodes.
- Nodes become more numerous and more organised as they move across the frame.
- No strong focal object; this should be a light texture behind benefit cards.

**Tone**

- Very low contrast; benefits text must remain clear.
- Feels like a **data foundation** rather than a hero piece.

---

### 3.6 Join Section – Founding Network

**Goal**

Visualise the idea of a **founding ring** or “inner circle” in the network.

**Composition**

- Ring or cluster of key nodes at the centre = founding partners.
- Outer ring(s) of smaller nodes = future participants.
- Light emphasis on the core ring; nothing looks “locked out”.

**Usage**

- One illustration next to the “Join the founding network” copy.
- Should make SHC / SCFHS / investors see themselves in the inner ring.

---

### 3.7 Footer – Quiet Continuation of the Network

**Goal**

End with a calm, subtle continuation of the network metaphor.

**Composition**

- Thin line running horizontally across the footer, with occasional nodes.
- Gentle, slow pulse animation on nodes (CSS or lightweight motion).
- Feels like the network continues beyond the page.

**Tone**

- Very low noise.
- This is background ambience, not a visual point of focus.

---

## 4. Technical & Implementation Notes

### 4.1 Media Types

- **Hero:** Veo video loop (16:9, 8s), downscaled/optimised for web.
- **Other sections:** Static images (JPG/PNG/WebP) with Next.js `<Image>`.
- **Optional:** Thin Veo loop for “How it works” strip if needed.

### 4.2 Integration Constraints

- All images must work over dark backgrounds (no pure white backgrounds).
- Avoid embedding real text in images to keep localisation clean.
- Use `object-cover` and consistent aspect ratios (e.g. 16:9 or 3:2).
- Apply subtle gradients / overlays in the front-end if readability is an issue.

### 4.3 Accessibility

- Maintain sufficient contrast between text and imagery (gradients over images where needed).
- Don’t encode critical information only in visuals; network diagrams are supportive, not essential for understanding.

---

## 5. Prompt Frameworks (High Level)

> Detailed prompts for Midjourney / Veo should be maintained in a separate `PROMPTS_MEDIA.md`.  
> This document defines **what** we draw, not the exact text of each prompt.

General pattern for prompts:

- Start with **concept**: “network of nodes representing CME/CPD activities and stakeholders.”
- Add **style**: “premium institutional healthcare tech, dark navy, soft blue/teal glows, minimal, calm, no people.”
- Add **composition**: “central cluster,” “horizontal journey,” “ring of founding nodes,” etc.
- Explicitly avoid: text labels, dashboards full of microtext, realistic clinical imagery.

This document is the reference for designers and prompt engineers so that all visuals stay inside one visual language: **Mutqin as an organised, calm CME/CPD activities network.**
