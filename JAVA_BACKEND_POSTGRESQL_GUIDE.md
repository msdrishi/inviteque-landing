# Java Backend Integration with Cloudinary & PostgreSQL

## ✅ Free Tier Analysis for Your Use Case

### Your Plan Details

- **Cloud Name:** djbxuk2xr
- **Upload Preset:** inviteque
- **Storage:** 25 GB/month
- **Bandwidth:** 100 GB/month
- **Max image file:** 10 MB
- **Cost:** FREE ✨

### Your Wedding Invite Use Case

```
Typical Scenario:
├─ Avg invitation: 8-10 photos
├─ Avg photo after upload: 500 KB (compressed by Cloudinary)
├─ Per invitation: 8 × 0.5 MB = 4 MB
├─ Per 100 invitations: 400 MB
└─ Per 1000 invitations: 4 GB

Monthly Usage (Estimate):
├─ Storage used: ~1-2 GB/month (well under 25 GB limit)
├─ Bandwidth: ~10-20 GB/month (well under 100 GB limit)
└─ Cost: $0/month 🎉

Scaling Potential:
├─ Can handle: 5,000+ invitations/month
├─ Storage: Still within 25 GB
├─ Before needing paid tier: ~10,000+ invitations
└─ Recommendation: Stay on FREE tier for at least 1 year
```

### ✅ YES, Free Tier is Perfect!

Your use case requires minimal storage and bandwidth. The free tier can handle thousands of invitations monthly without any issues.

---

## 🔧 Java Backend Setup

### 1. Maven Dependencies

```xml
<!-- pom.xml -->
<dependency>
    <groupId>com.cloudinary</groupId>
    <artifactId>cloudinary-http44</artifactId>
    <version>1.30.0</version>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<dependency>
    <groupId>org.postgresql</groupId>
    <artifactId>postgresql</artifactId>
    <version>42.7.0</version>
</dependency>

<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
</dependency>
```

### 2. Application Configuration

```yaml
# application.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/wedding_invites
    username: postgres
    password: your_password
    driver-class-name: org.postgresql.Driver

  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        jdbc:
          batch_size: 20
        order_inserts: true

  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 50MB

# Cloudinary Config
cloudinary:
  cloud-name: djbxuk2xr
  api-key: 312225164316173
  api-secret: ${CLOUDINARY_API_SECRET}
```

### 3. Cloudinary Configuration Bean

```java
// config/CloudinaryConfig.java
package com.inviteque.config;

import com.cloudinary.Cloudinary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Bean
    public Cloudinary cloudinary() {
        Map<String, Object> config = new HashMap<>();
        config.put("cloud_name", cloudName);
        config.put("api_key", apiKey);
        config.put("api_secret", apiSecret);
        return new Cloudinary(config);
    }
}
```

### 4. Entity Model (JPA)

```java
// entity/Invitation.java
package com.inviteque.entity;

import lombok.*;
import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "invitations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String templateId;

    @Column(name = "couple_names")
    private String coupleNames;

    @Column(name = "groom_name")
    private String groomName;

    @Column(name = "bride_name")
    private String brideName;

    @Column(name = "wedding_date")
    private String weddingDate;

    @Column(name = "wedding_month")
    private String weddingMonth;

    @Column(name = "wedding_year")
    private String weddingYear;

    @Column(name = "mahal_name")
    private String mahalName;

    @Column(name = "venue_address")
    private String venueAddress;

    @Column(name = "venue_city")
    private String venueCity;

    @Column(name = "map_url")
    private String mapUrl;

    // ✨ Store Cloudinary URLs as JSON array
    @Column(columnDefinition = "TEXT[]")
    private String[] photos;

    @Column(columnDefinition = "jsonb")
    private String scheduleItems;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
```

### 5. Service Layer

```java
// service/CloudinaryService.java
package com.inviteque.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService {

    private final Cloudinary cloudinary;

    /**
     * Upload image to Cloudinary
     * Returns optimized URL for web
     */
    public Map<String, Object> uploadImage(MultipartFile file) throws IOException {
        if (!file.getContentType().startsWith("image/")) {
            throw new IllegalArgumentException("Only image files allowed");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("File size must be less than 10MB");
        }

        try {
            Map<String, Object> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "resource_type", "auto",
                    "folder", "wedding-invites",
                    "quality", "auto"
                )
            );

            log.info("Image uploaded successfully: {}", result.get("public_id"));
            return result;

        } catch (IOException e) {
            log.error("Error uploading to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Upload failed: " + e.getMessage());
        }
    }

    /**
     * Get optimized image URL with transformations
     */
    public String getOptimizedUrl(String publicId, int width, int height) {
        return cloudinary.url().transformation(
            com.cloudinary.transformation.Transformation.class
                .new()
                .width(width)
                .height(height)
                .crop("fill")
                .quality("auto")
                .fetchFormat("webp")
        ).generate(publicId);
    }

    /**
     * Delete image from Cloudinary
     */
    public void deleteImage(String publicId) throws IOException {
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            log.info("Image deleted successfully: {}", publicId);
        } catch (IOException e) {
            log.error("Error deleting from Cloudinary: {}", e.getMessage());
            throw e;
        }
    }
}
```

```java
// service/InvitationService.java
package com.inviteque.service;

import com.inviteque.entity.Invitation;
import com.inviteque.repository.InvitationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final CloudinaryService cloudinaryService;
    private final ObjectMapper objectMapper;

    /**
     * Create new invitation with photos
     */
    @Transactional
    public Invitation createInvitation(
        Long userId,
        String templateId,
        String coupleNames,
        String groomName,
        String brideName,
        String weddingDate,
        String weddingMonth,
        String weddingYear,
        String mahalName,
        String venueAddress,
        String venueCity,
        String mapUrl,
        String[] photos, // ✨ Cloudinary URLs
        String scheduleItems
    ) {
        Invitation invitation = Invitation.builder()
            .userId(userId)
            .templateId(templateId)
            .coupleNames(coupleNames)
            .groomName(groomName)
            .brideName(brideName)
            .weddingDate(weddingDate)
            .weddingMonth(weddingMonth)
            .weddingYear(weddingYear)
            .mahalName(mahalName)
            .venueAddress(venueAddress)
            .venueCity(venueCity)
            .mapUrl(mapUrl)
            .photos(photos) // ✨ Store URLs
            .scheduleItems(scheduleItems)
            .build();

        Invitation saved = invitationRepository.save(invitation);
        log.info("Invitation created: {}", saved.getId());
        return saved;
    }

    /**
     * Update invitation
     */
    @Transactional
    public Invitation updateInvitation(Long id, Invitation updates) {
        Invitation existing = invitationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (updates.getCoupleNames() != null) {
            existing.setCoupleNames(updates.getCoupleNames());
        }
        if (updates.getPhotos() != null) {
            existing.setPhotos(updates.getPhotos());
        }
        if (updates.getScheduleItems() != null) {
            existing.setScheduleItems(updates.getScheduleItems());
        }

        Invitation saved = invitationRepository.save(existing);
        log.info("Invitation updated: {}", id);
        return saved;
    }

    /**
     * Get invitation by ID
     */
    public Invitation getInvitation(Long id) {
        return invitationRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Invitation not found"));
    }

    /**
     * Get all invitations for user
     */
    public List<Invitation> getUserInvitations(Long userId) {
        return invitationRepository.findByUserId(userId);
    }

    /**
     * Delete invitation
     */
    @Transactional
    public void deleteInvitation(Long id) {
        invitationRepository.deleteById(id);
        log.info("Invitation deleted: {}", id);
    }
}
```

### 6. Controller

```java
// controller/InvitationController.java
package com.inviteque.controller;

import com.inviteque.dto.CreateInvitationRequest;
import com.inviteque.entity.Invitation;
import com.inviteque.service.InvitationService;
import com.inviteque.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/invites")
@RequiredArgsConstructor
@Slf4j
public class InvitationController {

    private final InvitationService invitationService;
    private final CloudinaryService cloudinaryService;

    /**
     * Create invitation
     * POST /api/invites
     */
    @PostMapping
    public ResponseEntity<Map<String, Object>> createInvitation(
        @RequestBody CreateInvitationRequest request,
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);

            Invitation invitation = invitationService.createInvitation(
                userId,
                request.getTemplateId(),
                request.getCoupleNames(),
                request.getGroomName(),
                request.getBrideName(),
                request.getWeddingDate(),
                request.getWeddingMonth(),
                request.getWeddingYear(),
                request.getMahalName(),
                request.getVenueAddress(),
                request.getVenueCity(),
                request.getMapUrl(),
                request.getPhotos(), // ✨ Cloudinary URLs
                request.getScheduleItems()
            );

            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                    "success", true,
                    "inviteId", invitation.getId(),
                    "message", "Invitation created successfully"
                ));

        } catch (Exception e) {
            log.error("Error creating invitation: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get invitation
     * GET /api/invites/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Invitation> getInvitation(@PathVariable Long id) {
        try {
            Invitation invitation = invitationService.getInvitation(id);
            return ResponseEntity.ok(invitation);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Get user's invitations
     * GET /api/invites/my
     */
    @GetMapping("/my")
    public ResponseEntity<List<Invitation>> getUserInvitations(
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            List<Invitation> invitations = invitationService.getUserInvitations(userId);
            return ResponseEntity.ok(invitations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    /**
     * Update invitation
     * PUT /api/invites/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Invitation> updateInvitation(
        @PathVariable Long id,
        @RequestBody Invitation updates,
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            Invitation updated = invitationService.updateInvitation(id, updates);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Delete invitation
     * DELETE /api/invites/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteInvitation(
        @PathVariable Long id,
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            invitationService.deleteInvitation(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Delete image from Cloudinary
     * DELETE /api/images/delete
     */
    @DeleteMapping("/delete")
    public ResponseEntity<Map<String, Object>> deleteImage(
        @RequestBody Map<String, String> request,
        @RequestHeader("Authorization") String authHeader
    ) {
        try {
            Long userId = extractUserIdFromToken(authHeader);
            String publicId = request.get("publicId");

            cloudinaryService.deleteImage(publicId);
            return ResponseEntity.ok(Map.of("success", true));

        } catch (Exception e) {
            log.error("Error deleting image: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    // Helper method to extract user ID from JWT token
    private Long extractUserIdFromToken(String authHeader) {
        // TODO: Implement JWT token parsing
        // This should extract user ID from Bearer token
        return 1L; // Placeholder
    }
}
```

### 7. Repository

```java
// repository/InvitationRepository.java
package com.inviteque.repository;

import com.inviteque.entity.Invitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByUserId(Long userId);
}
```

### 8. DTO

```java
// dto/CreateInvitationRequest.java
package com.inviteque.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateInvitationRequest {
    private String templateId;
    private String coupleNames;
    private String groomName;
    private String brideName;
    private String weddingDate;
    private String weddingMonth;
    private String weddingYear;
    private String mahalName;
    private String venueAddress;
    private String venueCity;
    private String mapUrl;
    private String[] photos; // ✨ Cloudinary URLs
    private String scheduleItems; // JSON string
}
```

---

## 🗄️ PostgreSQL Setup

### 1. Create Database

```sql
-- Create database
CREATE DATABASE wedding_invites;

-- Connect to database
\c wedding_invites;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Create Tables

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Invitations table with Cloudinary URLs
CREATE TABLE invitations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    template_id VARCHAR(100) NOT NULL,
    couple_names VARCHAR(255),
    groom_name VARCHAR(255),
    bride_name VARCHAR(255),
    wedding_date VARCHAR(10),
    wedding_month VARCHAR(20),
    wedding_year VARCHAR(4),
    mahal_name VARCHAR(255),
    venue_address TEXT,
    venue_city VARCHAR(100),
    map_url TEXT,

    -- ✨ Store Cloudinary URLs as TEXT array
    photos TEXT[],

    -- Store schedule items as JSONB
    schedule_items JSONB,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes for faster queries
CREATE INDEX idx_invitations_user_id ON invitations(user_id);
CREATE INDEX idx_invitations_created_at ON invitations(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
```

### 3. Query Examples

```sql
-- Get all invitations for a user
SELECT id, couple_names, wedding_date, photos
FROM invitations
WHERE user_id = 1
ORDER BY created_at DESC;

-- Get specific invitation with all details
SELECT *
FROM invitations
WHERE id = 123 AND user_id = 1;

-- Update photos array
UPDATE invitations
SET photos = ARRAY_APPEND(photos, 'https://res.cloudinary.com/...')
WHERE id = 123;

-- Remove a photo
UPDATE invitations
SET photos = array_remove(photos, 'https://res.cloudinary.com/...')
WHERE id = 123;

-- Get invitation stats
SELECT
    COUNT(*) as total_invitations,
    AVG(array_length(photos, 1)) as avg_photos_per_invite
FROM invitations
WHERE user_id = 1;
```

### 4. Connection Details

```properties
# application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/wedding_invites
spring.datasource.username=postgres
spring.datasource.password=your_postgres_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.jdbc.batch_size=20

# Cloudinary
cloudinary.cloud-name=djbxuk2xr
cloudinary.api-key=312225164316173
cloudinary.api-secret=${CLOUDINARY_API_SECRET}
```

---

## 🚀 Usage Flow

### 1. Frontend Uploads to Cloudinary

```javascript
// React Frontend
<CloudinaryImageUpload onUpload={handleUpload} />
// Returns: { url: "https://res.cloudinary.com/...", publicId: "xyz" }
```

### 2. Backend Receives URLs

```java
// Java Backend
POST /api/invites
Body: {
  "coupleNames": "Rohan & Anaya",
  "photos": [
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v123/photo1.jpg",
    "https://res.cloudinary.com/djbxuk2xr/image/upload/v124/photo2.jpg"
  ]
}
```

### 3. Backend Stores URLs in PostgreSQL

```sql
-- Database stores URLs (not files!)
INSERT INTO invitations (user_id, couple_names, photos)
VALUES (1, 'Rohan & Anaya', ARRAY[
  'https://res.cloudinary.com/djbxuk2xr/image/upload/v123/photo1.jpg',
  'https://res.cloudinary.com/djbxuk2xr/image/upload/v124/photo2.jpg'
]);
```

### 4. Frontend Displays from Cloudinary

```jsx
// React Frontend
<LazyImage src="https://res.cloudinary.com/.../photo.jpg" />
// Image served from Cloudinary CDN (fast!)
```

---

## ✅ Implementation Checklist

- [ ] Add Cloudinary credentials to application.yml
- [ ] Create PostgreSQL database and tables
- [ ] Add Maven dependencies
- [ ] Create CloudinaryConfig bean
- [ ] Create Invitation entity with photos array
- [ ] Create InvitationService with CRUD operations
- [ ] Create InvitationController with endpoints
- [ ] Test upload via Postman
- [ ] Verify database stores URLs
- [ ] Test retrieve and display
- [ ] Monitor Cloudinary dashboard
