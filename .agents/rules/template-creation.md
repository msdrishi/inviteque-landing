---
trigger: manual
---

# Rules for Creating a New Wedding Template

When creating a new wedding template in this project, you must adhere strictly to the following rules:

## 1. Visuals and Backgrounds
- **No Overlays**: Do not place any overlay or filter on top of the background images.
- **Background Sizing**: The background image must have `width: 100vw`.
- **Responsive Backgrounds**: Use the mobile background for tablet views as well, adjusting the size accordingly.
- **Image Hosting**: All couple pictures must be hosted on Cloudflare. Use the URL link of the image in the JSON configuration.
- **Local Images**: If pictures are stored locally, they must be in `.webp` format. If they are in a different format, they must be converted to `.webp`.

## 2. Layout and Responsiveness
- **Full Screen Sections**: Every section must be full screen on both mobile and desktop (it should cover the entire screen, e.g., `minHeight: '100vh'` or `100svh`).
- **Device Responsiveness**: The template must be fully responsive across all devices (mobile, tablet, and desktop).
- **Responsive Text Sizing**: Text size should dynamically adjust based on the screen size (e.g., text should be larger on tablets and appropriately sized for smaller mobile screens).

## 3. Typography and Text
- **Consistent Fonts**: Use the same font family consistently across the entire template.
- **No Text Breaking**: All text should remain intact and should not awkwardly break into multiple lines or parts. Ensure container widths and text wrapping are handled gracefully.

## 4. Animations
- **Consistent Section Animations**: Text animation must be present in every section, and the same text animation style must be used throughout the template.
- **Smooth Transitions**: Use smooth fade-out and fade-in animations whenever a section scrolls into view.

## 5. Global Requirements
- **Loading Splash Screen**: All templates must implement the standard loading splash screen, consistent with existing templates.
- **Visual Independence**: All styles, unique layouts, custom animations, and asset declarations must be strictly template-scoped.
- **No Side Effects**: Never modify shared components in a way that breaks existing template layouts.

## 6. Core Template Structure & Modularity
Every template must contain exactly these core sections in sequential order:
1. **Hero Section**
2. **Photo Cards (Our Moments / Story)**
3. **Welcoming Message (Invitation)**
4. **Wedding Schedule**
5. **Venue Section**
6. **Calendar Section**
7. **RSVP Section**
8. **Countdown Section**
9. **Footer**

- **Separate Component Files**: You MUST create a separate JSX file for each section (e.g., `TemplateNameHero.jsx`, `TemplateNameStory.jsx`) to improve readability and code organization.
- **Extensible and Flexible**: Each section component should be designed to be extensible, reusable, and flexible. Avoid hardcoding styles that prevent the component from adapting to different content or being reused elsewhere.

## 7. Footer Requirements
- **Styling**: All templates must have a footer styled with the template's specific color theme.
- **Links**: The footer must include Instagram and WhatsApp links.
- **Structure**: The overall structure and content placement of the footer must remain identical across all templates; only the colors should be adapted to match the theme.
