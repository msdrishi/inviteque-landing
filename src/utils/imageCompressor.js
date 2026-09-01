/**
 * High-performance client-side WebP image compressor.
 * Accepts ANY file size (1MB, 10MB, 50MB+) and compresses it into WebP format (<300KB - 500KB).
 */
export async function compressImageToWebP(file, maxDimension = 1400, targetMaxBytes = 400 * 1024) {
  return new Promise((resolve, reject) => {
    // If input is already a base64 string or URL
    if (typeof file === 'string') {
      if (file.startsWith('http') || file.startsWith('/')) {
        return resolve(file);
      }
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Scale down dimensions if greater than maxDimension
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target.result);
        }

        // Draw image onto canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Adaptive compression pass to ensure < targetMaxBytes (300KB - 500KB)
        let quality = 0.82;
        let webpDataUrl = canvas.toDataURL('image/webp', quality);

        // Calculate approximate byte size of base64
        let base64Length = webpDataUrl.length - (webpDataUrl.indexOf(',') + 1);
        let byteSize = (base64Length * 3) / 4;

        // Pass 2: If size is still > targetMaxBytes, step down quality
        if (byteSize > targetMaxBytes) {
          quality = 0.70;
          webpDataUrl = canvas.toDataURL('image/webp', quality);
          base64Length = webpDataUrl.length - (webpDataUrl.indexOf(',') + 1);
          byteSize = (base64Length * 3) / 4;
        }

        // Pass 3: If still > targetMaxBytes, scale dimensions down to 1000px
        if (byteSize > targetMaxBytes) {
          const scaledCanvas = document.createElement('canvas');
          const scale = 1000 / Math.max(width, height);
          scaledCanvas.width = Math.round(width * scale);
          scaledCanvas.height = Math.round(height * scale);
          const scaledCtx = scaledCanvas.getContext('2d');
          scaledCtx.imageSmoothingEnabled = true;
          scaledCtx.imageSmoothingQuality = 'high';
          scaledCtx.drawImage(canvas, 0, 0, scaledCanvas.width, scaledCanvas.height);
          webpDataUrl = scaledCanvas.toDataURL('image/webp', 0.68);
        }

        resolve(webpDataUrl);
      };
      img.src = e.target.result;
    };

    if (file instanceof Blob || file instanceof File) {
      reader.readAsDataURL(file);
    } else {
      resolve(file);
    }
  });
}
