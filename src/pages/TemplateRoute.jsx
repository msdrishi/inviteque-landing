import { Navigate, useParams } from 'react-router-dom'
import TemplateRoyalWedding from './TemplateRoyalWedding.jsx'

const TEMPLATE_MAP = {
  'royal-wedding': TemplateRoyalWedding,
  'auraofelegance': TemplateRoyalWedding,
  'template-1': TemplateRoyalWedding,
}

export default function TemplateRoute() {
  const { templateId } = useParams()
  const TemplateComponent = TEMPLATE_MAP[templateId]

  if (!TemplateComponent) {
    return <Navigate to="/" replace />
  }

  return <TemplateComponent />
}
