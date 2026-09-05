/**
 * Cloudinary Configuration
 * Replace REACT_APP_CLOUDINARY_CLOUD_NAME with your Cloudinary cloud name
 * Get it from: https://cloudinary.com/console
 */

export const CLOUDINARY_CONFIG = {
  cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'djbxuk2xr',
  uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'inviteque',
  apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
}

/**
 * Compress and resize an image file in the browser before upload
 * Resizes to max 1920x1920 and converts to WebP quality 0.85
 * Reduces customer 5-10MB JPG uploads down to ~300-500KB before upload
 */
export async function precompressImage(file, maxDimension = 1920, quality = 0.85) {
  if (!file || !file.type.startsWith('image/')) return file

  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width)
            width = maxDimension
          } else {
            width = Math.round((width * maxDimension) / height)
            height = maxDimension
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file)
              return
            }
            const optimizedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, '') + '.webp',
              { type: 'image/webp' }
            )
            resolve(optimizedFile)
          },
          'image/webp',
          quality
        )
      }
      img.onerror = () => resolve(file)
      img.src = e.target.result
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

/**
 * Upload customer image to Cloudinary (pre-compressed client-side)
 * Returns optimized URL for web
 */
export async function uploadToCloudinary(file) {
  // Pre-compress in browser to save bandwidth, storage, and transformation quota
  const optimizedFile = await precompressImage(file)

  const formData = new FormData()
  formData.append('file', optimizedFile)

  try {
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
    const response = await fetch(
      `${API_URL}/api/images/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    
    // Ensure full URL
    const imageUrl = data.secure_url.startsWith('http') ? data.secure_url : `${API_URL}${data.secure_url}`;
    
    // Return optimized URL
    return {
      url: imageUrl,
      publicId: data.public_id,
      width: data.width || 800,
      height: data.height || 600,
      size: data.bytes || 0,
    }
  } catch (error) {
    console.error('Image upload error:', error)
    throw error
  }
}

/**
 * Generate optimized Cloudinary URL with transformations
 */
export function getOptimizedImageUrl(publicId, options = {}) {
  const {
    width = 800,
    height = 600,
    quality = 'auto',
    format = 'auto',
    crop = 'fill',
  } = options

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/w_${width},h_${height},c_${crop},q_${quality},f_${format}/${publicId}`
}

/**
 * Optimize an existing full Cloudinary URL with f_auto, q_auto and optional width
 * Avoids duplicate transformations if already present
 */
export function optimizeCloudinaryUrl(url, options = {}) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('res.cloudinary.com')) return url
  // Do not transform video URLs or non-image assets
  if (url.includes('/video/upload/')) return url

  const { width, quality = 'auto', format = 'auto' } = options
  const transforms = []
  if (format) transforms.push(`f_${format}`)
  if (quality) transforms.push(`q_${quality}`)
  if (width) transforms.push(`w_${width}`)

  const transformStr = transforms.join(',')

  // If already has transformation parameters right after /upload/
  if (url.includes('/image/upload/f_auto') || url.includes('/image/upload/q_auto') || url.includes('/image/upload/w_')) {
    return url
  }

  return url.replace('/image/upload/', `/image/upload/${transformStr}/`)
}

/**
 * Get device-optimized background URL from Cloudinary (w_1440 for desktop, w_768 for mobile)
 */
export function getOptimizedBgUrl(url, isDesktop = true) {
  return optimizeCloudinaryUrl(url, {
    width: isDesktop ? 1440 : 768,
    quality: 'auto',
    format: 'auto',
  })
}

/**
 * Delete image from Cloudinary
 * Requires backend API call for security
 */
export async function deleteFromCloudinary(publicId, backendUrl = '/api/images/delete') {
  try {
    const response = await fetch(backendUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ publicId }),
    })

    if (!response.ok) {
      throw new Error('Delete failed')
    }

    return await response.json()
  } catch (error) {
    console.error('Delete error:', error)
    throw error
  }
}
