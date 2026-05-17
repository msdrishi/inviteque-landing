# Cloudinary Integration Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        React Frontend (Vite)                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────────┐         ┌──────────────────────┐        │
│  │   Photo Upload       │         │   Lazy Image         │        │
│  │  (CloudinaryImage    │         │   Component          │        │
│  │   Upload.jsx)        │         │  (LazyImage.jsx)     │        │
│  └──────────┬───────────┘         └──────────┬───────────┘        │
│             │                                │                    │
│  ┌──────────▼──────────────────────────────────▼──────────┐       │
│  │          useCloudinaryUpload Hook                      │       │
│  │  (Handles upload logic, progress, errors)             │       │
│  └──────────┬──────────────────────────────────────────┬──┘       │
│             │                                          │          │
│  ┌──────────▼────────────────────┐    ┌───────────────▼──────┐  │
│  │  cloudinary.js Utility        │    │  uploadToCloudinary()│  │
│  │  - Config                     │    │  - API calls         │  │
│  │  - Upload function            │    │  - Returns URL       │  │
│  │  - Get optimized URLs         │    └────────┬─────────────┘  │
│  │  - Delete function            │             │                │
│  └──────────────────────────────────────────────┼────────────────┘
│                                                 │
│                          ┌──────────────────────▼──────────────┐
│                          │  Cloudinary API                    │
│                          │  (https://api.cloudinary.com)      │
│                          │  - Upload image                    │
│                          │  - Auto-optimize                   │
│                          │  - Return public_id & secure_url   │
│                          └──────────────────────┬──────────────┘
│                                                 │
└─────────────────────────────────────────────────┼──────────────────┘
                                                  │
                    ┌─────────────────────────────▼──────────────┐
                    │  Cloudinary Global CDN                     │
                    │  - Stores image files                      │
                    │  - Applies transformations                 │
                    │  - Serves optimized versions               │
                    │  - Fast delivery worldwide                 │
                    └──────────────────────────────────────────┬──┘
                                                               │
                                 ┌─────────────────────────────▼──┐
                                 │  Backend API                    │
                                 │  (Save invitation to DB)        │
                                 │                                 │
                                 │  URL stored in DB:              │
                                 │  https://res.cloudinary.com/... │
                                 │  ✨ NOT the file itself!        │
                                 └─────────────────┬───────────────┘
                                                   │
                                 ┌─────────────────▼──────────┐
                                 │  Database (MongoDB/SQL)    │
                                 │                            │
                                 │  {                         │
                                 │    _id: "invite-123",      │
                                 │    photos: [               │
                                 │      "https://res.../1",   │
                                 │      "https://res.../2"    │
                                 │    ]                       │
                                 │  }                         │
                                 └────────────────────────────┘
```

---

## Detailed Upload Process

```
1. User selects image in CloudinaryImageUpload component
   ├─ File validation (type, size)
   └─ Show progress bar

2. Hook: useCloudinaryUpload runs
   ├─ Calls: uploadToCloudinary(file)
   └─ Manages: uploading state, error, progress

3. Function: uploadToCloudinary()
   ├─ Creates FormData with file
   ├─ Sends: POST to Cloudinary API
   │  └─ URL: https://api.cloudinary.com/v1_1/{cloud_name}/image/upload
   └─ Returns: { url, publicId, width, height, size }

4. Cloudinary processes:
   ├─ Stores original file
   ├─ Auto-optimizes (compress, format conversion)
   ├─ Stores multiple versions (webp, mobile, etc)
   └─ Returns: Cloudinary URL

5. Component receives URL
   ├─ Updates form state: photos.push(url)
   ├─ Displays in preview grid
   └─ User can add more images

6. User submits form
   ├─ FormData sent to backend: { photos: ["https://...", ...] }
   ├─ Backend saves to database
   └─ Database stores URLs (not files!)

7. When displaying invitation:
   ├─ Fetch from DB: photos array
   ├─ Return URLs to frontend
   └─ Cloudinary serves images via CDN
```

---

## Data Flow Comparison

### ❌ BEFORE (Traditional File Upload)

```
User selects photo
    ↓
Upload to backend server
    ↓
Backend stores file in /public or cloud storage
    ↓
Backend stores file path in database
    ↓
Frontend requests invitation
    ↓
Backend sends file path + serves file
    ↓
User sees image (slower, from backend)

Problems:
- Slow uploads (large files)
- Backend storage limited
- Backend bandwidth limited
- Not optimized for web
- Difficult to scale
```

### ✅ AFTER (Cloudinary)

```
User selects photo
    ↓
Upload DIRECTLY to Cloudinary (not backend!)
    ↓
Cloudinary auto-optimizes & stores
    ↓
Cloudinary returns secure URL
    ↓
Frontend saves URL to backend
    ↓
Backend stores URL in database (not file!)
    ↓
Frontend requests invitation
    ↓
Backend sends URLs
    ↓
Frontend displays images from Cloudinary CDN
    ↓
User sees image (fast, optimized, from CDN)

Benefits:
- Fast uploads (direct to CDN)
- Unlimited storage (Cloudinary handles it)
- Unlimited bandwidth (Cloudinary handles it)
- Auto-optimized (webp, compression, etc)
- Scales infinitely
```

---

## Component Relationships

```
Builder.jsx
    ↓
    ├─→ <CloudinaryImageUpload />
    │       ├─→ useCloudinaryUpload hook
    │       │   └─→ uploadToCloudinary() function
    │       └─→ state: uploading, error, progress
    │
    ├─→ <LazyImage src={cloudinaryUrl} />
    │       └─→ useLazyLoad hook
    │           └─→ Shows only when visible
    │
    └─→ formData.photos = [
            "https://res.cloudinary.com/...",
            "https://res.cloudinary.com/..."
        ]
```

---

## File Organization

```
src/
├── components/
│   ├── CloudinaryImageUpload.jsx      ← UI component for uploads
│   ├── LazyImage.jsx                  ← Efficient image display
│   └── ... other components
│
├── hooks/
│   ├── useCloudinaryUpload.js         ← Upload logic hook
│   ├── useLazyLoad.js                 ← Lazy loading hook
│   └── ... other hooks
│
├── utils/
│   ├── cloudinary.js                  ← Cloudinary config & functions
│   └── ... other utilities
│
├── pages/
│   ├── Builder.jsx                    ← Uses CloudinaryImageUpload
│   ├── Story.jsx                      ← Uses LazyImage
│   └── ... other pages
│
└── ... rest of project
```

---

## Security Flow

```
Frontend (Client)
    ↓ Upload file
Cloudinary (Public)
    ↓ Store & return URL
    ↓
Backend (Your API)
    ├─ Receive Cloudinary URL
    ├─ Store URL in database
    └─ ✓ Never stores actual file
    ↓
Database
    └─ Stores only: "https://res.cloudinary.com/..."

Delete Operation (Protected)
    ↓
Frontend: User clicks delete
    ↓
Backend ← request with publicId (requires auth)
    ↓
Backend deletes from Cloudinary
    ├─ Check user permission
    ├─ Delete file via Cloudinary API
    └─ Update database
    ↓
Frontend: Remove from UI
```

---

## Environment Variables

```
Frontend (.env.local)
├── VITE_CLOUDINARY_CLOUD_NAME=xyz
└── VITE_CLOUDINARY_UPLOAD_PRESET=abc

Backend (.env)
├── CLOUDINARY_CLOUD_NAME=xyz
├── CLOUDINARY_API_KEY=123
└── CLOUDINARY_API_SECRET=456
```

---

## Performance Metrics

```
Image Request Flow:

1. Frontend requests image from Cloudinary
   Time: <100ms (cached by CDN)

2. Image delivery options:
   ├─ WebP (modern browsers): Smallest size
   ├─ JPG (older browsers): Standard
   └─ PNG (transparent): As needed

3. Transformations on-the-fly:
   ├─ Resize: Only download what you need
   ├─ Compress: Auto quality based on device
   └─ Format: Auto convert to best format

Result:
├─ 80% smaller files than original
├─ Instant delivery from CDN
├─ Mobile-optimized automatically
└─ Better user experience
```

---

## Cost Breakdown

```
Cloudinary Free Tier (per month):
├─ Storage: 25 GB
├─ Transformations: 50,000
├─ Bandwidth: 100 GB
└─ Perfect for: Small to medium apps

Your Wedding Site:
├─ Avg photo: 2.5 MB → 0.5 MB (optimized)
├─ 100 invites × 5 photos = 500 photos
├─ Total storage: ~250 MB (within limit)
├─ Total bandwidth: ~125 GB/month (within limit)
└─ Cost: $0/month (FREE!) 🎉

If you exceed free tier:
├─ Storage: $0.025/GB/month
├─ Bandwidth: $0.05/GB/month
└─ Still cheaper than backend solutions
```

---

## Integration Checklist

- [ ] Understand the flow (above)
- [ ] Create Cloudinary account
- [ ] Get credentials (cloud_name, upload_preset)
- [ ] Add to .env.local
- [ ] Install packages (already done: next-cloudinary)
- [ ] Use CloudinaryImageUpload in Builder
- [ ] Test upload to Cloudinary
- [ ] Backend receives URLs
- [ ] Database stores URLs
- [ ] Display images with LazyImage
- [ ] Verify CDN serving images
- [ ] Monitor Cloudinary dashboard
- [ ] Scale confidently! 🚀
