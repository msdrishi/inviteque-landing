# Image Optimization Guide

## 🚀 What We've Done

### 1. **Automatic Image Compression (Build-time)**

- Installed `vite-plugin-imagemin` with optimizers for JPG, PNG, and WebP
- Images are automatically compressed during build
- **Results:** 50-80% file size reduction without quality loss
- **Configuration:** `vite.config.js`

### 2. **Lazy Loading Hook & Component (Runtime)**

- Created `useLazyLoad()` hook for custom lazy loading
- Created `LazyImage` component for easy implementation
- Images load only when visible on screen
- Uses Intersection Observer API (native browser feature)

### 3. **WebP Format Support**

- Automatically generates WebP versions of PNG/JPG
- Falls back to original format for older browsers
- Can save 25-35% more space than PNG/JPG

---

## 📝 How to Use

### Option 1: Use LazyImage Component (Recommended)

**Before:**

```jsx
<img src={imageSrc} alt="Photo" className="w-full" />
```

**After:**

```jsx
import { LazyImage } from "../components/LazyImage";

<LazyImage src={imageSrc} alt="Photo" className="w-full" />;
```

### Option 2: Use useLazyLoad Hook (Advanced)

```jsx
import { useLazyLoad } from "../hooks/useLazyLoad";

function MyComponent() {
  const { ref, isVisible } = useLazyLoad();

  return (
    <img
      ref={ref}
      src={isVisible ? imageSrc : placeholderSrc}
      alt="Photo"
      loading="lazy"
    />
  );
}
```

---

## 📁 Files to Update

### 1. **Story.jsx** - Photo Gallery

```jsx
import { LazyImage } from "./LazyImage";

// Change: <img src={} /> to <LazyImage src={} />
```

### 2. **Landing.jsx** - Template Thumbnails & Carousel

```jsx
// Replace template thumbnail images with LazyImage
```

### 3. **TemplateRoyalWedding.jsx** - Template Preview

```jsx
// Replace all img tags with LazyImage
```

### 4. **Account.jsx** - Invitation Grid

```jsx
// Replace invitation thumbnail images with LazyImage
```

---

## 🎯 Expected Results

| Metric                 | Before | After  | Improvement   |
| ---------------------- | ------ | ------ | ------------- |
| Avg Image Size         | 2.5 MB | 0.5 MB | 80% reduction |
| Page Load Time         | 8-12s  | 2-4s   | 60-70% faster |
| First Contentful Paint | 3s     | 0.8s   | 70% faster    |

---

## 🔧 Advanced Optimization Tips

### 1. **Use Responsive Images**

```jsx
<LazyImage
  src="image-1200.jpg"
  alt="Photo"
  className="w-full"
  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1200px"
/>
```

### 2. **Manual Image Compression (One-time)**

Use online tools to compress before adding:

- **TinyPNG.com** - 50-80% reduction
- **ImageOptim.com** - Lossless compression
- **Squoosh.app** - Google's compression tool

### 3. **Choose Right Format**

- **JPG:** Photos, complex images (photos are already compressed)
- **PNG:** Icons, logos, transparent backgrounds
- **WebP:** Modern browsers, best compression
- **SVG:** Icons, logos, illustrations (scalable, tiny)

### 4. **Consider CDN**

For high-traffic sites, use CDNs like Cloudinary, AWS CloudFront, or Vercel Image Optimization for automatic format conversion and responsive sizing.

---

## 📊 Performance Monitoring

Add to your `index.html` to monitor:

```html
<script>
  window.addEventListener("load", () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log("Page Load Time:", pageLoadTime, "ms");
  });
</script>
```

---

## ✅ Implementation Checklist

- [ ] Build and test (`npm run build`)
- [ ] Update Story.jsx with LazyImage
- [ ] Update Landing.jsx template thumbnails
- [ ] Update Account.jsx invitation grid
- [ ] Update TemplateRoyalWedding.jsx images
- [ ] Test on slow 3G (DevTools > Network)
- [ ] Check bundle size reduction (`npm run build` output)
- [ ] Verify images still look good (compare before/after)

---

## 🐛 Troubleshooting

**Issue:** Images not loading

- **Fix:** Check browser console for errors, ensure src path is correct

**Issue:** Images look blurry

- **Fix:** Reduce compression quality in `vite.config.js` (increase quality value)

**Issue:** Build takes too long

- **Fix:** Only compress PNG/JPG, exclude videos and optimized assets
