---
name: create_wedding_template
description: Guidelines and step-by-step instructions for creating, styling, and registering a new premium wedding invitation template.
---

# Instructions for Creating a New Wedding Template

This document outlines the standard order and requirements for creating a new, premium independent template in this wedding invitation platform. Every new template must follow these state-of-the-art cinematic patterns while remaining fully self-contained.

---

## 1. Core Principles & Global Rules

- **Cinematic Entry (Tap to Open)**: Every template must feature a "Tap to Open" cover component. This consists of:
  - An absolute full-screen video (`mp4`) serving as the cover.
  - A fast-loading poster image (e.g., the first frame of the video) to prevent black screens.
  - An elegant "Tap to Open" text overlay with floating/glowing SVG elements (e.g., golden stars).
  - Background music (`<audio>`) that begins playing (unmuted) only when the cover is tapped.
  - A floating, glassmorphism mute/unmute button (e.g., bottom-right) that appears after opening.
- **Visual Independence**: All styles, layouts, animations, and assets must be template-scoped.
- **Backgrounds**: The background containers must use `width: 100%` (never `100vw` to avoid horizontal scroll bugs). Background images must be layered correctly behind content.
- **Scroll Behavior**: Content should fade in when scrolled into view, generally using `viewport={{ once: true, amount: 0.3 }}` to prevent disappearing UI on re-scroll.

---

## 2. Section-by-Section Rules

### I. Hero Section (The Reveal)
- **Seamless Transition**: The Hero background must not be visible immediately. It must gracefully fade in and scale down (e.g., `scale: 1.14 -> 1.0` over `3s`) *only after* the Tap to Open cover video finishes playing.
- **Content Coordination**: Text elements and floating accents (like falling flowers) must wait for the background to trigger (`hasTriggeredHeroBg`) before animating in.
- **Typography & Animations**: The couple's name must have letter-by-letter animations and a glassy glare sweep effect. Use highly legible, premium fonts.
- **Address Formatting**: The address must be intelligently shortened (removing excess ZIP codes, states, and duplicated hotel names) to present a clean, 3-part elegant location string (e.g., *Diplomatic Enclave, Chanakyapuri, New Delhi*).

### II. Our Story Section
- **Clean Aesthetic**: Do NOT wrap the "OUR STORY" header in heavy background boxes or div banners. Use clean, elegant typography.
- **Background**: Avoid heavy background images. Use a solid, readable background (e.g., `#F7E8D2`) with a subtle, seamless SVG texture overlay.
- **Focus**: Keep the focus on the photo cards (max 3 images) with staggered, cascading entrance animations. Do not clutter the bottom with excessive story paragraphs unless explicitly requested.

### III. Wedding Schedule (Timeline)
- **Background & Theme**: Utilize the same solid background and subtle SVG texture overlay as the Story section for visual consistency.
- **Layout**: Maintain the vertical cascading timeline logic (left/right alternating dots connected by a curved SVG path).
- **Data Hookup**: Ensure `scheduleItems` dynamically reads from `draftData.events` to reflect real-time preview edits.

### IV. Venue Section
- **Layout Visibility**: Use `minHeight: '100svh'` and `height: 'auto'` with sufficient `paddingBottom` so the address and map button are never hidden.
- **Address Clarity**: Like the Hero section, use the shortened address formatter. Remove redundant labels like "CELEBRATION VENUE" in favor of minimalistic design.
- **Interactivity**: The QR Code must have a clean UI integration, accompanied by a clear "Get Directions" button if applicable.

### V. Calendar Section
- **Dynamic Reveal Animation**: The calendar must automatically animate when scrolled into view (no manual "Reveal" button).
- **Cinematic Arrow Path**: The highlight animation (e.g., cupid's arrow) must follow a beautifully calculated, looping cubic-bezier path (e.g., sweeping from the bottom-left, looping over the header, and striking the exact target date).
- **Impact Effect**: Upon hitting the date, the arrow should NOT fall out of bounds. It should perform a rigid "thud/crunch" scale effect (simulating a solid hit) and gracefully fade out in place, immediately triggering a confetti burst.

### VI. Countdown Section
- **Ambient Accents**: Add the same floating/falling elements (e.g., falling flowers) used in the Hero section to the Countdown section for thematic continuity.
- **Positioning**: Center the countdown timer elegantly within the frame, ensuring it is instantly readable.

### VII. Footer
- **Structure**: The structure and content placement must remain identical across all templates. Only adjust colors and borders to match the theme.

---

## 3. Step-by-Step Implementation Workflow
1. Map assets in configuration (ensure videos, posters, and MP3s are available).
2. Create `Template[TemplateName]Cover.jsx` for the Tap to Open logic.
3. Create `Template[TemplateName].jsx` (the orchestrator that manages video/audio states, the music toggle, and passes `hasTriggeredHeroBg` to the Hero).
4. Build individual `Template[TemplateName][Section].jsx` files adhering to the aesthetic rules above.
5. Register in `TemplateRoute.jsx` and `TEMPLATE_ASSETS` for global preloading.
6. Run `npm run build` to verify.
