import { useState } from 'react'
import { uploadToCloudinary } from '../utils/cloudinary'

/**
 * Hook for uploading images to Cloudinary
 * Returns: { upload, uploading, error, progress }
 */
export function useCloudinaryUpload() {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const upload = async (file) => {
    if (!file) return null

    // Validate file
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return null
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setError('Image size must be less than 10MB')
      return null
    }

    setUploading(true)
    setError(null)
    setProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(p => Math.min(p + 30, 90))
      }, 200)

      const result = await uploadToCloudinary(file)

      clearInterval(progressInterval)
      setProgress(100)
      setUploading(false)

      return result
    } catch (err) {
      setError(err.message || 'Upload failed')
      setUploading(false)
      setProgress(0)
      return null
    }
  }

  return { upload, uploading, error, progress }
}
