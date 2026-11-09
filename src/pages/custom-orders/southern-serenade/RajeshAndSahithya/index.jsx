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

    // Variant 1: Without Pelli Kuthuru
    if (v === '1') {
      return {
        ...rajeshSahithyaData,
        customEvents: rajeshSahithyaData.customEvents.filter(
          (evt) =>
            evt.id !== 'pelli-kuthuru' &&
            !evt.title?.toLowerCase().includes('pelli kuthuru')
        ),
      }
    }

    // Variant 2 or 'wedding-reception': Only Wedding and Reception (without Engagement, Pellikuthuru, Mehendi, Satyanarayan Pooja)
    if (v === '2' || v === 'wedding-reception') {
      return {
        ...rajeshSahithyaData,
        customEvents: rajeshSahithyaData.customEvents.filter(
          (evt) =>
            evt.id === 'wedding' ||
            evt.id === 'reception' ||
            evt.title?.toLowerCase().includes('wedding') ||
            evt.title?.toLowerCase().includes('reception')
        ),
      }
    }

    return rajeshSahithyaData
  }, [activeVariant])

  return <TemplateSouthernSerenade savedData={currentData} />
}
