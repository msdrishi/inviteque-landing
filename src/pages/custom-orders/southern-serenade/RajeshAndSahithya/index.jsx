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
    if (String(activeVariant).trim() === '1') {
      return {
        ...rajeshSahithyaData,
        customEvents: rajeshSahithyaData.customEvents.filter(
          (evt) =>
            evt.id !== 'pelli-kuthuru' &&
            !evt.title?.toLowerCase().includes('pelli kuthuru')
        ),
      }
    }
    return rajeshSahithyaData
  }, [activeVariant])

  return <TemplateSouthernSerenade savedData={currentData} />
}
