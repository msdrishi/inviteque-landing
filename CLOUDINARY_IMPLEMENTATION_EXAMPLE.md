# Quick Start: Update Builder Photo Gallery

## Current Implementation (Old)

```jsx
// src/pages/Builder.jsx - BEFORE

function Builder() {
  const [formData, setFormData] = useState({
    photos: [],
    // ... other fields
  });

  // Upload directly to backend (slow, stores files)
  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), ...files],
    }));
  };

  // Display uploaded files
  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handlePhotoUpload}
      />
      <div className="grid grid-cols-3 gap-4">
        {formData.photos?.map((photo, index) => (
          <img
            key={index}
            src={URL.createObjectURL(photo)} // ❌ File object
            alt={`Photo ${index}`}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## New Implementation (With Cloudinary)

```jsx
// src/pages/Builder.jsx - AFTER

import { CloudinaryImageUpload } from "../components/CloudinaryImageUpload";

function Builder() {
  const [formData, setFormData] = useState({
    photos: [], // Now stores Cloudinary URLs
    // ... other fields
  });

  const [photoErrors, setPhotoErrors] = useState(null);

  // Handle Cloudinary upload response
  const handlePhotoUpload = (imageData) => {
    // ✨ imageData.url is the Cloudinary URL
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), imageData.url],
    }));
    setPhotoErrors(null);
  };

  // Handle upload error
  const handlePhotoError = (error) => {
    setPhotoErrors(error);
  };

  // Remove photo from gallery
  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="space-y-6">
      {/* Photo Gallery Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold">Photo Gallery</h3>

        {/* Upload Component */}
        <CloudinaryImageUpload
          onUpload={handlePhotoUpload}
          onError={handlePhotoError}
          maxFiles={10}
          currentCount={formData.photos?.length || 0}
        />

        {/* Error Message */}
        {photoErrors && <p className="text-sm text-red-500">{photoErrors}</p>}

        {/* Display Uploaded Photos */}
        {formData.photos && formData.photos.length > 0 && (
          <div className="grid grid-cols-3 gap-4 md:grid-cols-4">
            {formData.photos.map((photoUrl, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-lg border border-iqBorder bg-iqCard"
              >
                {/* ✨ Display Cloudinary URL */}
                <img
                  src={photoUrl}
                  alt={`Photo ${index + 1}`}
                  className="aspect-square w-full object-cover"
                />

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-1 right-1 rounded-full bg-red-500 p-1 text-white opacity-0 hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Photos Message */}
        {(!formData.photos || formData.photos.length === 0) && (
          <p className="text-sm text-iqText/70">
            Upload photos to create a stunning photo gallery for your guests.
          </p>
        )}
      </div>
    </div>
  );
}
```

---

## Complete Example: Full Builder Form Section

```jsx
import { useState } from "react";
import { CloudinaryImageUpload } from "../components/CloudinaryImageUpload";
import { LazyImage } from "../components/LazyImage";

function BuilderPhotoSection() {
  const [formData, setFormData] = useState({
    groomName: "",
    brideName: "",
    weddingDate: "",
    weddingMonth: "",
    weddingYear: "",
    photos: [],
    venue: "",
    scheduleItems: [],
  });

  const [errors, setErrors] = useState({});
  const [photoErrors, setPhotoErrors] = useState(null);

  // Handle photo upload from Cloudinary
  const handlePhotoUpload = (imageData) => {
    console.log("Photo uploaded:", {
      url: imageData.url,
      publicId: imageData.publicId,
      size: imageData.size,
    });

    // Save Cloudinary URL to form data
    setFormData((prev) => ({
      ...prev,
      photos: [...(prev.photos || []), imageData.url],
    }));

    setPhotoErrors(null);
  };

  // Remove photo
  const handleRemovePhoto = (index) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }));
  };

  // Save form to backend
  const handleSave = async () => {
    // When saving, formData.photos contains:
    // ["https://res.cloudinary.com/...", "https://res.cloudinary.com/..."]

    const response = await fetch("/api/invites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const result = await response.json();
    console.log("Saved:", result);
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-6">
      {/* Couple Names Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Couple Names</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Groom's name"
            value={formData.groomName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, groomName: e.target.value }))
            }
            className="rounded-lg border border-gray-300 p-3"
          />
          <input
            type="text"
            placeholder="Bride's name"
            value={formData.brideName}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, brideName: e.target.value }))
            }
            className="rounded-lg border border-gray-300 p-3"
          />
        </div>
      </section>

      {/* Wedding Date Section */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Wedding Date</h2>
        <input
          type="date"
          value={`${formData.weddingYear}-${String(new Date(`${formData.weddingMonth} 1`).getMonth() + 1).padStart(2, "0")}-${String(formData.weddingDate).padStart(2, "0")}`}
          onChange={(e) => {
            const date = new Date(e.target.value);
            setFormData((prev) => ({
              ...prev,
              weddingDate: String(date.getDate()),
              weddingMonth: date.toLocaleString("en-US", { month: "long" }),
              weddingYear: String(date.getFullYear()),
            }));
          }}
          className="rounded-lg border border-gray-300 p-3 w-full"
        />
      </section>

      {/* ✨ Photo Gallery Section - NEW WITH CLOUDINARY */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Photo Gallery</h2>

        <CloudinaryImageUpload
          onUpload={handlePhotoUpload}
          onError={setPhotoErrors}
          maxFiles={10}
          currentCount={formData.photos?.length || 0}
        />

        {photoErrors && <p className="mt-2 text-red-500">{photoErrors}</p>}

        {/* Display uploaded photos */}
        {formData.photos.length > 0 && (
          <div className="mt-6 grid grid-cols-3 gap-4 md:grid-cols-4">
            {formData.photos.map((photoUrl, index) => (
              <div
                key={index}
                className="relative group rounded-lg overflow-hidden"
              >
                <LazyImage
                  src={photoUrl}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-40 object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white text-2xl"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700"
      >
        Save Invitation
      </button>
    </div>
  );
}

export default BuilderPhotoSection;
```

---

## Summary of Changes

| Part        | Before                             | After                                                                         |
| ----------- | ---------------------------------- | ----------------------------------------------------------------------------- |
| **Import**  | `import { useState }`              | `import { CloudinaryImageUpload } from '../components/CloudinaryImageUpload'` |
| **State**   | `photos: []` (File objects)        | `photos: []` (URLs)                                                           |
| **Upload**  | File input + manual backend upload | `<CloudinaryImageUpload />`                                                   |
| **Display** | `URL.createObjectURL(file)`        | Direct Cloudinary URL                                                         |
| **Save**    | FormData with files                | JSON with URLs                                                                |
| **Speed**   | Slow (files to backend)            | Fast (files to CDN)                                                           |

---

## Testing Checklist

- [ ] Can upload image via CloudinaryImageUpload
- [ ] Progress bar shows during upload
- [ ] Image displays after upload
- [ ] Can remove image from gallery
- [ ] Max 10 files limit enforced
- [ ] Backend receives Cloudinary URLs (not files)
- [ ] Database stores URLs correctly
- [ ] Can fetch and display saved photos
- [ ] Photos are fast to load (CDN cached)
