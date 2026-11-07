---
name: create_wedding_template
description: Guidelines and step-by-step instructions for creating, styling, and registering a new premium wedding invitation template across both frontend and backend systems.
---

# Instructions for Creating a New Wedding Template

This document outlines the standard architecture, file organization, styling rules, and mandatory registration requirements for creating a new, premium independent template in this wedding invitation platform.

---

## 1. Core Architectural & Design Rules

1. **Modular File Architecture (Never a Single File)**:
   - Every template must reside in its own folder: `src/templates/<template-slug>/`.
   - **Every section must be an independent JSX component** in that folder so it remains clean, self-contained, and easily modifiable:
     * `index.jsx` (Template orchestrator, watermarking, responsive layout, feature resolution)
     * `theme.jsx` (Colors, fonts, assets mapping, SVG ornaments, shared line animations)
     * `FallingPetals.jsx` (Ambient floating/falling elements reused across sections)
     * `[TemplateName]Hero.jsx` (Hero reveal, couple names, date/time/venue)
     * `[TemplateName]PhotoCards.jsx` (Photo cards stack animation)
     * `[TemplateName]Welcome.jsx` (Welcome note & formal invitation)
     * `[TemplateName]Venue.jsx` (Venue details, QR code, directions)
     * `[TemplateName]Schedule.jsx` (Wedding timeline / itinerary)
     * `[TemplateName]Countdown.jsx` (Animated countdown timer)

2. **Common & Centralized Feature Resolution (CRITICAL)**:
   - **Never hardcode or invent one-off section visibility booleans** (e.g. `!hidePhotoCards`).
   - Always import and use `resolveInvitationFeatures` from `src/utils/invitationFeatures.js`:
     ```javascript
     import { resolveInvitationFeatures } from '../../utils/invitationFeatures.js'

     const {
       isPaid,
       showWatermark,
       showRsvp,
       showPhotoCards,
       showGallery,
       showSchedule,
       showVenue,
       showWelcome,
       showCountdown,
       events,
       photos,
     } = resolveInvitationFeatures({
       savedData,
       draftData,
       isCustomPreview,
       isPreview,
     })
     ```
   - This guarantees that when a customer disables a section (e.g. Photo Cards, Schedule, Venue) in the Builder, it is accurately and immediately hidden in the live template.

3. **Universal Builder Preview Navigation Bar**:
   - In `isCustomPreview` mode, import and render `TemplatePreviewBar`:
     ```javascript
     import TemplatePreviewBar from '../../components/TemplatePreviewBar.jsx'

     {isCustomPreview && (
       <TemplatePreviewBar
         templateId="<template-slug>"
         draftData={draftData}
         primaryColor="<themePrimaryColor>"
       />
     )}
     ```
   - This provides the standardized "← Back to Edit" and "Proceed →" floating pills for both mobile and desktop.

4. **No Div Banners for Text Contents**:
   - **Never wrap typography or headers in heavy div banners, white frosted cards, or background boxes** unless specifically asked.
   - Text must be placed directly over the negative space of the background illustration for a premium, clean, high-end editorial feel.

5. **Slow Line Animations (`duration: 2.2s`)**:
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

6. **Re-Trigger Animations on Every Scroll**:
   - Text animations must occur **every time** the user scrolls or navigates to the section:
     ```javascript
     viewport={{ once: false, amount: 0.15 }}
     ```
   - Do NOT use `once: true`.

7. **Royal Heirloom Style S-Curve Schedule (No Image Thumbnails)**:
   - The wedding itinerary must follow the **Royal Heirloom** pattern:
     * A dynamic central S-curve SVG line weaving down the middle corridor.
     * Alternating left and right milestone nodes (width ~146px).
     * Floating micro-animated icon badges.
     * **No heavy photo/image thumbnails** in the schedule.

8. **Synchronized Default Events (Haldi, Wedding, Reception)**:
   - The default wedding schedule items and the RSVP events must be identical:
     1. **Haldi Ceremony**
     2. **Wedding Ceremony (Subha Muhurtham)**
     3. **Grand Reception**

9. **Standard Default Sections (In Exact Order)**:
   1. **Hero**
   2. **Photo Card Section (Story)**
   3. **Welcome Note**
   4. **Venue**
   5. **Wedding Schedule**
   6. **RSVP** (using `InviteQRSVP` with template-matched theme)
   7. **Countdown**
   8. **InviteQue Footer** (`<Footer theme="..." />`)

10. **Asset Hygiene (Clean & Compressed WebP Only)**:
    - Convert all original images to compressed `.webp` using `sharp` (quality 80-85).
    - Delete all source `.png` files and duplicate files with spaces.
    - Use clean, standardized filenames: `hero-mobile.webp`, `venue-mobile.webp`, `countdown-mobile.webp`, `plain-bg.webp`, `thumbnail.webp`.

11. **Design Matching from Thumbnail / Artwork**:
    - Analyze the template thumbnail artwork first to identify:
      * Exact primary color (e.g. Temple Maroon `#731924`, Forest Green, Royal Navy)
      * Accent & gold colors (e.g. Antique Bronze `#8B6834`, Warm Gold `#C5A059`)
      * Typography style (Religath serif headings, Cinzel labels, Modernline accents)
      * Specific motifs & dividers (e.g. Winged Lotus, Diamond rule).

12. **Ambient Falling Animation Continuity**:
    - Reusable falling element animation (e.g., flower petals, rose petals, jasmine flowers, or stardust).
    - **Must be active on BOTH the Hero section AND the Countdown section** for visual continuity.
    - Constrain drift to outer edges (left 0–18vw, right 82–100vw) so center text remains legible.

13. **3-Letter Short Day Format in Hero Page (No Full Day Names)**:
    - In the Hero section date display, always use 3-letter abbreviated day names:
      `MON`, `TUE`, `WED`, `THU`, `FRI`, `SAT`, `SUN`
    - **Never use full day names** like `THURSDAY`, `MONDAY`, etc.

14. **Full Screen Mobile Viewport For Every Section (`min-h-[100svh]`) (CRITICAL)**:
    - **Every section in the template MUST be full screen to mobile size**:
      * Every root `<section>` component must include `min-h-[100svh]` (or `minHeight: '100svh'`).
      * Root container standard pattern: `className="w-full min-h-[100svh] flex flex-col items-center justify-center relative overflow-hidden"`.
    - **NEVER use negative margins between sections**:
      * Never use negative margins (e.g. `-mt-8`, `-mt-12`) on section root elements. Negative margins pull the section upwards and force titles/text to overlap the preceding section's borders or artwork.
      * Give all section headers ample top breathing room (e.g. `pt-16` or `paddingTop: '64px'–'72px'`) to prevent visual collision with previous section content.
      * Content inside the section should be vertically centered using `my-auto` or `justify-center` so that on mobile screens of any height (e.g. iPhone, Pixel, Samsung), the content is positioned in the focal center of the screen.

15. **Smooth "Tap to Open" Cover & Video Flow (Midnight Waltz Architecture) (CRITICAL)**:
    - For templates with a "Tap to Open" cover/envelope video opening flow, strictly adhere to the proven Midnight Waltz architecture:
      * **Direct Asset with `#t=0.001` (Never `fetch()` / `blob:`)**:
        - Point `<video>` directly to the video URL with `#t=0.001`: `src={`${coverVideoSrc}#t=0.001`}`.
        - `#t=0.001` prompts mobile browsers (iOS/Android) to decode and render frame 0 immediately upon mount without needing a separate poster image, preventing blank flashes or frame desync.
        - **NEVER use background `fetch()` / blob URL preloading**. Replacing the `<video>` src dynamically resets the element and aborts pending playback requests (`AbortError`), causing the video to freeze or fail to start.
      * **Audio Unlocking During User Gesture**:
        - Unlock audio inside the tap handler: `audioRef.current.muted = true; audioRef.current.play().catch(...)`.
        - When `hasOpened` becomes `true`, unmute audio: `audioRef.current.muted = false; audioRef.current.volume = 1;` so music starts cleanly right as the hero section begins revealing.
      * **1.4s Cross-Fade Exit (`duration: 1.4, ease: [0.22, 1, 0.36, 1]`)**:
        - The cover overlay must dissolve out with:
          ```jsx
          <motion.section
            key="cover-splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } }}
            ...
          >
          ```
        - The Hero background image must be mounted eagerly underneath (`loading="eager"`) without `initial={{ opacity: 0 }}` so it is instantly visible as the cover fades.
        - Stagger hero typography with `delayChildren: 0.4`, `staggerChildren: 0.18`, and line duration `2.0s–2.2s`.
      * **Trigger Timing & Safety Fallbacks**:
        - In `onTimeUpdate`, trigger `setHasOpened(true)` at `vid.currentTime >= vid.duration - 0.25` so the dissolve begins smoothly as the video reaches its final frames.
        - Support `onEnded={handleVideoEnded}`.
        - Catch errors on `video.play()` and provide a 7–8 second safety fallback so users never get stuck if a mobile browser blocks playback.

---

## 2. Step-by-Step Implementation Workflow

### Step 1: Asset Processing
- Place assets in `public/assets/templates/<template-slug>/`.
- Convert all images to WebP and delete all `.png` files and duplicates.

### Step 2: Define Theme (`theme.jsx`)
- Set palette colors (`primary`, `secondary`, `gold`, `bgIvory`).
- Define typography font families.
- Create vector divider components.
- Export `slowLineAnim` and `slowContainerAnim`.

### Step 3: Build Ambient Effect (`FallingPetals.jsx`)
- Create floating flower petals / ambient accents.

### Step 4: Build Individual Section Components (All Full Screen: `min-h-[100svh]`)
- `[TemplateName]Hero.jsx` (`min-h-[100svh]`, adjust `paddingTop` to prevent illustration overlap)
- `[TemplateName]PhotoCards.jsx` (`min-h-[100svh]`, cards start at `100vh` with `opacity: 0` so Card 2 is never seen prematurely)
- `[TemplateName]Welcome.jsx` (`min-h-[100svh]`, direct typography on artwork, no div banner)
- `[TemplateName]Venue.jsx` (`min-h-[100svh]`, direct typography on artwork, no div banner)
- `[TemplateName]Schedule.jsx` (`min-h-[100svh]`, Royal Heirloom S-curve, Haldi/Wedding/Reception, no negative margins, no images)
- `[TemplateName]Countdown.jsx` (`min-h-[100svh]`, direct typography on artwork, FallingPetals, no div banner)

### Step 5: Assemble in `index.jsx`
- Use `resolveInvitationFeatures` from `src/utils/invitationFeatures.js` to control visibility for all sections.
- Render `<TemplatePreviewBar templateId="<template-slug>" draftData={draftData} />` when in `isCustomPreview`.
- Render mobile and desktop layouts with watermarks.

### Step 6: Frontend Registration
1. **Catalog Registration**:
   Add template entry to `src/templates/templates.js` with `id`, `name`, `price`, `thumbnail`, and `href`.
2. **Dynamic Route Registration**:
   Register lazy-loader in `src/pages/TemplateRoute.jsx` under `TEMPLATE_MAP` and assets under `TEMPLATE_ASSETS`.
3. **Checkout Screen Styling**:
   In `src/pages/Payment.jsx`:
   - Add template boolean flag `isTemplateName = templateId === '<template-slug>'`
   - Set `coverImage` mapping to hero/thumbnail image.
   - Set `headerGradient` to match the template's color palette.

---

## 3. Backend & Database Registration (CRITICAL for Payment & Purchasing)

> [!IMPORTANT]
> The PostgreSQL `invites` table enforces a strict Foreign Key constraint: `invites.template_id REFERENCES templates(id)`.
> If a template is NOT registered in the database, calling `POST /api/invites` during checkout will fail with a `500 Foreign Key Violation` error and block purchase.

Whenever a new template is created, complete these backend registration steps:

### 1. Register in PostgreSQL `templates` Table
Create a new Flyway migration in `invitique-backend/src/main/resources/db/migration/`:
File: `V<NextNumber>__add_<template_slug>_template.sql`

```sql
-- Register new template with configured price (in paise: ₹2,499 = 249900 paise, ₹1,999 = 199900 paise)
INSERT INTO templates (id, name, description, price, is_active) VALUES
('<template-slug>', '<Template Title>', '<Template Description>', 249900, TRUE)
ON CONFLICT (id) DO UPDATE SET price = 249900, is_active = TRUE;

-- Also register hyphen/underscore variations if applicable
INSERT INTO templates (id, name, description, price, is_active) VALUES
('<template_slug>', '<Template Title>', '<Template Description>', 249900, TRUE)
ON CONFLICT (id) DO UPDATE SET price = 249900, is_active = TRUE;
```

Execute this SQL directly on the local database (`psql -U postgres -d inviteque`) so it is immediately active without waiting for server restart.

### 2. Update Backend Price Resolver in `PaymentController.java`
In `resolveBasePrice(String templateId)`:
- Ensure the template slug is included in the canonical price fallback mapping.
- The method automatically reads from the database `templates` table first, allowing prices to be modified dynamically in the database.

---

## 4. Verification Checklist

1. **Frontend Build**:
   ```powershell
   npm run build
   ```
   Must complete with 0 errors.

2. **Backend Compilation**:
   ```powershell
   mvn compile -f "e:\Wedding-Website\invitique-backend\pom.xml"
   ```
   Must output `BUILD SUCCESS`.

3. **Database Integrity**:
   Verify the template row exists in `templates` table:
   ```sql
   SELECT id, name, price, is_active FROM templates WHERE id = '<template-slug>';
   ```

4. **Section Visibility Test**:
   - In Builder Step 3, toggle OFF "Postage Stamp Photo Gallery" -> verify photo cards do NOT show.
   - Toggle OFF "Wedding Schedule" -> verify schedule section does NOT show, but RSVP events remain visible.
   - Toggle OFF "Venue" or "Welcome" -> verify corresponding sections are cleanly hidden.

5. **Payment Checkout Flow**:
   - Proceed to `/payment?templateId=<template-slug>`
   - Verify template name, cover image, and price match the configured price (₹2,499 or ₹1,999).
   - If RSVP is selected, verify price updates dynamically by +₹500.
   - Click Pay and verify Razorpay order creates without database foreign key or pricing errors.
