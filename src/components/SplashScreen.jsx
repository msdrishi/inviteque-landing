import React from 'react'
import InvitequeLoader from './InvitequeLoader'

export default function SplashScreen({ loading = true }) {
  if (!loading) return null

  return <InvitequeLoader fullScreen={true} size="md" />
}
