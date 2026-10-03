import { createContext, useContext, useState, useEffect } from 'react'

const DraftContext = createContext()

const DEFAULT_DRAFT = {
  groomName: '',
  brideName: '',
  weddingDate: '',
  weddingMonth: '',
  weddingYear: '',
  weddingTime: '09:00 AM - 10:30 AM',
  mahalName: '',
  venueAddress: '',
  venueCity: '',
  state: '',
  mapLink: '',
  showGallery: true,
  showSchedule: true,
  showFamilySection: false,
  familyMessage: '',
  familyPhoto: null,
  showCustomSection: false,
  customSectionTitle: '',
  customSectionSubtitle: '',
  customSectionDate: '',
  customSectionLocation: '',
  customSectionContent: '',
  customSectionPosition: 'top-center',
  photos: [null, null, null],
  _pendingPhotoFiles: {},
  _pendingFamilyPhotoFile: null,
  scheduleItems: [
    { time: '11:00 AM', title: 'Haldi Ceremony' },
    { time: '04:00 PM', title: 'Wedding Vows' },
    { time: '07:00 PM', title: 'Grand Reception' }
  ],
  code: null,
  status: 'DRAFT',
  amountPaid: 0,
  hasRsvp: false,
  wasRsvpPaid: false
}

export function DraftProvider({ children }) {
  const [currentTemplateId, setCurrentTemplateId] = useState('default')
  
  useEffect(() => {
    // Listen for route changes (a bit hacky since it's outside router, but window location works or we just check every render/interval)
    const handleLocationChange = () => {
      const match = window.location.pathname.match(/\/(?:builder|template|templates)\/([^\/]+)/)
      const newId = match ? match[1] : 'default'
      if (newId !== currentTemplateId) {
        setCurrentTemplateId(newId)
      }
    }
    
    // Call initially
    handleLocationChange()
    
    // Setup observer for client-side navigation since we are outside the router
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState
    
    history.pushState = function() {
      originalPushState.apply(this, arguments)
      handleLocationChange()
    }
    
    history.replaceState = function() {
      originalReplaceState.apply(this, arguments)
      handleLocationChange()
    }
    
    window.addEventListener('popstate', handleLocationChange)
    
    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      window.removeEventListener('popstate', handleLocationChange)
    }
  }, [currentTemplateId])

  const [draftData, setDraftData] = useState(() => {
    try {
      const match = window.location.pathname.match(/\/(?:builder|template|templates)\/([^\/]+)/)
      const initialId = match ? match[1] : 'default'
      const saved = localStorage.getItem(`inviteque_draft_${initialId}`) || localStorage.getItem('inviteque_draft_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_DRAFT, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to load draft from localStorage:', e)
    }
    return DEFAULT_DRAFT
  })

  // When templateId changes, we load the draft for that template
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`inviteque_draft_${currentTemplateId}`)
      if (saved) {
         setDraftData({ ...DEFAULT_DRAFT, ...JSON.parse(saved) })
      } else {
         setDraftData(DEFAULT_DRAFT)
      }
    } catch (e) {
      setDraftData(DEFAULT_DRAFT)
    }
  }, [currentTemplateId])

  // Sync to localStorage
  useEffect(() => {
    try {
      // Don't serialize File objects or circular refs
      const { _pendingPhotoFiles, _pendingFamilyPhotoFile, ...serializable } = draftData
      localStorage.setItem(`inviteque_draft_${currentTemplateId}`, JSON.stringify(serializable))
      // For backwards compatibility/migration
      if (currentTemplateId === 'default') {
        localStorage.setItem('inviteque_draft_data', JSON.stringify(serializable))
      }
    } catch (e) {
      console.warn('Failed to save draft to localStorage:', e)
    }
  }, [draftData, currentTemplateId])

  const updateDraft = (newData) => {
    setDraftData(prev => {
      const updated = { ...prev, ...newData }
      try {
        const { _pendingPhotoFiles, _pendingFamilyPhotoFile, ...serializable } = updated
        localStorage.setItem(`inviteque_draft_${currentTemplateId}`, JSON.stringify(serializable))
      } catch (e) {
        // ignore
      }
      return updated
    })
  }

  const resetDraft = (specificTemplateId) => {
    const targetId = specificTemplateId || currentTemplateId
    localStorage.removeItem(`inviteque_draft_${targetId}`)
    if (targetId === 'default' || (!specificTemplateId && currentTemplateId === 'default')) {
      localStorage.removeItem('inviteque_draft_data')
    }
    if (!specificTemplateId || specificTemplateId === currentTemplateId) {
      setDraftData(DEFAULT_DRAFT)
    }
  }

  return (
    <DraftContext.Provider value={{ draftData, updateDraft, resetDraft }}>
      {children}
    </DraftContext.Provider>
  )
}

export function useDraft() {
  return useContext(DraftContext)
}

