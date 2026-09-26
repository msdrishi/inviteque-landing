---
name: create_wedding_template
description: Guidelines and step-by-step instructions for creating, styling, and registering a new independent wedding invitation template in the project.
---

# Instructions for Creating a New Wedding Template

This document outlines the standard order and requirements for creating a new, independent template in this wedding invitation platform. Every new template must be self-contained so that it does not disrupt any existing templates.

---

## 1. Core Principles & Global Rules

- **Visual Independence**: All styles, layouts, animations, and assets must be template-scoped.
- **Backgrounds**: The background image must have `width: 100vw`. No overlays or filters directly on background images. Do not animate background images (no fade-in/fade-out on `<img>`). They must remain static while content inside fades in.
- **Scroll Behavior**: Text should fade in when scrolled into view, but generally should only fade in once (`viewport={{ once: true }}`) to prevent sections like Countdown from "disappearing" unexpectedly when scrolling away.
- **Assets**: Store in Cloudflare/Cloudinary when possible; local assets must be `.webp`.

---

## 2. Section-by-Section Rules

### I. Hero Section
- **Content & Layout**: Needs names, "Together with our families", dates, and location. Top content must have sufficient `paddingTop` (e.g., `10vh`) to avoid overlapping top floral borders.
- **Animations**: The couple's name must have letter-by-letter animations (e.g. `framer-motion` stagger). Give the name text a glassy text-shadow effect. Other text elements must have line animations.
- **Theme Accents**: Include a falling petal or similar natural SVGs floating in the background, restricted to the left/right edges for a natural "movie title card" effect.
- **Typography**: The couple's name must use a highly legible, premium script font (like Priestacy) and be perfectly centered. Ensure sizing adjusts per device.
- **Date Formatting**: Use short abbreviations (SAT, MON, TUE for days; JAN, FEB, MAR for months). The date layout must be neat and stacked if necessary to prevent bad flex wrapping.
- **Bottom Indicators**: Always include an animated "Swipe Up" chevron or scroll indicator anchored to the absolute bottom of the Hero section.

### II. Photo Cards (Our Story / Moments)
- **Content**: Max 3 story images.
- **Title Banner**: Place the "OUR STORY" text inside a styled, rounded banner (`borderRadius: '30px'`) with a subtle border and background color to give it depth, instead of plain text floating over the background.

### III. Welcome Section
- **Creative Presentation**: Do not use basic text layouts. Implement interesting visuals like a hanging text banner that drops from the top of the section via spring animation when scrolled into view.
- **Animations**: Use engaging letter-by-letter scatter or random-entry animations for the body text to make the welcome message feel magical and dynamic.

### IV. Wedding Schedule (Timeline)
- **Background & Theme**: Do not use heavy image backgrounds here; use a solid, readable background (e.g., `#F7E8D2`) with a subtle SVG texture overlay.
- **Layout**: Keep the cascading timeline logic (left/right alternating dots).

### V. Venue Section
- **Layout Visibility**: Do not restrict height unconditionally if it cuts off content. Use `minHeight: '100svh'` and `height: 'auto'` with `paddingBottom` so the address/directions button is never hidden.
- **Address Formatting**: The address must be rendered cleanly in two parts within 2 lines (e.g. Line 1: Location Name (bold), Line 2: Street, City).
- **Interactivity**: The QR Code must have a clear "Get Directions" anchor button directly below it for mobile users. Include a location/pin icon next to the address.

### VI. Calendar Section
- **Full Month View**: The calendar must render all days of the respective month (28/30/31 days) accurately based on the target ISO date. Remove address duplicates from this section.
- **Interactivity**: The calendar should feature a manual "Reveal Date" button. Clicking this should trigger a playful animation (e.g., an arrow shooting from off-screen to strike the date, highlighting the target date with a Heart, followed by a brief confetti/cracker effect).

### VII. Countdown Section
- **Positioning**: Center the countdown timer near the top area of the section (e.g., `justifyContent: 'flex-start'`, `paddingTop: '15vh'`).
- **Visibility**: The countdown must only fade in once (`viewport={{ once: true }}`). Do not let it fade out and disappear when the user scrolls slightly past it.

### VIII. Footer
- **Structure**: The structure and content placement must remain identical across all templates. Only adjust colors to match the theme.

---

## 3. Step-by-Step Implementation Workflow
- Map assets in configuration.
- Create `Template[TemplateName].jsx` and individual `Template[TemplateName][Section].jsx` files.
- Register in `TemplateRoute.jsx` and `TEMPLATE_ASSETS` for global preloading.
- Run `npm run build` to verify.
