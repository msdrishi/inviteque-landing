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
 * Upload image to Cloudinary
 * Returns optimized URL for web
 */
export async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    
    // Return optimized URL
    return {
      url: data.secure_url,
      publicId: data.public_id,
      width: data.width,
      height: data.height,
      size: data.bytes,
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
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
