## Backend Integration for Cloudinary

### 🔗 API Endpoints

Your backend should have these endpoints:

#### 1. Save Invitation with Cloudinary URLs

```javascript
// POST /api/invites
// Body:
{
  "templateId": "template-1",
  "coupleNames": "Rohan & Anaya",
  "weddingDate": "18",
  "weddingMonth": "August",
  "weddingYear": "2026",
  "mahalName": "Palace Grounds",
  "venueAddress": "Bellary Rd, Bangalore",
  "venueCity": "Bangalore",
  "mapUrl": "https://maps.google.com/...",

  // ✨ NEW: Cloudinary URLs instead of files
  "photos": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/xyz.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/abc.jpg"
  ],

  "scheduleItems": [
    { "time": "09:00", "title": "Mehendi" },
    { "time": "11:00", "title": "Haldi" }
  ]
}

// Response:
{
  "success": true,
  "inviteId": "invite-123",
  "message": "Invitation saved successfully"
}
```

#### 2. Fetch Invitation (Returns Cloudinary URLs)

```javascript
// GET /api/invites/invite-123
// Response:
{
  "_id": "invite-123",
  "coupleNames": "Rohan & Anaya",
  "photos": [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/xyz.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/abc.jpg"
  ],
  "templateId": "template-1",
  // ... other fields
}
```

#### 3. Delete Image from Cloudinary (Protected)

```javascript
// DELETE /api/images/delete
// Body:
{
  "publicId": "xyz" // Extract from Cloudinary URL
}

// Response:
{
  "success": true,
  "message": "Image deleted from Cloudinary"
}
```

---

### 🔐 Backend Code Examples

#### Node.js + Express Example

```javascript
const express = require("express");
const cloudinary = require("cloudinary").v2;
const router = express.Router();

// Configure Cloudinary (use env variables)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// POST - Save invitation with Cloudinary URLs
router.post("/api/invites", authenticateUser, async (req, res) => {
  try {
    const { coupleNames, photos, scheduleItems, weddingDate, ...rest } =
      req.body;

    const invitation = new Invitation({
      userId: req.user.id,
      coupleNames,
      photos, // ✨ Just store the URLs
      scheduleItems,
      weddingDate,
      ...rest,
    });

    await invitation.save();
    res.json({ success: true, inviteId: invitation._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE - Remove image from Cloudinary
router.delete("/api/images/delete", authenticateUser, async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: "publicId required" });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(publicId);

    res.json({ success: true, message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

#### Python + Flask Example

```python
from flask import request, jsonify
import cloudinary
import cloudinary.uploader

cloudinary.config(
    cloud_name=os.getenv('CLOUDINARY_CLOUD_NAME'),
    api_key=os.getenv('CLOUDINARY_API_KEY'),
    api_secret=os.getenv('CLOUDINARY_API_SECRET')
)

@app.route('/api/invites', methods=['POST'])
@require_auth
def save_invitation():
    data = request.get_json()

    invitation = Invitation(
        user_id=current_user.id,
        couple_names=data.get('coupleNames'),
        photos=data.get('photos'),  # ✨ Just store URLs
        schedule_items=data.get('scheduleItems'),
        # ... other fields
    )

    db.session.add(invitation)
    db.session.commit()

    return jsonify({ 'success': True, 'inviteId': invitation.id })

@app.route('/api/images/delete', methods=['DELETE'])
@require_auth
def delete_image():
    data = request.get_json()
    public_id = data.get('publicId')

    if not public_id:
        return jsonify({ 'error': 'publicId required' }), 400

    cloudinary.uploader.destroy(public_id)
    return jsonify({ 'success': True })
```

#### Java + Spring Boot + PostgreSQL Example

**Complete implementation available in:** [JAVA_BACKEND_POSTGRESQL_GUIDE.md](./JAVA_BACKEND_POSTGRESQL_GUIDE.md)

Quick example:

```java
// Service
@Service
@RequiredArgsConstructor
public class InvitationService {
    private final InvitationRepository repo;

    @Transactional
    public Invitation createInvitation(
        Long userId,
        String coupleNames,
        String[] photos, // ✨ Cloudinary URLs
        String scheduleItems
    ) {
        Invitation invitation = Invitation.builder()
            .userId(userId)
            .coupleNames(coupleNames)
            .photos(photos) // ✨ Store URLs
            .scheduleItems(scheduleItems)
            .build();

        return repo.save(invitation);
    }
}

// Controller
@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
public class InvitationController {
    private final InvitationService service;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createInvitation(
        @RequestBody CreateInvitationRequest request,
        @RequestHeader("Authorization") String auth
    ) {
        Invitation invitation = service.createInvitation(
            extractUserId(auth),
            request.getCoupleNames(),
            request.getPhotos(),
            request.getScheduleItems()
        );

        return ResponseEntity.ok(Map.of(
            "success", true,
            "inviteId", invitation.getId()
        ));
    }
}
```

**Entity with PostgreSQL:**

```java
@Entity
@Table(name = "invitations")
public class Invitation {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String coupleNames;

    @Column(columnDefinition = "TEXT[]")
    private String[] photos; // ✨ Cloudinary URLs

    @Column(columnDefinition = "jsonb")
    private String scheduleItems;
}
```

---

### 📊 Database Schema

#### MongoDB (Mongoose)

```javascript
const invitationSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  templateId: {
    type: String,
    required: true,
  },
  coupleNames: String,

  // ✨ Store Cloudinary URLs as strings
  photos: [
    {
      type: String, // Full Cloudinary URL
      required: false,
    },
  ],

  scheduleItems: [
    {
      time: String,
      title: String,
    },
  ],

  weddingDate: String,
  weddingMonth: String,
  weddingYear: String,

  mahalName: String,
  venueAddress: String,
  venueCity: String,
  mapUrl: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Invitation", invitationSchema);
```

#### PostgreSQL (SQL)

```sql
CREATE TABLE invitations (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  template_id VARCHAR(100),
  couple_names VARCHAR(255),
  photos TEXT[], -- Array of Cloudinary URLs
  schedule_items JSONB,
  wedding_date VARCHAR(10),
  wedding_month VARCHAR(20),
  wedding_year VARCHAR(4),
  mahal_name VARCHAR(255),
  venue_address TEXT,
  venue_city VARCHAR(100),
  map_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_invitations_user_id ON invitations(user_id);
```

---

### 🔄 Update Existing Invitation

```javascript
// PUT /api/invites/invite-123
router.put("/api/invites/:id", authenticateUser, async (req, res) => {
  try {
    const { photos, ...updateData } = req.body;

    // If photos array is provided, replace old ones
    if (photos) {
      updateData.photos = photos;
    }

    const invitation = await Invitation.findByIdAndUpdate(
      req.params.id,
      { ...updateData, updatedAt: new Date() },
      { new: true },
    );

    res.json({ success: true, invitation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

### 🔍 Extract publicId from Cloudinary URL

When you need to delete an image, extract the public ID:

```javascript
// Cloudinary URL format:
// https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}

function extractPublicId(cloudinaryUrl) {
  // Example: "https://res.cloudinary.com/mycloud/image/upload/v123/xyz.jpg"
  const parts = cloudinaryUrl.split("/");
  const fileWithExtension = parts[parts.length - 1];
  const publicId = fileWithExtension.split(".")[0];
  return publicId;
}

// Usage:
const url = "https://res.cloudinary.com/mycloud/image/upload/v123/xyz.jpg";
const publicId = extractPublicId(url); // Returns: "xyz"
```

---

### ⚙️ Environment Variables (Backend)

```bash
# .env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

### 📈 Benefits of This Approach

| Aspect           | Traditional                     | With Cloudinary         |
| ---------------- | ------------------------------- | ----------------------- |
| **Storage**      | Backend server (limited)        | Cloud (unlimited)       |
| **Bandwidth**    | From your server                | Global CDN              |
| **Upload Speed** | Direct to server                | Direct to CDN           |
| **File Size**    | As-is                           | Automatically optimized |
| **Scaling**      | Need more server space          | Automatic               |
| **Cost**         | Expensive (storage + bandwidth) | Cheaper (CDN + storage) |

---

### ✅ Migration Checklist

- [ ] Create Cloudinary account and get credentials
- [ ] Add `.env` variables to backend
- [ ] Update invitation schema (photos field = array of URLs)
- [ ] Create `/api/images/delete` endpoint
- [ ] Test upload from frontend → save to backend
- [ ] Verify database stores only URLs (not files)
- [ ] Delete old file upload handling code
- [ ] Test retrieve and display Cloudinary images
- [ ] Update Account page to use Cloudinary URLs
