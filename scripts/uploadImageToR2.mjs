import fs from 'fs';
import path from 'path';

// Usage: node scripts/uploadImageToR2.mjs <file_path> <jwt_token>
const filePath = process.argv[2];
const token = process.argv[3];
const apiUrl = 'http://localhost:8080';

if (!filePath || !token) {
  console.error("Usage: node scripts/uploadImageToR2.mjs <file_path> <jwt_token>");
  console.error("\nYou can get your jwt_token from the browser console on localhost:5173:");
  console.error("localStorage.getItem('inviteque_user') (look for the 'token' property inside the JSON)");
  process.exit(1);
}

async function uploadFile() {
  try {
    const fullPath = path.resolve(filePath);
    const fileName = path.basename(fullPath);
    
    if (!fs.existsSync(fullPath)) {
      throw new Error(`File not found: ${fullPath}`);
    }
    
    const fileContent = fs.readFileSync(fullPath);
    
    // 1. Get pre-signed URL from backend
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueFilename = `${Date.now()}-${cleanFileName}`;
    
    console.log(`Requesting pre-signed URL for ${uniqueFilename}...`);
    
    const response = await fetch(`${apiUrl}/api/v1/media/upload-url?filename=${encodeURIComponent(uniqueFilename)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to get upload URL: ${response.status} ${response.statusText} - ${text}`);
    }

    const { preSignedUrl, publicUrl } = await response.json();

    // 2. Upload the file directly to R2
    console.log(`Uploading to R2...`);
    let contentType = 'application/octet-stream';
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) contentType = 'image/jpeg';
    if (fileName.endsWith('.png')) contentType = 'image/png';
    if (fileName.endsWith('.webp')) contentType = 'image/webp';
    if (fileName.endsWith('.mp4')) contentType = 'video/mp4';

    const uploadResponse = await fetch(preSignedUrl, {
      method: 'PUT',
      body: fileContent,
      headers: {
        'Content-Type': contentType
      }
    });

    if (!uploadResponse.ok) {
      throw new Error(`Failed to upload to R2: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    console.log(`\n✅ Upload successful!\n`);
    console.log(`Public URL:\n${publicUrl}\n`);
    console.log(`You can now copy this URL and paste it into your data.js file.`);
    
  } catch (error) {
    console.error("❌ Error during upload:", error.message);
  }
}

uploadFile();
