import React, { useEffect, useMemo } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import TemplateSouthernSerenade from '../../../../templates/southern-serenade/index.jsx'
import { rajeshSahithyaData } from './data.js'

export default function CustomRajeshAndSahithya() {
  const { variant } = useParams()
  const [searchParams] = useSearchParams()
  const activeVariant = variant || searchParams.get('variant') || searchParams.get('v')

  useEffect(() => {
    document.title = 'Rajesh & Sahithya | Wedding Celebrations'
  }, [])

  const currentData = useMemo(() => {
    const v = String(activeVariant || '').trim()

    // Variant 1: Pelli Koduku, Wedding, Vratham, Reception only
    if (v === '1') {
      const allowedIds = ['pelli-koduku', 'wedding', 'satyanarayan-pooja', 'reception']
      return {
        ...rajeshSahithyaData,
        customEvents: rajeshSahithyaData.customEvents.filter((evt) =>
          allowedIds.includes(evt.id)
        ),
      }
    }

    // Variant 2: Wedding and Reception only
    if (v === '2' || v === 'wedding-reception') {
      const allowedIds = ['wedding', 'reception']
      return {
        ...rajeshSahithyaData,
        customEvents: rajeshSahithyaData.customEvents.filter((evt) =>
          allowedIds.includes(evt.id)
        ),
      }
    }

    // Variant 3: All events except Pelli kuthuru
    if (v === '3') {
      return {
        ...rajeshSahithyaData,
        customEvents: rajeshSahithyaData.customEvents.filter(
          (evt) =>
            evt.id !== 'pelli-kuthuru' &&
            !evt.title?.toLowerCase().includes('pelli kuthuru')
        ),
      }
    }

    // Variant 4: Pelli Kuthuru and Wedding only
    if (v === '4') {
      const allowedIds = ['pelli-kuthuru', 'wedding']
      return {
        ...rajeshSahithyaData,
        customEvents: rajeshSahithyaData.customEvents.filter((evt) =>
          allowedIds.includes(evt.id)
        ),
      }
    }

    // Default: Full events
    return rajeshSahithyaData
  }, [activeVariant])

  return <TemplateSouthernSerenade savedData={currentData} />
}
