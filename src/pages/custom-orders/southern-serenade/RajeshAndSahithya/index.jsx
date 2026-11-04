import React, { useEffect } from 'react'
import TemplateSouthernSerenade from '../../../../templates/southern-serenade/index.jsx'
import { rajeshSahithyaData } from './data.js'

export default function CustomRajeshAndSahithya() {
  useEffect(() => {
    document.title = 'Rajesh & Sahithya | Wedding Celebrations'
  }, [])

  return <TemplateSouthernSerenade savedData={rajeshSahithyaData} />
}
