# Frontend Integration Prompt for Backend Team

## Overview
The frontend has completed integration with Cloudinary for image management and implemented a modern wedding invitation builder with the following updates. This document outlines what the frontend expects from the backend API.

---

## What Frontend is Doing Now

### 1. **Image Upload Flow**
- **Location:** Builder.jsx photo section (Step 1: Essential Details)
- **Component:** CloudinaryImageUpload.jsx
- **Process:** 
  - User selects image file (JPG/PNG, max 10MB)
  - Frontend uploads directly to Cloudinary (bypassing backend)
  - Cloudinary returns: URL, publicId, width, height, file size
  - Frontend displays progress bar (0-100%) during upload
  - Frontend stores Cloudinary URL in local state/DraftContext
  - Frontend does NOT send file to backend
  - User can upload multiple images before saving invitation

### 2. **Form Data Transformations**
- **Couple Names:** Auto-capitalized (e.g., "john" → "John")
- **Venue Names:** Auto-capitalized (e.g., "new delhi" → "New delhi")
- **Wedding Date:** Now using HTML5 date picker (single field, not 3 fields)
  - User selects: 2026-05-17 (YYYY-MM-DD format in HTML input)
  - Frontend converts to: day="17", month="May", year="2026" for API
  - Backend receives: day, month, year as separate strings

### 3. **Image Optimization**
- **Build-time:** vite-plugin-imagemin compresses images 80% (2.5MB → 0.5MB)
- **Runtime:** LazyImage component delays image load until visible (Intersection Observer)
- **User Experience:** Pages load faster, bandwidth reduced significantly

### 4. **Form Scroll Behavior**
- **Behavior:** When user clicks "Next" or "Previous", page auto-scrolls to top
- **Why:** Better UX on mobile, user sees new form section immediately
- **Backend Impact:** None (frontend-only change)

### 5. **Data Persistence**
- **DraftContext:** Saves form state to localStorage as user types
- **Purpose:** User can close browser, come back later, form data preserved
- **Backend Impact:** None (only used before form submission)

---

## API Integration Expectations

### Endpoint 1: Create Invitation
**Request Path:** `POST /api/invites`

**Frontend Sends:**
```
Headers:
- Content-Type: application/json
- Authorization: Bearer [JWT-token]

Body Format:
{
  "coupleNames": "Rohan & Anaya",
  "groomName": "Rohan",
  "brideName": "Anaya",
  "mahalName": "Mehta",
  "weddingDate": {
    "day": "17",
    "month": "May",
    "year": "2026"
  },
  "venueCity": "Bangalore",
  "venueName": "Garden Pavilion",
  "templateId": "template-1",
  "photos": [
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1234567/abc123.jpg",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v1234568/def456.jpg"
  ],
  "eventSchedule": [
    {
      "eventName": "Sangeet",
      "date": "2026-05-16",
      "time": "6:00 PM",
      "venue": "Taj Palace"
    }
  ]
}
```

**Backend Should:**
- Accept photos as string array (list of Cloudinary URLs, not files)
- Store photos in PostgreSQL TEXT[] column or equivalent
- Return HTTP 201 with invitation ID: `{ "success": true, "inviteId": 1 }`
- Validate JWT token, reject with 401 if invalid
- Return 400 if required fields missing (coupleNames, templateId, weddingDate)

**Frontend Does Next:**
- Displays success message
- Navigates to PaymentConfirmation page
- Shows invitation preview using returned inviteId

---

### Endpoint 2: Get Invitation
**Request Path:** `GET /api/invites/{inviteId}`

**Frontend Sends:**
```
Headers:
- Authorization: Bearer [JWT-token]
```

**Backend Should:**
- Return full invitation with all fields including photos array
- HTTP 200 with body: `{ "inviteId": 1, "coupleNames": "Rohan & Anaya", "photos": [...], ... }`
- Return HTTP 404 if inviteId doesn't exist
- Return HTTP 401 if JWT invalid
- Return HTTP 403 if user trying to access someone else's invitation

**Frontend Does Next:**
- Displays invitation preview in InviteDetails.jsx
- Renders invitation template with all fields
- Images load from Cloudinary URLs using LazyImage component

---

### Endpoint 3: Update Invitation
**Request Path:** `PUT /api/invites/{inviteId}`

**Frontend Sends:**
```
Headers:
- Content-Type: application/json
- Authorization: Bearer [JWT-token]

Body Format: (partial update, only fields being changed)
{
  "coupleNames": "Rohan & Anaya Updated",
  "photos": ["url1", "url2", "url3"]  (entire new photos array)
}
```

**Backend Should:**
- Accept partial updates (don't require all fields)
- Merge updates with existing invitation
- Handle photos array replacement (new array replaces old one)
- Return HTTP 200 with updated invitation
- Return HTTP 404 if inviteId doesn't exist
- Return HTTP 401/403 for auth/permission issues

**Frontend Does Next:**
- Shows success notification
- Updates invitation preview in real-time

---

### Endpoint 4: Delete Invitation
**Request Path:** `DELETE /api/invites/{inviteId}`

**Frontend Sends:**
```
Headers:
- Authorization: Bearer [JWT-token]
```

**Backend Should:**
- Delete invitation and all associated data
- Return HTTP 200: `{ "success": true }`
- Return HTTP 404 if inviteId not found
- Return HTTP 401/403 for auth issues
- Note: Backend should NOT delete from Cloudinary (photos persist for future re-use)

**Frontend Does Next:**
- Removes invitation from user's list in Account.jsx
- Navigates back to dashboard

---

### Endpoint 5: Get User's Invitations (List)
**Request Path:** `GET /api/invites/my` or `GET /api/invites?user={userId}`

**Frontend Sends:**
```
Headers:
- Authorization: Bearer [JWT-token]
```

**Backend Should:**
- Return array of all invitations created by authenticated user
- HTTP 200 with body: `{ "invitations": [...], "total": 5 }`
- Return HTTP 401 if JWT invalid
- Filter by user automatically based on JWT token
- Include pagination if list is large

**Frontend Does Next:**
- Displays list in Account.jsx
- Shows invitation cards with thumbnail, couple name, date created
- User can edit or delete from this list

---

## Data Format Specifications

### Photos Array
**Storage Format:** TEXT[] in PostgreSQL (or equivalent array type)

**Example:**
```
[
  "https://res.cloudinary.com/djbxuk2xr/image/upload/v1234567/photo1.jpg",
  "https://res.cloudinary.com/djbxuk2xr/image/upload/v1234568/photo2.jpg",
  "https://res.cloudinary.com/djbxuk2xr/image/upload/v1234569/photo3.jpg"
]
```

**Constraints:**
- Each URL is string (Cloudinary CDN URL)
- Max 10 photos per invitation (enforce on backend)
- Empty array allowed (no photos yet)
- URLs are immutable once stored (don't modify URLs)

---

### Wedding Date
**Format Received:**
```
{
  "day": "17",
  "month": "May",
  "year": "2026"
}
```

**Store In Database:**
- Option 1: Three separate TEXT fields (day, month, year)
- Option 2: Single DATE field (convert "May 17, 2026" to DATE type)
- Option 3: Single TIMESTAMP field (store full date-time)

**Important:** Backend receives strings, not numbers or date objects

---

### Event Schedule
**Format Received:**
```
[
  {
    "eventName": "Sangeet",
    "date": "2026-05-16",
    "time": "6:00 PM",
    "venue": "Taj Palace"
  },
  {
    "eventName": "Wedding",
    "date": "2026-05-17",
    "time": "11:00 AM",
    "venue": "Garden Pavilion"
  }
]
```

**Store:** JSONB in PostgreSQL (or equivalent JSON type)

**Query Operations Needed:**
- Filter by eventName
- Sort by date
- Find events in date range

---

## Authentication & Authorization

### JWT Token
- **Source:** Frontend includes token in every request header
- **Format:** `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`
- **Backend Must:** 
  - Validate token signature
  - Check token expiration
  - Extract userId from token
  - Use userId to filter/authorize access
  - Return 401 if token invalid/expired
  - Return 403 if user trying to access someone else's data

### Token Management
- **Refresh:** Frontend will handle token refresh (not backend's concern for now)
- **Logout:** Frontend clears token from localStorage
- **Signup/Login:** Separate endpoints (already implemented, no changes)

---

## Error Handling

### Expected HTTP Status Codes

| Status | Scenario | Response |
|--------|----------|----------|
| 200 | Success | `{ "success": true, "data": {...} }` |
| 201 | Created | `{ "success": true, "inviteId": 1 }` |
| 400 | Missing fields | `{ "success": false, "error": "coupleNames required" }` |
| 401 | Invalid token | `{ "success": false, "error": "Unauthorized" }` |
| 403 | Access denied | `{ "success": false, "error": "Forbidden" }` |
| 404 | Not found | `{ "success": false, "error": "Invitation not found" }` |
| 500 | Server error | `{ "success": false, "error": "Internal server error" }` |

### Frontend Error Display
- 4xx errors → Shows user-friendly error message in red alert
- 5xx errors → Shows "Something went wrong, try again later"
- Frontend logs full error to console for debugging

---

## Database Requirements

### Invitations Table
**Must Have Columns:**
- `id` (Primary Key, auto-increment)
- `user_id` (Foreign Key to users table)
- `couple_names` (VARCHAR/TEXT)
- `groom_name` (VARCHAR/TEXT)
- `bride_name` (VARCHAR/TEXT)
- `mahal_name` (VARCHAR/TEXT)
- `wedding_date_day` (VARCHAR) or `wedding_date` (DATE)
- `wedding_date_month` (VARCHAR) or (if using DATE type)
- `wedding_date_year` (VARCHAR) or (if using DATE type)
- `venue_name` (VARCHAR/TEXT)
- `venue_city` (VARCHAR/TEXT)
- `template_id` (VARCHAR)
- `photos` (TEXT[] array or JSON)
- `event_schedule` (JSONB or JSON)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

**Indexes Recommended:**
- Index on `user_id` (filter by user)
- Index on `created_at` (sort by date)
- Index on `template_id` (group by template)

**Constraints:**
- `couple_names` NOT NULL
- `template_id` NOT NULL
- `user_id` NOT NULL (every invitation belongs to a user)
- `wedding_date_*` NOT NULL
- `photos` DEFAULT to empty array []

---

## Cloudinary Integration Notes

### Frontend Handles:
- All file uploads to Cloudinary (frontend has API credentials)
- Image URL generation
- Optimization parameters (quality, format, width, height)

### Backend Should NOT:
- Try to upload to Cloudinary (no backend credentials needed)
- Modify image URLs (store as-is)
- Delete from Cloudinary (only in database)
- Resize or transform images (Cloudinary handles on delivery)

### Why This Design:
- Reduces backend load (no file processing)
- Reduces backend storage (no files stored)
- Faster uploads (CDN is closer to users)
- Automatic optimization (Cloudinary's job)
- Cost reduction (free tier sufficient for scale)

---

## Testing Checklist for Backend Team

**Before API Goes Live:**

- [ ] Create invitation endpoint works (POST /api/invites)
- [ ] Can store photos as array (TEXT[] or JSON)
- [ ] Can retrieve invitation with photos (GET /api/invites/{id})
- [ ] Can update invitation photos (PUT /api/invites/{id})
- [ ] Can delete invitation (DELETE /api/invites/{id})
- [ ] Can list user's invitations (GET /api/invites/my)
- [ ] JWT authentication works on all endpoints
- [ ] Returns correct HTTP status codes
- [ ] Event schedule JSONB queries work (if applicable)
- [ ] Database indexes created for performance

**Test Data Format:**
Use exact format from "API Integration Expectations" section above when testing with cURL or Postman.

---

## Frontend Debugging Info

### Developer Console (F12 → Console Tab)
Frontend logs:
- "Upload successful" when image uploads to Cloudinary
- "Invitation created: inviteId=1" when API returns
- "Error: 401" if authentication fails
- Full error object if API request fails

### Network Tab (F12 → Network)
Look for:
- `POST /api/invites` requests
- Response status and headers
- Response body (invitation ID, errors)
- CORS errors (if any)

### Local Storage (F12 → Application → Local Storage)
Frontend stores:
- Draft invitation data (before user saves)
- JWT token
- User preferences

---

## Communication Protocol

### When Frontend Receives Success:
- HTTP 200/201 with `{ "success": true, ... }`
- Frontend proceeds to next page
- Displays confirmation message

### When Frontend Receives Error:
- HTTP 4xx/5xx with `{ "success": false, "error": "message" }`
- Frontend displays error alert to user
- Logs full error to console
- User can retry

### If API Not Responding:
- Frontend waits 10 seconds (timeout)
- Shows "Server not responding" error
- User can click "Retry"

---

## Deployment Notes

### Before Going to Production:

1. **Database:** Migrate with all required columns and indexes
2. **Environment Variables:** Set JWT_SECRET, PostgreSQL credentials
3. **CORS:** Allow requests from `https://your-domain.com`
4. **Security:** Enable HTTPS only, set secure JWT cookie options
5. **Rate Limiting:** Consider limiting uploads to 100 per user per day
6. **Monitoring:** Log all API errors to monitoring service
7. **Backups:** Set up daily PostgreSQL backups
8. **Testing:** Run full E2E flow with frontend before launch

---

## Questions Backend Team Should Ask

1. **JWT Expiration:** How long should tokens last? (recommend 24 hours)
2. **Rate Limiting:** Any limits on invitations per user? (recommend unlimited)
3. **Photo Deletion:** Should deleting invitation delete associated photos from Cloudinary? (no, reuse)
4. **Batch Operations:** Does frontend ever need to update multiple invitations at once? (no, one at a time)
5. **Webhooks:** Should frontend be notified when invitation is shared? (future feature, not now)

---

## Summary

**Frontend Changes:** Image upload to Cloudinary, form improvements, lazy loading
**Backend Requirement:** 5 REST API endpoints storing Cloudinary URLs in database
**No Backend File Storage Needed:** All files in Cloudinary, only URLs in database
**Authentication Required:** JWT token validation on all endpoints
**Database:** PostgreSQL with TEXT[] or JSONB for photos and event schedule

**Frontend is Ready:** Just build the 5 API endpoints and database schema above. Use exact data formats specified. All frontend code is complete and tested.

