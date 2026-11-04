---
name: create_wedding_template
description: Guidelines and step-by-step instructions for creating, styling, and registering a new premium wedding invitation template.
---

# Instructions for Creating a New Wedding Template

This document outlines the standard architecture, file organization, styling rules, and registration requirements for creating a new, premium independent template in this wedding invitation platform.

---

## 1. Core Architectural & Design Rules

1. **Modular File Architecture (Never a Single File)**:
   - Every template must reside in its own folder: `src/templates/<template-slug>/`.
   - **Every section must be an independent JSX component** in that folder so it remains clean, self-contained, and easily modifiable:
     * `index.jsx` (Template orchestrator, watermarking, responsive layout)
     * `theme.jsx` (Colors, fonts, assets mapping, SVG ornaments, shared line animations)
     * `FallingPetals.jsx` (Ambient floating/falling elements reused across sections)
     * `[TemplateName]Hero.jsx` (Hero reveal, couple names, date/time/venue)
     * `[TemplateName]PhotoCards.jsx` (Photo cards stack animation)
     * `[TemplateName]Welcome.jsx` (Welcome note & formal invitation)
     * `[TemplateName]Venue.jsx` (Venue details, QR code, directions)
     * `[TemplateName]Schedule.jsx` (Wedding timeline / itinerary)
     * `[TemplateName]Countdown.jsx` (Animated countdown timer)

2. **No Div Banners for Text Contents**:
   - **Never wrap typography or headers in heavy div banners, white frosted cards, or background boxes** unless specifically asked.
   - Text must be placed directly over the negative space of the background illustration for a premium, clean, high-end editorial feel.

3. **Slow Line Animations (`duration: 2.2s`)**:
   - All text contents must have slow, graceful line animations:
     ```javascript
     export const slowLineAnim = {
       hidden: { opacity: 0, y: 12 },
       show: {
         opacity: 1,
         y: 0,
         transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1] },
       },
     }
     ```
   - Stagger children with `staggerChildren: 0.35` for a serene, poetic reading pace.

4. **Re-Trigger Animations on Every Scroll**:
   - Text animations must occur **every time** the user scrolls or navigates to the section:
     ```javascript
     viewport={{ once: false, amount: 0.15 }}
     ```
   - Do NOT use `once: true`.

5. **Royal Heirloom Style S-Curve Schedule (No Image Thumbnails)**:
   - The wedding itinerary must follow the **Royal Heirloom** pattern:
     * A dynamic central S-curve SVG line weaving down the middle corridor.
     * Alternating left and right milestone nodes (width ~146px).
     * Floating micro-animated icon badges.
     * **No heavy photo/image thumbnails** in the schedule.

6. **Synchronized Default Events (Haldi, Wedding, Reception)**:
   - The default wedding schedule items and the RSVP events must be identical:
     1. **Haldi Ceremony**
     2. **Wedding Ceremony (Subha Muhurtham)**
     3. **Grand Reception**

7. **Standard Default Sections (In Exact Order)**:
   1. **Hero**
   2. **Photo Card Section (Story)**
   3. **Welcome Note**
   4. **Venue**
   5. **Wedding Schedule**
   6. **RSVP** (using `InviteQRSVP` with template-matched theme)
   7. **Countdown**
   8. **InviteQue Footer** (`<Footer theme="..." />`)

8. **Asset Hygiene (Clean & Compressed WebP Only)**:
   - Convert all original images to compressed `.webp` using `sharp` (quality 80-85).
   - Delete all source `.png` files and duplicate files with spaces.
   - Use clean, standardized filenames: `hero-mobile.webp`, `venue-mobile.webp`, `countdown-mobile.webp`, `plain-bg.webp`, `thumbnail.webp`.

9. **Design Matching from Thumbnail / Artwork**:
   - Analyze the template thumbnail artwork first to identify:
     * Exact primary color (e.g. Temple Maroon `#731924`, Forest Green, Royal Navy)
     * Accent & gold colors (e.g. Antique Bronze `#8B6834`, Warm Gold `#C5A059`)
     * Typography style (Religath serif headings, Cinzel labels, Modernline accents)
     * Specific motifs & dividers (e.g. Winged Lotus, Diamond rule).

10. **Ambient Falling Animation Continuity**:
    - Reusable falling element animation (e.g., flower petals, rose petals, jasmine flowers, or stardust).
    - **Must be active on BOTH the Hero section AND the Countdown section** for visual continuity.
    - Constrain drift to outer edges (left 0–18vw, right 82–100vw) so center text remains legible.

11. **Preview Watermark & Builder Navigation**:
    - Include floating `preview-inviteque` watermark on mobile and desktop whenever `isPreview`, `isCustomPreview`, or not paid.
    - Include `Back` and `Proceed` action pills when `isCustomPreview` is active.

12. **RSVP Theme Matching**:
    - Support a dedicated theme key in `InviteQRSVP.jsx` matching the template's color palette (card borders, buttons, headers, active choices).

13. **3-Letter Short Day Format in Hero Page (No Full Day Names)**:
    - In the Hero section date display, always use 3-letter abbreviated day names:
      `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`, `SUN`
    - **Never use full day names** like `THURSDAY`, `MONDAY`, etc. Ensure date helpers format incoming day strings with a clean 3-letter uppercase abbreviation.

---

## 2. Step-by-Step Implementation Workflow

1. **Asset Processing**:
   - Place assets in `public/assets/templates/<template-slug>/`.
   - Convert to WebP and delete all `.png` files and duplicates.
2. **Define Theme (`theme.jsx`)**:
   - Set palette colors (`primary`, `secondary`, `gold`, `bgIvory`).
   - Define typography font families.
   - Create vector divider components (e.g., `LotusDivider`, `DiamondDivider`).
   - Export `slowLineAnim` and `slowContainerAnim`.
3. **Build Ambient Effect (`FallingPetals.jsx`)**:
   - Create floating flower petals / ambient accents.
4. **Build Individual Section Components**:
   - `[TemplateName]Hero.jsx` (adjust `paddingTop` to prevent illustration overlap)
   - `[TemplateName]PhotoCards.jsx` (cards start at `100vh` with `opacity: 0` so Card 2 is never seen prematurely)
   - `[TemplateName]Welcome.jsx` (direct typography on artwork, no div banner)
   - `[TemplateName]Venue.jsx` (direct typography on artwork, no div banner)
   - `[TemplateName]Schedule.jsx` (Royal Heirloom S-curve, Haldi/Wedding/Reception, no images)
   - `[TemplateName]Countdown.jsx` (direct typography on artwork, FallingPetals, no div banner)
5. **Assemble in `index.jsx`**:
   - Assemble `draftData` / `savedData` with synchronized default events.
   - Render mobile and desktop layouts with watermarks.
6. **Registration**:
   - Add template entry to `src/templates/templates.js` with `thumbnail` path.
   - Register route lazy-loader in `src/pages/TemplateRoute.jsx` under `TEMPLATE_MAP` and `TEMPLATE_ASSETS`.
7. **Verification**:
   - Run `npm run build` to confirm zero compilation errors.
