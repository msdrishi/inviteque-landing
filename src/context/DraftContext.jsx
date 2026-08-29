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
  const [draftData, setDraftData] = useState(() => {
    try {
      const saved = localStorage.getItem('inviteque_draft_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        return { ...DEFAULT_DRAFT, ...parsed }
      }
    } catch (e) {
      console.warn('Failed to load draft from localStorage:', e)
    }
    return DEFAULT_DRAFT
  })

  // Sync to localStorage
  useEffect(() => {
    try {
      // Don't serialize File objects or circular refs
      const { _pendingPhotoFiles, _pendingFamilyPhotoFile, ...serializable } = draftData
      localStorage.setItem('inviteque_draft_data', JSON.stringify(serializable))
    } catch (e) {
      console.warn('Failed to save draft to localStorage:', e)
    }
  }, [draftData])

  const updateDraft = (newData) => {
    setDraftData(prev => {
      const updated = { ...prev, ...newData }
      try {
        const { _pendingPhotoFiles, _pendingFamilyPhotoFile, ...serializable } = updated
        localStorage.setItem('inviteque_draft_data', JSON.stringify(serializable))
      } catch (e) {
        // ignore
      }
      return updated
    })
  }

  const resetDraft = () => {
    localStorage.removeItem('inviteque_draft_data')
    setDraftData(DEFAULT_DRAFT)
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

