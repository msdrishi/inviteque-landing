---
name: generate_backgrounds
description: Instructions and prompts for generating unique, modern, watercolor illustration style background images for different sections of the wedding templates.
---

# Watercolor Background Generation Skill

This skill provides standard prompts for generating background images for the various sections of our wedding templates. 
The style must always be: **Illustration watercolor style, unique, modern, highly detailed, premium, soft blending**.

## Aspect Ratios
For every section, you must generate TWO versions of the background:
1. **Desktop**: 16:9 Aspect Ratio (Landscape)
2. **Mobile**: 9:16 Aspect Ratio (Portrait)

## Color Palette & Theme
*Always ask the user for the specific color palette (e.g., "blush pink and gold", "emerald green and white", "midnight blue and silver") before generating.*

## Prompts by Section

### 1. Hero Section
**Purpose**: First impression, needs space in the center for the couple's names and date.
**Prompt**:
> "A modern, unique watercolor illustration background for a wedding invitation hero section. The edges and corners should have beautiful, soft watercolor floral and botanical elements in [INSERT COLOR PALETTE], with a large, clean, empty negative space in the center for text. Soft, ethereal lighting, premium quality, 8k resolution, elegant, no text, no words."

### 2. Our Story / Photo Cards Section
**Purpose**: Background for the photo gallery. Needs to be subtle so it doesn't clash with the photos.
**Prompt**:
> "A modern, subtle watercolor wash background for a wedding website. Very soft and faded watercolor textures in [INSERT COLOR PALETTE]. Minimalist design with gentle brushstrokes and a few scattered watercolor leaves or sparkles in the background. High key, bright, clean, premium quality, no text, empty center."

### 3. Welcome Section (Invitation)
**Purpose**: Setting the tone for the formal invitation message.
**Prompt**:
> "An elegant, modern watercolor illustration background for a wedding invitation welcome section. Features a beautiful, soft watercolor wash with delicate floral blooms or abstract elegant washes cascading from the top corners in [INSERT COLOR PALETTE]. The center must be bright and uncluttered for readable text. Premium, sophisticated, highly detailed, no text."

### 4. Venue Section
**Purpose**: Highlight the location. Can incorporate subtle architectural or landscape elements.
**Prompt**:
> "A beautiful, modern watercolor illustration background of a romantic landscape or venue setting in [INSERT COLOR PALETTE]. Soft watercolor style, dreamy atmosphere, subtle hints of [INSERT VENUE TYPE, e.g., palace arches, garden gates, beach horizon] faded into the background. Lots of negative space in the top half for text. Premium, artistic, ethereal, no text."

### 5. Wedding Schedule (Itinerary)
**Purpose**: Needs to be highly readable. A long vertical scroll vibe for mobile.
**Prompt**:
> "A clean, modern watercolor background for a wedding itinerary section. Very light watercolor paper texture with soft, abstract watercolor washes along the borders in [INSERT COLOR PALETTE]. The central area must be almost white or very light for maximum text legibility. Elegant, subtle, premium, no text."

### 6. Countdown Section
**Purpose**: Dramatic, impactful background to build excitement.
**Prompt**:
> "A striking, modern watercolor illustration background for a wedding countdown. Deep, rich watercolor washes in [INSERT COLOR PALETTE] with a sense of magic or celebration. Perhaps subtle stardust, light flares, or deeper contrasting floral silhouettes at the bottom. Premium, high contrast, elegant, no text."

### 7. Thanks / Footer Section
**Purpose**: A warm, concluding visual.
**Prompt**:
> "A beautiful, soft watercolor illustration background for a wedding website footer. Delicate watercolor florals and abstract color washes anchoring the bottom edge of the image in [INSERT COLOR PALETTE], fading into clean white space at the top. Modern, unique, elegant, warm, premium quality, no text."

## Instructions for the Agent
1. When a user asks to generate backgrounds, first confirm the color palette and theme.
2. Use the `generate_image` tool.
3. For each requested section, run the tool twice: once with `AspectRatio: "16:9"` (Desktop) and once with `AspectRatio: "9:16"` (Mobile).
4. Save the images with clear names like `hero_desktop`, `hero_mobile`, `venue_desktop`, etc.
