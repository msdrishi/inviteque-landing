---
name: create_wedding_template
description: Guidelines and step-by-step instructions for creating, styling, and registering a new independent wedding invitation template in the project.
---

# Instructions for Creating a New Wedding Template

This document outlines the standard order and requirements for creating a new, independent template in this wedding invitation platform. Every new template must be self-contained so that it does not disrupt any existing templates.

---

## 1. Core Principles of Template Creation

- **Visual Independence**: All styles, unique layouts, custom animations, and asset declarations must be template-scoped.
- **UI Differentiation Only**: The templates share identical content schemas (Groom/Bride names, venue details, schedule, countdown target) but present them with unique aesthetics (color palettes, custom font pairings, animations, background textures).
- **No Side Effects**: Never modify shared components in a way that breaks existing layouts.

---

## 2. Standard Template Structure (The 6 Sections)

Every template must contain exactly these 6 core sections in sequential order:

### I. Hero Section
- **Content**: Intro text ("Together with their families..."), groom & bride names, marriage subtitle ("Are Getting Married"), date/time, and scroll indicator.
- **Animations**: Entrance animations must be line-by-line staggered. The couple's names must animate in last after a slight pause to create a cinematic "movie title" feel.
- **Styling**: Include premium elements such as text gradients, linear sweep glare/glass shine animations on names, and custom typography (cinematic serif/script font pairs).

### II. Photo Cards (Our Moments / Story)
- **Content**: Grid or layout containing up to 3 story images.
- **Layout**: Side-by-side columns on desktop view, vertical stack or card slider on mobile view.

### III. Welcoming Message (Invitation)
- **Content**: RSVP/Invitation text card, often designed with border decorations or an envelope visual element.

### IV. Venue Section
- **Content**: Title ("Our Venue"), address details (separated into Line 1 and Line 2), map links, and a QR code generator map card.
- **Height Constraints**: Must fit the screen fully (`minHeight: '100svh'`) on both mobile and desktop. Do not cap the height using forced aspect ratios or strict `max-height` rules on desktop, as it will crop background images.
- **Data Fallbacks**: Reference static defaults in `weddingData.js` (e.g. `staticData.venue.venueLine1`) to ensure the page renders default placeholder addresses when user draft inputs are blank.

### V. Countdown Section
- **Content**: Live countdown timer showing days, hours, minutes, and seconds remaining until the target ISO wedding date.

### VI. Footer
- **Content**: closing credits ("With Love", couple names, and trademark watermark).
- **Structure**: The structure and content placement of the footer must remain identical across all templates. Only the color palette (text color, background color/opacity) should be adjusted to match the template's overall theme.

---

## 3. Step-by-Step Implementation Workflow

Follow this sequence to implement and register the new template:

### Step A: Define Asset Mapping
If you are using Cloudinary for images, list the asset URLs (mobile and desktop versions of backgrounds, textures) and store them in the template configuration. For example:
- Define mappings in a local JSON config or at the top of the template file.

### Step B: Create the Template Page Component
- Create a new file: `src/pages/Template[TemplateName].jsx`.
- Implement both the **Mobile View** (max-width `430px`) and **Desktop View** (full width `md:block`) sequentially within the file, mapping data from `savedData` or the `useDraft` hook.
- Implement the 6 required sections, importing modular components or writing custom template-scoped components inside the file.

### Step C: Register the Template Route
- Open [TemplateRoute.jsx](file:///e:/Wedding-Website/wedding-invite/src/pages/TemplateRoute.jsx).
- Import the new template page.
- Add the template ID mapping to the `TEMPLATE_MAP` registry:
  ```javascript
  const TEMPLATE_MAP = {
    'new-template-id': TemplateNewTemplate,
  };
  ```

### Step D: Register Preloading Assets
- Add all background images, custom typography fonts, and static vectors to the `TEMPLATE_ASSETS` array in [TemplateRoute.jsx](file:///e:/Wedding-Website/wedding-invite/src/pages/TemplateRoute.jsx):
  ```javascript
  const TEMPLATE_ASSETS = {
    'new-template-id': [
      "https://res.cloudinary.com/...", // Background images
      "https://res.cloudinary.com/...", // Custom fonts / vectors
    ]
  };
  ```
- This ensures the global splash screen waits for all custom layout assets to load, preventing FOUT (flash of unstyled text) and image lag.

### Step E: Verify and Build
- Run the build tool to ensure everything compiles cleanly:
  ```bash
  npm run build
  ```
