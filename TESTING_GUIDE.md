# Complete Testing Guide: Cloudinary + Java Backend + PostgreSQL

## 🎯 Testing Strategy

```
Level 1: Cloudinary Upload (Frontend)
       ↓
Level 2: Backend API Endpoints (Postman/cURL)
       ↓
Level 3: Database Verification (PostgreSQL)
       ↓
Level 4: End-to-End Flow (Browser)
       ↓
Level 5: Production Ready ✅
```

---

## **Level 1: Test Cloudinary Upload (Frontend)**

### Setup .env.local

```bash
# .env.local
VITE_CLOUDINARY_CLOUD_NAME=djbxuk2xr
VITE_CLOUDINARY_UPLOAD_PRESET=inviteque
VITE_CLOUDINARY_API_KEY=312225164316173
```

### Test in React Component

```jsx
// src/pages/Test.jsx
import { CloudinaryImageUpload } from "../components/CloudinaryImageUpload";
import { useState } from "react";

export default function TestCloudinary() {
  const [uploadedUrl, setUploadedUrl] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleUpload = (imageData) => {
    console.log("✅ Upload successful:", imageData);
    console.log("URL:", imageData.url);
    console.log("Public ID:", imageData.publicId);
    console.log("Size:", imageData.size, "bytes");

    setUploadedUrl(imageData.url);
    setUploadedImages((prev) => [...prev, imageData.url]);
  };

  const handleError = (error) => {
    console.error("❌ Upload error:", error);
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Cloudinary Upload Test</h1>

      {/* Upload Component */}
      <CloudinaryImageUpload
        onUpload={handleUpload}
        onError={handleError}
        maxFiles={5}
        currentCount={uploadedImages.length}
      />

      {/* Display Uploaded URL */}
      {uploadedUrl && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">✅ Upload Successful!</h2>
          <div className="bg-gray-100 p-4 rounded-lg space-y-2">
            <p>
              <strong>URL:</strong>
            </p>
            <p className="break-all text-sm">{uploadedUrl}</p>
            <button
              onClick={() => navigator.clipboard.writeText(uploadedUrl)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Copy URL
            </button>
          </div>

          {/* Display Image */}
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="w-48 h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Display All Uploaded Images */}
      {uploadedImages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-bold">
            All Uploads ({uploadedImages.length})
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {uploadedImages.map((url, index) => (
              <div key={index} className="space-y-2">
                <img
                  src={url}
                  alt={`Upload ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-600 truncate">{url}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

### Add Test Route

```jsx
// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TestCloudinary from "./pages/Test";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/test-cloudinary" element={<TestCloudinary />} />
        {/* ... other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### Test Steps

1. Run frontend: `npm run dev`
2. Open: `http://localhost:5173/test-cloudinary`
3. Click upload button
4. Select an image
5. Check:
   - ✅ Progress bar appears
   - ✅ Image uploads
   - ✅ URL displays
   - ✅ Image previews
6. Open browser console (F12) and check logs:
   ```
   ✅ Upload successful: {
     url: "https://res.cloudinary.com/...",
     publicId: "xyz",
     size: 123456
   }
   ```

---

## **Level 2: Test Backend API with Postman**

### 2.1 Setup Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new Collection: `Wedding Invite API`
3. Add environment variable: `BASE_URL = http://localhost:8080`

### 2.2 Test CREATE Invitation Endpoint

**Request:**

```
POST http://localhost:8080/api/invites
Content-Type: application/json
Authorization: Bearer test-token

Body (JSON):
{
  "templateId": "template-1",
  "coupleNames": "Rohan & Anaya",
  "groomName": "Rohan",
  "brideName": "Anaya",
  "weddingDate": "18",
  "weddingMonth": "August",
  "weddingYear": "2026",
  "mahalName": "Palace Grounds",
  "venueAddress": "Bellary Rd",
  "venueCity": "Bangalore",
  "mapUrl": "https://maps.google.com/...",
  "photos": [
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v124/abc.jpg"
  ],
  "scheduleItems": "[{\"time\": \"09:00\", \"title\": \"Mehendi\"}]"
}
```

**Expected Response:**

```json
{
  "success": true,
  "inviteId": 1,
  "message": "Invitation created successfully"
}
```

**Verification:**

- ✅ HTTP 201 Created
- ✅ Response contains inviteId
- ✅ Check backend console for logs

### 2.3 Test GET Invitation Endpoint

**Request:**

```
GET http://localhost:8080/api/invites/1
Authorization: Bearer test-token
```

**Expected Response:**

```json
{
  "id": 1,
  "userId": 1,
  "templateId": "template-1",
  "coupleNames": "Rohan & Anaya",
  "photos": [
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v124/abc.jpg"
  ],
  "createdAt": "2026-05-17T10:30:00",
  "updatedAt": "2026-05-17T10:30:00"
}
```

### 2.4 Test UPDATE Invitation Endpoint

**Request:**

```
PUT http://localhost:8080/api/invites/1
Content-Type: application/json
Authorization: Bearer test-token

Body (JSON):
{
  "coupleNames": "Rohan & Anaya Updated",
  "photos": [
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v124/abc.jpg",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v125/new.jpg"
  ]
}
```

**Expected Response:**

```json
{
  "id": 1,
  "coupleNames": "Rohan & Anaya Updated",
  "updatedAt": "2026-05-17T10:35:00"
}
```

### 2.5 Test DELETE Invitation Endpoint

**Request:**

```
DELETE http://localhost:8080/api/invites/1
Authorization: Bearer test-token
```

**Expected Response:**

```json
{
  "success": true
}
```

---

## **Level 3: Database Verification (PostgreSQL)**

### 3.1 Connect to PostgreSQL

```bash
# Using psql
psql -U postgres -d wedding_invites

# Or use pgAdmin
# http://localhost:5050
```

### 3.2 Verify Tables Created

```sql
-- List all tables
\dt

-- Should show:
-- public | invitations | table | postgres
-- public | users       | table | postgres

-- Describe invitations table
\d invitations

-- Should show columns:
-- id | user_id | couple_names | photos | schedule_items | created_at | updated_at
```

### 3.3 Query Invitations

```sql
-- Get all invitations
SELECT * FROM invitations;

-- Get specific invitation
SELECT id, couple_names, photos FROM invitations WHERE id = 1;

-- Check photos array
SELECT
  id,
  couple_names,
  photos,
  array_length(photos, 1) as photo_count
FROM invitations
WHERE id = 1;

-- Output should show:
-- id | couple_names | photos | photo_count
-- 1  | Rohan & Anaya | {"https://res.cloudinary.com/...", "https://res.cloudinary.com/..."} | 2
```

### 3.4 Verify Data Types

```sql
-- Check if photos stored as TEXT array
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invitations';

-- Check schedule_items is JSONB
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'invitations'
AND column_name = 'schedule_items';
```

### 3.5 Test Array Operations

```sql
-- Add new photo to existing invitation
UPDATE invitations
SET photos = array_append(photos, 'https://res.cloudinary.com/djbxuk2xr/image/upload/v999/new.jpg')
WHERE id = 1;

-- Remove specific photo
UPDATE invitations
SET photos = array_remove(photos, 'https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg')
WHERE id = 1;

-- Get count of photos
SELECT array_length(photos, 1) as total_photos FROM invitations WHERE id = 1;
```

---

## **Level 4: End-to-End Flow Testing**

### Complete Test Scenario

```
Step 1: Upload Photo in Frontend
├─ Go to /test-cloudinary
├─ Upload image
└─ Copy URL from console

Step 2: Create Invitation via API
├─ Open Postman
├─ POST /api/invites
├─ Paste Cloudinary URL in photos array
└─ Send request → Note inviteId

Step 3: Verify in Database
├─ psql -d wedding_invites
├─ SELECT * FROM invitations WHERE id = {inviteId}
└─ Verify photos array contains URL

Step 4: Retrieve via API
├─ GET /api/invites/{inviteId}
└─ Verify photos array in response

Step 5: Display in Frontend
├─ Create component to fetch and display
├─ Verify images load from CDN
└─ Check Network tab (images served from Cloudinary)
```

### Step-by-Step Test

#### Step 1: Upload Photo (Frontend)

```jsx
// Test page showing:
// - Upload component
// - Uploaded URL
// - Preview image
// ✅ Expected: Image displays, URL copied
```

#### Step 2: Create Invitation (Backend)

```bash
curl -X POST http://localhost:8080/api/invites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "coupleNames": "Rohan & Anaya",
    "photos": ["https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg"],
    "templateId": "template-1"
  }'

# ✅ Expected: Returns inviteId
```

#### Step 3: Verify Database

```sql
psql -d wedding_invites -c "SELECT photos FROM invitations WHERE id = 1;"

-- ✅ Expected:
-- {"https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg"}
```

#### Step 4: Retrieve via API

```bash
curl http://localhost:8080/api/invites/1 \
  -H "Authorization: Bearer test-token"

# ✅ Expected: JSON with photos array
```

#### Step 5: Display in Browser

```jsx
// Component fetches and displays photos
const [invitation, setInvitation] = useState(null);

useEffect(() => {
  fetch("/api/invites/1")
    .then((r) => r.json())
    .then((data) => setInvitation(data));
}, []);

return (
  <div>
    {invitation?.photos.map((url) => (
      <img src={url} alt="photo" />
    ))}
  </div>
);

// ✅ Expected: Images load from Cloudinary CDN
```

---

## **Level 5: Automated Testing (Unit & Integration)**

### 5.1 Unit Test: CloudinaryService

```java
// src/test/java/com/inviteque/service/CloudinaryServiceTest.java
package com.inviteque.service;

import com.cloudinary.Cloudinary;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CloudinaryServiceTest {

    @Mock
    private Cloudinary cloudinary;

    @InjectMocks
    private CloudinaryService cloudinaryService;

    @Test
    void testUploadImage_Success() throws IOException {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.jpg",
            "image/jpeg",
            "test content".getBytes()
        );

        Map<String, Object> cloudinaryResponse = Map.of(
            "secure_url", "https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg",
            "public_id", "xyz",
            "bytes", 123456,
            "width", 800,
            "height": 600
        );

        when(cloudinary.uploader().upload(any(), any()))
            .thenReturn(cloudinaryResponse);

        // Act
        Map<String, Object> result = cloudinaryService.uploadImage(file);

        // Assert
        assertNotNull(result);
        assertEquals("https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg",
                     result.get("secure_url"));
    }

    @Test
    void testUploadImage_FileTooLarge() {
        // Arrange
        byte[] largeContent = new byte[11 * 1024 * 1024]; // 11 MB
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "large.jpg",
            "image/jpeg",
            largeContent
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            cloudinaryService.uploadImage(file);
        });
    }

    @Test
    void testUploadImage_InvalidFileType() {
        // Arrange
        MockMultipartFile file = new MockMultipartFile(
            "file",
            "test.txt",
            "text/plain",
            "content".getBytes()
        );

        // Act & Assert
        assertThrows(IllegalArgumentException.class, () -> {
            cloudinaryService.uploadImage(file);
        });
    }
}
```

### 5.2 Integration Test: InvitationController

```java
// src/test/java/com/inviteque/controller/InvitationControllerTest.java
package com.inviteque.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.inviteque.dto.CreateInvitationRequest;
import com.inviteque.service.InvitationService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@SpringBootTest
@AutoConfigureMockMvc
class InvitationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private InvitationService invitationService;

    @Test
    void testCreateInvitation_Success() throws Exception {
        // Arrange
        CreateInvitationRequest request = CreateInvitationRequest.builder()
            .coupleNames("Rohan & Anaya")
            .templateId("template-1")
            .photos(new String[]{
                "https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg"
            })
            .build();

        // Act & Assert
        mockMvc.perform(post("/api/invites")
            .contentType(MediaType.APPLICATION_JSON)
            .header("Authorization", "Bearer test-token")
            .content(objectMapper.writeValueAsString(request)))
            .andExpect(status().isCreated())
            .andExpect(jsonPath("$.success").value(true))
            .andExpect(jsonPath("$.inviteId").exists());
    }

    @Test
    void testGetInvitation_NotFound() throws Exception {
        // Act & Assert
        mockMvc.perform(get("/api/invites/999")
            .header("Authorization", "Bearer test-token"))
            .andExpect(status().isNotFound());
    }
}
```

### 5.3 Run Tests

```bash
# Run all tests
mvn test

# Run specific test class
mvn test -Dtest=CloudinaryServiceTest

# Run with coverage
mvn test jacoco:report
# Report at: target/site/jacoco/index.html
```

---

## **Testing Checklist**

### Frontend ✅

- [ ] Test Cloudinary upload component
- [ ] Verify image uploads successfully
- [ ] Check console logs for URL
- [ ] Verify image preview displays
- [ ] Test error handling (file too large, wrong type)

### Backend ✅

- [ ] POST /api/invites - Create invitation
- [ ] GET /api/invites/{id} - Retrieve invitation
- [ ] GET /api/invites/my - Get user invitations
- [ ] PUT /api/invites/{id} - Update invitation
- [ ] DELETE /api/invites/{id} - Delete invitation
- [ ] DELETE /api/images/delete - Delete from Cloudinary
- [ ] Verify error responses (401, 404, 400)

### Database ✅

- [ ] Tables created correctly
- [ ] Photos stored as TEXT array
- [ ] Schedule items stored as JSONB
- [ ] Indexes created
- [ ] Can query invitations
- [ ] Array operations work (append, remove)

### Integration ✅

- [ ] Upload → Backend → Database flow works
- [ ] Database → API → Frontend flow works
- [ ] Images display from Cloudinary CDN
- [ ] Can update and delete invitations
- [ ] Error cases handled gracefully

### Performance ✅

- [ ] Images load < 1 second
- [ ] API responses < 200ms
- [ ] Database queries < 100ms
- [ ] No memory leaks

---

## **Troubleshooting**

### Issue: Upload fails

```
❌ Error: "Upload failed"
```

**Solutions:**

- Check environment variables set correctly
- Verify Cloudinary credentials in .env.local
- Check file size < 10MB
- Check file is valid image type
- Check browser console for detailed error

### Issue: Backend returns 401

```
❌ Error: "Unauthorized"
```

**Solutions:**

- Add Authorization header with token
- Check JWT token is valid
- Verify authentication middleware

### Issue: Database shows NULL photos

```
❌ Photos: null
```

**Solutions:**

- Check photos array passed correctly
- Verify TEXT[] column type
- Check SQL insert statement

### Issue: Images not loading from CDN

```
❌ 404 from Cloudinary
```

**Solutions:**

- Verify URL is correct
- Check Cloudinary account has images
- Try URL in browser directly
- Check public_id exists

### Issue: Test fails with "Connection refused"

```
❌ Error: "Connection refused" to localhost:8080
```

**Solutions:**

- Ensure backend is running: `mvn spring-boot:run`
- Check port 8080 is available
- Verify no firewall blocking

---

## **Quick Test Commands**

```bash
# Start Backend
mvn spring-boot:run

# Start Frontend
npm run dev

# Test Frontend Upload
# Navigate to http://localhost:5173/test-cloudinary

# Test Backend (via cURL)
curl -X POST http://localhost:8080/api/invites \
  -H "Content-Type: application/json" \
  -d '{"coupleNames":"Test","photos":["https://res.cloudinary.com/..."]}'

# Test Database
psql -d wedding_invites -c "SELECT * FROM invitations;"

# Run Unit Tests
mvn test

# Run Integration Tests
mvn test -Dtest=*ControllerTest

# Check Cloudinary Usage
# Visit https://cloudinary.com/console/dashboard
```

---

## **Performance Monitoring**

### Browser DevTools

1. Open F12
2. Go to Network tab
3. Filter by Cloudinary URLs
4. Check:
   - ✅ Load time < 500ms
   - ✅ File size optimized
   - ✅ Format: WebP when possible

### Backend Monitoring

1. Check logs: `mvn spring-boot:run` output
2. Monitor: HTTP response times
3. Verify: No errors in console

### Cloudinary Dashboard

1. Visit: https://cloudinary.com/console/dashboard
2. Check:
   - ✅ Storage used: < 1 GB
   - ✅ Bandwidth used: < 10 GB
   - ✅ Upload count: Expected number
   - ✅ No errors

---

## **Next Steps**

1. ✅ Setup development environment
2. ✅ Run Level 1-2 tests (Frontend & API)
3. ✅ Run Level 3 tests (Database)
4. ✅ Run Level 4 tests (End-to-End)
5. ✅ Run Level 5 tests (Automated)
6. ✅ Deploy to production
7. ✅ Monitor performance

All tests passing = **Ready for Production!** 🚀
