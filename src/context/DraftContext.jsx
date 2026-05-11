import { createContext, useContext, useState } from 'react'

const DraftContext = createContext()

export function DraftProvider({ children }) {
  const [draftData, setDraftData] = useState({
    groomName: 'Groom',
    brideName: 'Bride',
    weddingDate: '18',
    weddingMonth: 'August',
    weddingYear: '2026',
    venueAddress: 'Palace Grounds',
    venueCity: 'Bangalore',
    mapLink: '',
    showGallery: true,
    showSchedule: true,
    showStory: true,
    photos: [],
    theme: 'auraofelegance'
  })

  const updateDraft = (newData) => {
    setDraftData(prev => ({ ...prev, ...newData }))
  }

  return (
    <DraftContext.Provider value={{ draftData, updateDraft }}>
      {children}
    </DraftContext.Provider>
  )
}

export function useDraft() {
  return useContext(DraftContext)
}
