# Quick Testing Reference Sheet

## 🚀 Quick Start (5 Minutes)

### Terminal 1: Start Backend

```bash
cd e:\Wedding-Website\wedding-invite
# Make sure PostgreSQL is running first
mvn spring-boot:run
```

### Terminal 2: Start Frontend

```bash
cd e:\Wedding-Website\wedding-invite
npm run dev
```

### Browser: Test Frontend Upload

```
1. Open: http://localhost:5173/test-cloudinary
2. Click: Upload image button
3. Select: Any JPG/PNG < 10MB
4. Verify: ✅ Progress bar shows
5. Verify: ✅ Image previews
6. Verify: ✅ URL displayed
7. Copy: Click "Copy URL" button
8. Open Console: F12 → Console tab
9. Verify: ✅ Logs show upload success
```

---

## 📋 Testing Checklist (Copy & Paste)

### Frontend Upload Test

```javascript
// Open browser console (F12) and paste:
console.log("Testing Cloudinary upload...");
console.log(
  "1. Image uploaded?",
  document.querySelector('img[alt="Uploaded"]') ? "✅ YES" : "❌ NO",
);
console.log(
  "2. URL displayed?",
  document.querySelector(".text-xs.text-gray-600") ? "✅ YES" : "❌ NO",
);
console.log(
  "3. Multiple uploads?",
  document.querySelectorAll('img[alt^="Upload"]').length,
  "images",
);
```

---

## 🔌 Test Backend with cURL

### Create Invitation

```bash
curl -X POST http://localhost:8080/api/invites \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "coupleNames": "Rohan & Anaya",
    "groomName": "Rohan",
    "brideName": "Anaya",
    "weddingDate": "18",
    "weddingMonth": "August",
    "weddingYear": "2026",
    "templateId": "template-1",
    "photos": ["https://res.cloudinary.com/djbxuk2xr/image/upload/v123/xyz.jpg"]
  }'

# Expected:
# {
#   "success": true,
#   "inviteId": 1,
#   "message": "Invitation created successfully"
# }
```

### Get Invitation

```bash
curl http://localhost:8080/api/invites/1 \
  -H "Authorization: Bearer test-token"

# Expected: Returns invitation with photos array
```

### Update Invitation

```bash
curl -X PUT http://localhost:8080/api/invites/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer test-token" \
  -d '{
    "coupleNames": "Rohan & Anaya - Updated"
  }'

# Expected: Returns updated invitation
```

### Delete Invitation

```bash
curl -X DELETE http://localhost:8080/api/invites/1 \
  -H "Authorization: Bearer test-token"

# Expected: { "success": true }
```

---

## 🗄️ Database Verification (PostgreSQL)

### Check Tables

```bash
# Connect
psql -U postgres -d wedding_invites

# List tables
\dt

# Show schema
\d invitations
```

### Query Data

```sql
-- Get all invitations
SELECT * FROM invitations;

-- Get specific invitation
SELECT id, couple_names, photos FROM invitations WHERE id = 1;

-- Check photo count
SELECT id, couple_names, array_length(photos, 1) as photo_count FROM invitations;

-- Check photos array content
SELECT photos FROM invitations WHERE id = 1;
```

### Expected Output

```
 id | couple_names    | photo_count
----+-----------------+-------------
 1  | Rohan & Anaya   |           2
```

---

## 🧪 Complete End-to-End Test Flow

```
┌─ STEP 1: Upload Photo (Frontend)
│  Open: http://localhost:5173/test-cloudinary
│  Action: Upload image
│  Result: ✅ URL displayed & copied
│
├─ STEP 2: Create Invitation (Backend)
│  Run: curl POST /api/invites with photos array
│  Result: ✅ Returns inviteId = 1
│
├─ STEP 3: Verify Database (PostgreSQL)
│  Run: psql SELECT * FROM invitations WHERE id = 1
│  Result: ✅ Photos array contains URL
│
├─ STEP 4: Retrieve Invitation (Backend)
│  Run: curl GET /api/invites/1
│  Result: ✅ Response includes photos array
│
└─ STEP 5: Display in Browser (Frontend)
   Action: Create fetch component
   Result: ✅ Images load from Cloudinary CDN
```

---

## 📊 Test Results Template

```
Date: _______________
Tester: _______________

FRONTEND TESTS
[ ] Upload component visible      ✅/❌
[ ] Image selection works         ✅/❌
[ ] Progress bar appears          ✅/❌
[ ] Image preview displays        ✅/❌
[ ] URL copied successfully       ✅/❌
[ ] Console shows success         ✅/❌

BACKEND TESTS
[ ] POST /api/invites works       ✅/❌ (inviteId: ___)
[ ] GET /api/invites/{id} works   ✅/❌
[ ] PUT /api/invites/{id} works   ✅/❌
[ ] DELETE /api/invites/{id} works ✅/❌
[ ] Error handling (401/404)      ✅/❌

DATABASE TESTS
[ ] Tables created                ✅/❌
[ ] Photos stored as array        ✅/❌
[ ] Data queryable                ✅/❌
[ ] Array operations work         ✅/❌

E2E TESTS
[ ] Upload → Save → Retrieve works ✅/❌
[ ] Images display from CDN        ✅/❌
[ ] Performance acceptable         ✅/❌

CLOUDINARY TESTS
[ ] Dashboard shows uploads        ✅/❌
[ ] Storage < 1 GB                 ✅/❌
[ ] Bandwidth < 10 GB              ✅/❌
[ ] No errors logged               ✅/❌
```

---

## 🔥 Common Issues & Quick Fixes

| Issue                   | Quick Fix                                           |
| ----------------------- | --------------------------------------------------- |
| **Upload fails**        | Check .env.local has VITE*CLOUDINARY*\*             |
| **Backend 401**         | Add `-H "Authorization: Bearer test-token"`         |
| **Database null**       | Verify photos array passed correctly                |
| **Images 404**          | Check URL in browser, verify in Cloudinary console  |
| **Backend won't start** | Kill process on 8080: `lsof -ti:8080 \| xargs kill` |
| **Tests fail**          | Run `mvn clean test` to reset                       |

---

## 📱 Browser DevTools Checklist

### Network Tab

```
1. Press F12 → Network tab
2. Reload page
3. Filter by "res.cloudinary.com"
4. Check each image:
   ✅ Status: 200 OK
   ✅ Size: < 500 KB
   ✅ Time: < 500 ms
   ✅ Format: webp or jpg
```

### Console Tab

```
1. Press F12 → Console tab
2. Look for:
   ✅ No red errors
   ✅ "Upload successful" messages
   ✅ URLs logged
   ✅ No CORS errors
```

### Application Tab (Local Storage)

```
1. Press F12 → Application tab
2. Left panel → Local Storage
3. Look for:
   ✅ localStorage has app data
   ✅ Token stored (if applicable)
```

---

## ⚡ Performance Benchmarks

| Metric            | Target  | Status |
| ----------------- | ------- | ------ |
| Image load time   | < 500ms |        |
| API response time | < 200ms |        |
| Database query    | < 100ms |        |
| Page load         | < 2s    |        |
| Upload time       | < 5s    |        |

---

## 🎯 Automated Testing

### Run All Tests

```bash
mvn test
```

### Run Specific Test

```bash
mvn test -Dtest=CloudinaryServiceTest
```

### Run with Coverage

```bash
mvn test jacoco:report
open target/site/jacoco/index.html
```

### Run Integration Tests

```bash
mvn test -Dtest=*ControllerTest
```

---

## 🚨 Emergency Debugging

### Check Backend Logs

```bash
# Terminal where backend is running
# Look for:
# - ERROR messages
# - Stack traces
# - Connection issues
```

### Check Database Connection

```bash
# Test connection
psql -U postgres -d wedding_invites -c "SELECT 1;"

# If fails, check PostgreSQL running
# Windows: Services app → PostgreSQL
# Mac: brew services list
# Linux: systemctl status postgresql
```

### Check Frontend Logs

```bash
# Browser Console (F12)
# Look for:
# - CORS errors
# - Network errors
# - Upload errors
```

### Reset Everything

```bash
# Kill backend
pkill -f "spring-boot"

# Clear database (if needed)
psql -U postgres -d wedding_invites -c "DELETE FROM invitations;"

# Restart backend
mvn spring-boot:run
```

---

## ✅ Sign-Off Checklist

Before deploying to production:

- [ ] All frontend tests passing
- [ ] All backend tests passing
- [ ] All database tests passing
- [ ] End-to-end flow working
- [ ] Performance benchmarks met
- [ ] Error handling tested
- [ ] Security validated
- [ ] Cloudinary dashboard shows expected usage
- [ ] No console errors
- [ ] Production .env variables set
- [ ] Backup created

---

## 📞 Support Resources

| Resource         | Link                                   |
| ---------------- | -------------------------------------- |
| Cloudinary Docs  | https://cloudinary.com/documentation   |
| Spring Boot Docs | https://spring.io/projects/spring-boot |
| PostgreSQL Docs  | https://www.postgresql.org/docs        |
| Testing Guide    | See TESTING_GUIDE.md                   |

---

**Ready to test? Start with STEP 1 above! 🚀**
