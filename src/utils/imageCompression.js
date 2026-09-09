import imageCompression from 'browser-image-compression';

/**
 * Compresses an image file in the browser before uploading.
 * This is crucial for minimizing storage space and egress costs on R2.
 * 
 * @param {File} imageFile - The original image file from an input.
 * @returns {Promise<File>} - The compressed image file.
 */
export async function compressImageForUpload(imageFile) {
  const options = {
    maxSizeMB: 0.3,          // Target size is 300KB
    maxWidthOrHeight: 1920,  // Max dimension 1920px (Full HD)
    useWebWorker: true,
    fileType: 'image/webp',  // Convert everything to WebP for modern web performance
    initialQuality: 0.8
  };

  try {
    const compressedFile = await imageCompression(imageFile, options);
    console.log(`Original Size: ${(imageFile.size / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed Size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    return compressedFile;
  } catch (error) {
    console.error("Error compressing image:", error);
    throw error;
  }
}
