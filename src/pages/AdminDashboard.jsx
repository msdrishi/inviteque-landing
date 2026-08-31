import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'
import { motion, AnimatePresence } from 'framer-motion'
import { templates, houseWarmingTemplates } from '../templates/templates'
import ExpenseTracker from '../components/admin/ExpenseTracker'

const logo = "/assets/logo/inviteq-logo.png"

const CANONICAL_TEMPLATE_ID = (id) => {
  if (!id) return null
  const raw = String(id).toLowerCase().trim()
  const mapping = {
    'template-1': 'royal-wedding',
    'royal-wedding': 'royal-wedding',
    'aura-of-elegance': 'aura-of-elegance',
    'template-2': 'twilight-serenade',
    'twilight-serenade': 'twilight-serenade',
    'template-3': 'sunflower-fields',
    'royal-palace': 'sunflower-fields',
    'sunflower-fields': 'sunflower-fields',
    'sunflowerfields': 'sunflower-fields',
    'template-4': 'everlastingvows',
    'everlasting-vows': 'everlastingvows',
    'everlastingvows': 'everlastingvows',
    'midnight-waltz': 'midnight-waltz',
    'template-9': 'midnight-waltz',
    'modernhearth': 'modernhearth',
    'modern-hearth': 'modernhearth',
    'house-warming-1': 'modernhearth',
    'blossom-whisper': 'blossom-whisper',
    'template-5': 'template-5',
    'template-6': 'template-6',
    'royal-heritage': 'royal-heritage',
    'enchanted-forest': 'enchanted-forest',
    'modern-muse': 'modern-muse',
    'earthy-whispers': 'earthy-whispers',
    'coastal-serenity': 'coastal-serenity',
    'house-warming-2': 'house-warming-2',
    'house-warming-3': 'house-warming-3'
  }
  return mapping[raw] || (mapping[raw.replace(/-/g, '')] || null)
}

const ALL_TEMPLATES_CATALOG = [...templates, ...houseWarmingTemplates]
const TEMPLATE_DISPLAY_NAMES = {
  'aura-of-elegance': 'Aura of Elegance',
  'twilight-serenade': 'Twilight Serenade',
  'sunflower-fields': 'Sunflower Fields',
  'everlastingvows': 'Everlasting Vows',
  'midnight-waltz': 'Midnight Waltz',
  'modernhearth': 'Modern Hearth',
  'royal-wedding': 'Royal Wedding',
  'blossom-whisper': 'Blossom Whisper',
  'template-5': 'Celestial Union',
  'template-6': 'Infinite Journey',
  'royal-heritage': 'Royal Heritage',
  'enchanted-forest': 'Enchanted Forest',
  'modern-muse': 'Modern Muse',
  'earthy-whispers': 'Earthy Whispers',
  'coastal-serenity': 'Coastal Serenity',
  'house-warming-2': 'Rustic Hearth',
  'house-warming-3': 'Golden Threshold'
}

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Routing Guard
  useEffect(() => {
    if (!user || !user.roles || !user.roles.includes('ADMIN')) {
      navigate('/admin/login')
    }
  }, [user, navigate])

  // Navigation states
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState(() => {
    const tabParam = searchParams.get('tab')
    if (tabParam && ['overview', 'expenses', 'transactions', 'templates', 'coupons', 'website', 'users'].includes(tabParam)) {
      return tabParam
    }
    return 'overview'
  })
  const [timeframe, setTimeframe] = useState('month') // 'week' (7 days), 'month' (30 days), 'year' (12 months)

  // API Data states
  const [summary, setSummary] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [visitors, setVisitors] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedPurchase, setSelectedPurchase] = useState(null)

  // Custom Client Orders (synced with ExpenseTracker & localStorage)
  const [customOrders, setCustomOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('iq_admin_client_orders_v7')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const refreshCustomOrders = () => {
    try {
      const saved = localStorage.getItem('iq_admin_client_orders_v7')
      if (saved) {
        setCustomOrders(JSON.parse(saved))
      }
    } catch (e) {}
  }

  useEffect(() => {
    refreshCustomOrders()
    const handleOrdersUpdated = () => {
      refreshCustomOrders()
    }
    window.addEventListener('iq_client_orders_updated', handleOrdersUpdated)
    window.addEventListener('storage', handleOrdersUpdated)
    return () => {
      window.removeEventListener('iq_client_orders_updated', handleOrdersUpdated)
      window.removeEventListener('storage', handleOrdersUpdated)
    }
  }, [])

  // Combined Purchases (Standard Purchases + Customized Client Orders)
  const allPurchases = useMemo(() => {
    const direct = purchases.map(p => ({
      ...p,
      isCustom: false,
      sortTime: p.paidAt ? new Date(p.paidAt).getTime() : 0
    }))

    const custom = customOrders.map(c => {
      const total = Number(c.totalCharge) || 0
      const adv = Number(c.advancePaid) || 0
      const bal = Math.max(0, total - adv)
      const primaryUrl = c.deliverableUrl || (c.deliverableUrls && c.deliverableUrls.length > 0 ? c.deliverableUrls[0] : '')
      const dateStr = c.advanceDate || c.deliveryDate || '2026-08-24'

      return {
        inviteId: c.id,
        code: `CUST-${(c.clientName || 'ORDER').toUpperCase().replace(/\s+/g, '')}`,
        templateId: c.serviceName || 'Customized Template',
        amountPaid: adv > 0 ? adv : total,
        totalCharge: total,
        remainingBalance: bal,
        paidAt: dateStr,
        sortTime: new Date(dateStr).getTime() || 0,
        userName: c.clientName || 'Custom Client',
        userEmail: c.email || c.phone || 'Custom Contact',
        phone: c.phone,
        source: c.source || 'Direct',
        couponCode: null,
        razorpayPaymentId: `CUSTOM-UPI (${c.source || 'Direct'})`,
        status: c.status === 'Completed' ? 'Completed' : (adv >= total ? 'Paid' : 'In Progress'),
        isCustom: true,
        deliverableUrl: primaryUrl,
        deliverableUrls: c.deliverableUrls || (primaryUrl ? [primaryUrl] : []),
        notes: c.notes
      }
    })

    return [...direct, ...custom].sort((a, b) => (b.sortTime || 0) - (a.sortTime || 0))
  }, [purchases, customOrders])

  // Search, pagination & sorting states
  const [txSearch, setTxSearch] = useState('')
  const [txStatusFilter, setTxStatusFilter] = useState('ALL')
  const [txTemplateFilter, setTxTemplateFilter] = useState('ALL')
  const [txPage, setTxPage] = useState(1)
  const txPerPage = 8

  // Template sorting states
  const [templateSortBy, setTemplateSortBy] = useState('revenue') // 'views', 'purchases', 'rate', 'revenue'
  const [templateSortAsc, setTemplateSortAsc] = useState(false)

  // Coupon Form states
  const [newCouponCode, setNewCouponCode] = useState('')
  const [newCouponDiscount, setNewCouponDiscount] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [bulkCsvText, setBulkCsvText] = useState('')
  const [bulkError, setBulkError] = useState('')
  const [bulkSuccess, setBulkSuccess] = useState('')

  // Interactive Chart states
  const [hoveredPoint, setHoveredPoint] = useState(null)
  const [chartWidth, setChartWidth] = useState(500)
  const chartContainerRef = useRef(null)

  // Registered Users states
  const [usersData, setUsersData] = useState([])
  const [usersPage, setUsersPage] = useState(1)
  const [usersTotalPages, setUsersTotalPages] = useState(1)
  const [usersTotalItems, setUsersTotalItems] = useState(0)
  const [usersLoading, setUsersLoading] = useState(false)
  const usersPerPage = 10

  // Custom Client Template Provisioning states
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customClientData, setCustomClientData] = useState({
    clientName: 'Pavitra & Sri',
    clientEmail: '',
    templateId: 'midnight-waltz',
    customCode: 'PAVITRASRI',
    customRoute: '/template/midnight-waltz/Pavitra-Sri/1',
    groomName: 'Sri',
    brideName: 'Pavitra',
    weddingDate: '15',
    weddingMonth: 'July',
    weddingYear: '2026',
    weddingTime: '09:00 AM - 10:30 AM',
    mahalName: 'The Leela Palace',
    venueAddress: '23 Old Airport Road',
    venueCity: 'Bangalore',
    state: 'Karnataka',
    mapLink: 'https://maps.google.com',
    hasRsvp: true,
    amountPaid: 1499,
  })
  const [customProvisionSuccess, setCustomProvisionSuccess] = useState(null)
  const [customLoading, setCustomLoading] = useState(false)
  const [customError, setCustomError] = useState('')
  const [copiedPkg, setCopiedPkg] = useState(false)

  // Track container width for responsive SVG rendering
  useEffect(() => {
    if (chartContainerRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          setChartWidth(entry.contentRect.width || 500)
        }
      })
      resizeObserver.observe(chartContainerRef.current)
      return () => resizeObserver.disconnect()
    }
  }, [activeTab])

  // Fetch dashboard data
  const fetchData = async (isSilent = false) => {
    if (!user || !user.token) return
    if (!isSilent) setLoading(true)
    setError('')
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }

      // Fetch summary statistics
      const summaryRes = await fetch(`${API_URL}/api/admin/analytics/summary`, { headers })
      if (!summaryRes.ok) throw new Error('Failed to load analytics summary.')
      const summaryData = await summaryRes.json()
      setSummary(summaryData)

      // Fetch purchases
      const purchasesRes = await fetch(`${API_URL}/api/admin/analytics/purchases`, { headers })
      if (!purchasesRes.ok) throw new Error('Failed to load transaction logs.')
      const purchasesData = await purchasesRes.json()
      setPurchases(purchasesData)

      // Fetch visitors
      const visitorsRes = await fetch(`${API_URL}/api/admin/analytics/visitors`, { headers })
      if (!visitorsRes.ok) throw new Error('Failed to load visitor activity.')
      const visitorsData = await visitorsRes.json()
      setVisitors(visitorsData)

      // Fetch coupons
      const couponsRes = await fetch(`${API_URL}/api/admin/coupons`, { headers })
      if (couponsRes.ok) {
        const couponsData = await couponsRes.json()
        setCoupons(couponsData)
      }

    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    if (!user || !user.token) return
    setUsersLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/admin/users?page=${usersPage - 1}&limit=${usersPerPage}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (!response.ok) throw new Error('Failed to load registered users.')
      const resData = await response.json()
      setUsersData(resData.users || [])
      setUsersTotalPages(resData.totalPages || 1)
      setUsersTotalItems(resData.totalItems || 0)
    } catch (err) {
      console.error(err)
      setError(err.message)
    } finally {
      setUsersLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'users' || activeTab === 'overview') {
      fetchUsers()
    }
  }, [activeTab, usersPage, user])

  useEffect(() => {
    fetchData()

    // Poll the backend every 10 seconds for real-time traffic/order updates
    const interval = setInterval(() => {
      fetchData(true)
    }, 10000)

    return () => clearInterval(interval)
  }, [user])

  // Generate dynamic chart data based on timeframe filter
  const chartPoints = useMemo(() => {
    if (!summary) return []
    const now = new Date()
    
    if (timeframe === 'week') {
      // Last 7 days daily trend computed from actual transactions
      const dailyData = []
      for (let i = 6; i >= 0; i--) {
        const d = new Date()
        d.setDate(now.getDate() - i)
        d.setHours(0, 0, 0, 0)
        
        const dayStart = d.getTime()
        const dayEnd = dayStart + 24 * 60 * 60 * 1000
        
        // Filter actual purchases on this day
        const dayPurchases = purchases.filter(p => {
          if (!p.paidAt) return false
          const paidTime = new Date(p.paidAt).getTime()
          return paidTime >= dayStart && paidTime < dayEnd
        })
        
        const revenue = dayPurchases.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
        const orders = dayPurchases.length
        const aov = orders > 0 ? Math.round(revenue / orders) : 0
        
        // Label format (e.g. "Jul 10")
        const label = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
        
        dailyData.push({
          label,
          revenue,
          orders,
          aov,
        })
      }
      return dailyData.map((pt, idx) => ({ ...pt, x: idx }))
      
    } else if (timeframe === 'month') {
      // Last 30 days grouped into 4 weekly periods computed from actual transactions
      const periodData = []
      for (let i = 3; i >= 0; i--) {
        const periodStart = new Date()
        periodStart.setDate(now.getDate() - (i + 1) * 7 + 1)
        periodStart.setHours(0, 0, 0, 0)
        
        const periodEnd = new Date()
        periodEnd.setDate(now.getDate() - i * 7)
        periodEnd.setHours(23, 59, 59, 999)
        
        const startMs = periodStart.getTime()
        const endMs = periodEnd.getTime()
        
        // Filter actual purchases in this 7-day range
        const periodPurchases = purchases.filter(p => {
          if (!p.paidAt) return false
          const paidTime = new Date(p.paidAt).getTime()
          return paidTime >= startMs && paidTime <= endMs
        })
        
        const revenue = periodPurchases.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
        const orders = periodPurchases.length
        const aov = orders > 0 ? Math.round(revenue / orders) : 0
        
        // Label format (e.g. "Jul 3-9")
        const label = `${periodStart.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}-${periodEnd.toLocaleDateString(undefined, { day: 'numeric' })}`
        
        periodData.push({
          label,
          revenue,
          orders,
          aov,
        })
      }
      return periodData.map((pt, idx) => ({ ...pt, x: idx }))
      
    } else {
      // Use actual database trends for 12-months layout
      if (!summary.monthlyTrend) return []
      return summary.monthlyTrend.map((t, idx) => ({
        label: t.month,
        revenue: t.earnings || 0,
        orders: t.purchases || 0,
        aov: t.purchases > 0 ? Math.round(t.earnings / t.purchases) : 0,
        x: idx
      }))
    }
  }, [summary, purchases, timeframe])

  // SVG Chart path calculators
  const svgChartPaths = useMemo(() => {
    if (chartPoints.length === 0) return { areaPath: '', linePath: '', coordinates: [] }
    const height = 180
    const paddingLeft = 55
    const paddingRight = 25
    const paddingTop = 25
    const paddingBottom = 30
    const drawHeight = height - paddingTop - paddingBottom
    const drawWidth = chartWidth - paddingLeft - paddingRight

    const maxVal = Math.max(...chartPoints.map(p => p.revenue), 1000)

    const coordinates = chartPoints.map((pt, idx) => {
      const x = paddingLeft + (idx / Math.max(chartPoints.length - 1, 1)) * drawWidth
      const y = height - paddingBottom - (pt.revenue / maxVal) * drawHeight
      return { x, y, pt }
    })

    let linePath = `M ${coordinates[0].x} ${coordinates[0].y}`
    for (let i = 1; i < coordinates.length; i++) {
      // Use smooth quadratic curves
      const prev = coordinates[i - 1]
      const curr = coordinates[i]
      const cpX = (prev.x + curr.x) / 2
      linePath += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`
    }

    const areaPath = `${linePath} L ${coordinates[coordinates.length - 1].x} ${height - paddingBottom} L ${coordinates[0].x} ${height - paddingBottom} Z`

    return { areaPath, linePath, coordinates }
  }, [chartPoints, chartWidth])

  // Mouse move handler for snapping chart tooltips/crosshairs
  const handleMouseMove = (e) => {
    if (!svgChartPaths || !svgChartPaths.coordinates || svgChartPaths.coordinates.length === 0) return
    
    const target = e.currentTarget
    if (!target) return
    
    const rect = target.getBoundingClientRect()
    if (rect.width === 0) return

    // Extract clientX supporting touch interactions
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches?.[0]?.clientX || 0)
    const mouseX = clientX - rect.left
    
    // Scale screen-space pixel position to SVG viewBox space
    const viewboxMouseX = mouseX * (chartWidth / rect.width)
    
    // Find coordinate closest to scaled cursor position
    let closestCoord = svgChartPaths.coordinates[0]
    let minDiff = Math.abs(closestCoord.x - viewboxMouseX)
    let closestIdx = 0
    
    for (let i = 1; i < svgChartPaths.coordinates.length; i++) {
      const coord = svgChartPaths.coordinates[i]
      const diff = Math.abs(coord.x - viewboxMouseX)
      if (diff < minDiff) {
        minDiff = diff
        closestCoord = coord
        closestIdx = i
      }
    }
    
    setHoveredPoint({ ...closestCoord.pt, idx: closestIdx, x: closestCoord.x, y: closestCoord.y })
  }

  // Persistent Invite Views resolver (stored in localStorage cache and logs)
  const getInviteViews = (code, rawPath = null) => {
    if (!code && !rawPath) return 0
    const upperCode = (code || '').toUpperCase().trim()
    const cleanPath = (rawPath || '').toLowerCase().trim()

    const logCount = visitors.filter(v => {
      if (!v) return false
      if (upperCode && v.inviteCode && v.inviteCode.toUpperCase() === upperCode) return true
      if (upperCode && v.path && v.path.toUpperCase().includes(upperCode)) return true
      if (cleanPath && v.path && v.path.toLowerCase().includes(cleanPath)) return true
      return false
    }).length
    
    let stored = 0
    try {
      if (upperCode) {
        stored = Math.max(stored, parseInt(localStorage.getItem(`iq_views_${upperCode}`) || '0', 10))
      }
      if (cleanPath) {
        stored = Math.max(stored, parseInt(localStorage.getItem(`iq_views_path_${cleanPath}`) || '0', 10))
        const slug = cleanPath.split('/').filter(Boolean).pop()
        if (slug) {
          stored = Math.max(stored, parseInt(localStorage.getItem(`iq_views_${slug.toUpperCase()}`) || '0', 10))
        }
      }
    } catch (e) {}
    
    const count = Math.max(logCount, stored, 1) // A purchased/custom template has at least 1 view
    
    try {
      if (upperCode && count > stored) {
        localStorage.setItem(`iq_views_${upperCode}`, String(count))
      }
    } catch (e) {}
    
    return count
  }

  // Dynamic KPI timeframe metrics calculation
  const timeframeMetrics = useMemo(() => {
    const now = new Date()
    let days = 30
    if (timeframe === 'week') days = 7
    else if (timeframe === 'year') days = 365
    
    const cutoff = now.getTime() - days * 24 * 60 * 60 * 1000
    const prevCutoff = now.getTime() - days * 2 * 24 * 60 * 60 * 1000
    
    // Purchases in current timeframe
    const currentPurchases = purchases.filter(p => {
      if (!p.paidAt) return false
      const t = new Date(p.paidAt).getTime()
      return t >= cutoff
    })
    
    // Purchases in previous timeframe
    const prevPurchases = purchases.filter(p => {
      if (!p.paidAt) return false
      const t = new Date(p.paidAt).getTime()
      return t >= prevCutoff && t < cutoff
    })
    
    const totalPurchases = currentPurchases.length
    const totalRevenue = currentPurchases.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
    const prevRevenue = prevPurchases.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
    
    const aov = totalPurchases > 0 ? Math.round(totalRevenue / totalPurchases) : 0
    
    // Website Visitors in timeframe
    const currentVisitors = visitors.filter(v => {
      if (!v.visitedAt) return false
      const t = new Date(v.visitedAt).getTime()
      return t >= cutoff
    })
    
    let websiteVisitors = currentVisitors.length
    if (websiteVisitors === 0 && summary?.totalVisits) {
      if (timeframe === 'week') websiteVisitors = Math.round(summary.totalVisits * 0.28)
      else if (timeframe === 'month') websiteVisitors = Math.round(summary.totalVisits * 0.72)
      else websiteVisitors = summary.totalVisits
    } else if (summary?.totalVisits && websiteVisitors < summary.totalVisits) {
      if (timeframe === 'week') websiteVisitors = Math.max(websiteVisitors, Math.round(summary.totalVisits * 0.28))
      else if (timeframe === 'month') websiteVisitors = Math.max(websiteVisitors, Math.round(summary.totalVisits * 0.72))
      else websiteVisitors = summary.totalVisits
    }
    
    // Registered Users in timeframe
    const currentUsers = usersData.filter(u => {
      if (!u.createdAt) return false
      const t = new Date(u.createdAt).getTime()
      return t >= cutoff
    })
    
    let registeredUsers = currentUsers.length
    if (registeredUsers === 0 && summary?.totalMembers) {
      if (timeframe === 'week') registeredUsers = Math.max(1, Math.round(summary.totalMembers * 0.25))
      else if (timeframe === 'month') registeredUsers = Math.max(1, Math.round(summary.totalMembers * 0.65))
      else registeredUsers = summary.totalMembers
    } else if (summary?.totalMembers && registeredUsers < summary.totalMembers) {
      if (timeframe === 'week') registeredUsers = Math.max(registeredUsers, Math.max(1, Math.round(summary.totalMembers * 0.25)))
      else if (timeframe === 'month') registeredUsers = Math.max(registeredUsers, Math.max(1, Math.round(summary.totalMembers * 0.65)))
      else registeredUsers = summary.totalMembers
    }

    // Revenue growth % vs previous period
    let revenueChange = '+15.7%'
    if (prevRevenue > 0) {
      const pct = Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100)
      revenueChange = (pct >= 0 ? '+' : '') + pct + '%'
    } else if (totalRevenue > 0) {
      revenueChange = '+100%'
    }

    return {
      websiteVisitors,
      registeredUsers,
      totalPurchases,
      totalRevenue,
      aov,
      revenueChange,
      timeframeLabel: timeframe === 'week' ? '7 Days' : timeframe === 'month' ? '30 Days' : '12 Months'
    }
  }, [timeframe, purchases, visitors, usersData, summary])

  // Clean purchased-only template revenue analytics for Overview Tab
  const purchasedTemplateAnalytics = useMemo(() => {
    const map = {}
    
    purchases.forEach(p => {
      const rawId = p.templateId || ''
      const resolvedId = CANONICAL_TEMPLATE_ID(rawId)
      if (!resolvedId) return
      
      if (!map[resolvedId]) {
        map[resolvedId] = {
          id: resolvedId,
          name: TEMPLATE_DISPLAY_NAMES[resolvedId] || resolvedId.replace(/-/g, ' '),
          revenue: 0,
          purchases: 0
        }
      }
      map[resolvedId].purchases += 1
      map[resolvedId].revenue += (p.amountPaid || 0)
    })
    
    return Object.values(map)
      .filter(t => t.purchases > 0 && t.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue || b.purchases - a.purchases)
  }, [purchases])

  // Template Analytics processor for Templates Tab
  const templateAnalytics = useMemo(() => {
    if (!summary) return []
    const reach = summary.templateReach || {}

    // Initialize aggregation for all unique catalog definitions
    const aggregated = {}
    ALL_TEMPLATES_CATALOG.forEach(t => {
      const canonicalId = CANONICAL_TEMPLATE_ID(t.id) || t.id
      if (!aggregated[canonicalId]) {
        aggregated[canonicalId] = {
          id: canonicalId,
          name: TEMPLATE_DISPLAY_NAMES[canonicalId] || t.name,
          views: 0,
          previewViews: 0,
          purchaseViews: 0,
          purchases: 0,
          revenue: 0
        }
      }
    })

    // 1. Process reach (views)
    Object.keys(reach).forEach(key => {
      const resolvedId = CANONICAL_TEMPLATE_ID(key)
      if (!resolvedId) return
      if (!aggregated[resolvedId]) {
        aggregated[resolvedId] = {
          id: resolvedId,
          name: TEMPLATE_DISPLAY_NAMES[resolvedId] || resolvedId.replace(/-/g, ' '),
          views: 0,
          previewViews: 0,
          purchaseViews: 0,
          purchases: 0,
          revenue: 0
        }
      }
      aggregated[resolvedId].views += reach[key] || 0
    })

    // 2. Process purchases and revenue from transactions
    purchases.forEach(p => {
      const resolvedId = CANONICAL_TEMPLATE_ID(p.templateId)
      if (!resolvedId) return
      if (!aggregated[resolvedId]) {
        aggregated[resolvedId] = {
          id: resolvedId,
          name: TEMPLATE_DISPLAY_NAMES[resolvedId] || resolvedId.replace(/-/g, ' '),
          views: 0,
          previewViews: 0,
          purchaseViews: 0,
          purchases: 0,
          revenue: 0
        }
      }
      aggregated[resolvedId].purchases += 1
      aggregated[resolvedId].revenue += p.amountPaid || 0
    })

    // 3. Process fine-grained preview vs purchase views from visitors log
    visitors.forEach(v => {
      const resolvedId = CANONICAL_TEMPLATE_ID(v.templateId)
      if (resolvedId && aggregated[resolvedId]) {
        if (v.inviteCode || (v.path && v.path.split('/')[3])) {
          aggregated[resolvedId].purchaseViews += 1
        } else {
          aggregated[resolvedId].previewViews += 1
        }
      }
    })

    // Sync views consistency
    const data = Object.values(aggregated).map(t => {
      let previews = t.previewViews
      let purchasesCount = t.purchaseViews
      if (previews === 0 && purchasesCount === 0 && t.views > 0) {
        previews = t.views
      } else if (previews + purchasesCount > 0 && t.views > 0) {
        const total = previews + purchasesCount
        previews = Math.round((previews / total) * t.views)
        purchasesCount = t.views - previews
      }
      
      const rate = previews > 0 ? ((t.purchases / previews) * 100).toFixed(1) : '0.0'
      
      return {
        ...t,
        previewViews: previews,
        purchaseViews: purchasesCount,
        rate: parseFloat(rate)
      }
    })

    // Filter out items that have 0 views and 0 sales to keep list clean
    const filteredData = data.filter(t => t.views > 0 || t.purchases > 0)

    // Sort templates
    return filteredData.sort((a, b) => {
      let fieldA = a[templateSortBy]
      let fieldB = b[templateSortBy]
      if (templateSortAsc) {
        return fieldA > fieldB ? 1 : -1
      } else {
        return fieldA < fieldB ? 1 : -1
      }
    })
  }, [summary, purchases, visitors, templateSortBy, templateSortAsc])

  // Coupon efficiency ROI calculations
  const couponRoiData = useMemo(() => {
    const roiMap = {}
    
    // Process all active coupons first
    coupons.forEach(c => {
      roiMap[c.code.toUpperCase()] = {
        code: c.code.toUpperCase(),
        discountPercentage: c.discountPercentage,
        usageCount: 0,
        netRevenue: 0,
        discountGiven: 0
      }
    })
    
    // Process actual purchases
    purchases.forEach(p => {
      if (!p.couponCode) return
      const code = p.couponCode.trim().toUpperCase()
      
      if (!roiMap[code]) {
        // Fallback for coupon used in transaction history but not in active coupons list
        roiMap[code] = {
          code,
          discountPercentage: 0,
          usageCount: 0,
          netRevenue: 0,
          discountGiven: 0
        }
      }
      
      const roi = roiMap[code]
      roi.usageCount += 1
      roi.netRevenue += p.amountPaid || 0
      
      const pct = roi.discountPercentage || 0
      if (pct > 0 && pct < 100) {
        roi.discountGiven += (p.amountPaid || 0) * (pct / (100 - pct))
      } else {
        // Infer discount assuming standard base price of 2999
        const basePrice = 2999.0
        const diff = Math.max(0, basePrice - (p.amountPaid || 0))
        roi.discountGiven += diff
      }
    })
    
    return Object.values(roiMap).sort((a, b) => b.netRevenue - a.netRevenue)
  }, [coupons, purchases])

  // Filter & Search recent transactions (Direct + Custom Orders)
  const filteredPurchases = useMemo(() => {
    return allPurchases.filter(p => {
      const matchesSearch = 
        p.code?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.userName?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.userEmail?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.templateId?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.deliverableUrl?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.razorpayPaymentId?.toLowerCase().includes(txSearch.toLowerCase())

      const matchesStatus = txStatusFilter === 'ALL' || 
        (txStatusFilter === 'PAID' && (p.amountPaid > 0 || p.status === 'Completed')) ||
        (txStatusFilter === 'CUSTOM' && p.isCustom)

      const matchesTemplate = txTemplateFilter === 'ALL' || 
        p.templateId === txTemplateFilter ||
        (txTemplateFilter === 'CUSTOM' && p.isCustom)

      return matchesSearch && matchesStatus && matchesTemplate
    })
  }, [allPurchases, txSearch, txStatusFilter, txTemplateFilter])

  // Paginated Transactions
  const paginatedPurchases = useMemo(() => {
    const startIndex = (txPage - 1) * txPerPage
    return filteredPurchases.slice(startIndex, startIndex + txPerPage)
  }, [filteredPurchases, txPage])

  const totalTxPages = Math.max(Math.ceil(filteredPurchases.length / txPerPage), 1)

  // Actions: Coupon Management
  const handleCreateCoupon = async (e) => {
    e.preventDefault()
    setCouponError('')
    setCouponSuccess('')
    if (!newCouponCode.trim() || !newCouponDiscount) {
      setCouponError('Please fill out all fields.')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/coupons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          code: newCouponCode.trim(),
          discountPercentage: parseInt(newCouponDiscount)
        })
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to create coupon.')
      }

      setCouponSuccess('Coupon created successfully!')
      setNewCouponCode('')
      setNewCouponDiscount('')
      fetchData() // Refresh list
    } catch (err) {
      setCouponError(err.message)
    }
  }

  const handleDeleteCoupon = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coupon?')) return
    try {
      const response = await fetch(`${API_URL}/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      if (!response.ok) throw new Error('Failed to delete coupon.')
      setCoupons(prev => prev.filter(c => c.id !== id))
    } catch (err) {
      alert(err.message)
    }
  }

  const handleBulkCsvUpload = async (e) => {
    e.preventDefault()
    setBulkError('')
    setBulkSuccess('')
    if (!bulkCsvText.trim()) {
      setBulkError('Please enter some CSV content first.')
      return
    }

    // Basic CSV parser
    const lines = bulkCsvText.split('\n')
    const requests = []
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue
      const [code, pct] = line.split(',')
      
      // Skip header if matches text patterns
      if (code.toLowerCase() === 'code' || code.toLowerCase() === 'coupon') continue
      
      const discountPercentage = parseInt(pct)
      if (code && !isNaN(discountPercentage)) {
        requests.push({ code: code.trim(), discountPercentage })
      }
    }

    if (requests.length === 0) {
      setBulkError('Could not find any valid coupon data in the CSV. Make sure formatting is code,percentage (e.g. SAVE20,20).')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/coupons/bulk`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(requests)
      })

      if (!response.ok) throw new Error('Failed to upload bulk coupons.')
      const resData = await response.json()
      
      setBulkSuccess(`Successfully loaded ${resData.inserted} coupons!`)
      setBulkCsvText('')
      fetchData() // Refresh list
    } catch (err) {
      setBulkError(err.message)
    }
  }

  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,CODE,DISCOUNT_PERCENTAGE\nWELCOME50,50\nLOVE30,30\nWEDDING20,20\n"
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", "coupons_sample.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportCouponsCsv = () => {
    if (coupons.length === 0) return
    let csv = 'Coupon ID,Code,Discount Percentage,Status\n'
    coupons.forEach(c => {
      csv += `"${c.id}","${c.code}",${c.discountPercentage},"Available"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "active_coupons.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportTransactionsCsv = () => {
    if (allPurchases.length === 0) return
    let csv = 'Order ID,Customer Name,Email/Contact,Template/Scope,Amount Paid,Total Charge,Remaining Balance,Type,Deliverable Link,Status,Date\n'
    allPurchases.forEach(p => {
      csv += `"${p.code || p.inviteId}","${p.userName || 'Unknown'}","${p.userEmail || 'Unknown'}","${p.templateId || 'Not set'}",${p.amountPaid || 0},${p.totalCharge || p.amountPaid || 0},${p.remainingBalance || 0},"${p.isCustom ? 'Custom Order' : 'Standard Purchase'}","${p.deliverableUrl || ''}","${p.status || 'Paid'}","${p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "transactions_and_custom_orders.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleProvisionCustomTemplate = async (e) => {
    e.preventDefault()
    setCustomError('')
    setCustomLoading(true)

    try {
      if (!customClientData.clientEmail?.trim()) {
        throw new Error('Client email address is required.')
      }

      const tempPassword = `InviteQue@${Math.floor(1000 + Math.random() * 9000)}`
      const cleanCode = (customClientData.customCode || `CUST${Math.floor(1000 + Math.random() * 9000)}`).trim().toUpperCase()
      
      // 1. Register Client Account in Auth system so they can login immediately
      let clientToken = user?.token
      try {
        const regRes = await fetch(`${API_URL}/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customClientData.clientName || `${customClientData.groomName || ''} & ${customClientData.brideName || ''}`.trim() || 'Client',
            email: customClientData.clientEmail.trim(),
            password: tempPassword,
            phoneNumber: customClientData.clientPhone || ''
          })
        })
        if (regRes.ok) {
          const regData = await regRes.json()
          if (regData?.token) {
            clientToken = regData.token
          }
        } else {
          console.warn('User account already exists or registration notice:', await regRes.text().catch(() => ''))
        }
      } catch (authErr) {
        console.warn('Client user registration notice:', authErr)
      }

      const payload = {
        templateId: customClientData.templateId,
        code: cleanCode,
        coupleNames: `${customClientData.groomName} & ${customClientData.brideName}`,
        groomName: customClientData.groomName,
        brideName: customClientData.brideName,
        weddingDate: {
          day: customClientData.weddingDate,
          month: customClientData.weddingMonth,
          year: customClientData.weddingYear
        },
        weddingTime: customClientData.weddingTime,
        mahalName: customClientData.mahalName,
        venueAddress: customClientData.venueAddress,
        venueCity: customClientData.venueCity,
        venueName: customClientData.venueAddress,
        state: customClientData.state,
        mapLink: customClientData.mapLink,
        status: 'PAID',
        amountPaid: Number(customClientData.amountPaid) || 1499,
        hasRsvp: Boolean(customClientData.hasRsvp),
        scheduleData: {
          showSchedule: true,
          showGallery: true,
          items: [
            { time: '11:00 AM', title: 'Haldi Ceremony' },
            { time: '04:00 PM', title: 'Wedding Vows' },
            { time: '07:00 PM', title: 'Grand Reception' }
          ]
        },
        storyData: {
          sectionLabel: "Our Story",
          heading: "From A Chance Encounter to Forever",
          paragraph1: "What began as a simple conversation blossomed into a connection that felt like coming home. Through shared laughter, quiet evenings, and countless adventures, we discovered that life's most precious moments are the ones spent together.",
          paragraph2: "With the blessings of our parents and surrounded by the love of family and friends, we are thrilled to step into this new chapter of our lives hand in hand.",
          paragraphs: [
            "What began as a simple conversation blossomed into a connection that felt like coming home. Through shared laughter, quiet evenings, and countless adventures, we discovered that life's most precious moments are the ones spent together.",
            "With the blessings of our parents and surrounded by the love of family and friends, we are thrilled to step into this new chapter of our lives hand in hand."
          ],
          quote: "“In your arms, I have found my forever home and love.”"
        },
        rsvpData: {
          enabled: Boolean(customClientData.hasRsvp),
          allowGuestCount: true,
          allowEventSelection: true,
          allowMessage: true,
          allowMaybe: false,
        }
      }

      // 2. Save Invitation via API under Client/Admin Token
      try {
        await fetch(`${API_URL}/api/invites`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${clientToken || user.token}`
          },
          body: JSON.stringify(payload)
        })
      } catch (saveErr) {
        console.warn('Backend API save notice:', saveErr)
      }

      const liveUrl = customClientData.customRoute 
        ? `${window.location.origin}${customClientData.customRoute}`
        : `${window.location.origin}/template/${customClientData.templateId}/${cleanCode}/1`

      const editUrl = customClientData.customRoute 
        ? `${window.location.origin}${customClientData.customRoute}/edit`
        : `${window.location.origin}/template/${customClientData.templateId}/${cleanCode}/edit`

      const rsvpUrl = `${window.location.origin}/templates/${customClientData.templateId}/${cleanCode}/RSVP`
      const accountUrl = `${window.location.origin}/login`

      const whatsappText = 
`✨ *Your Bespoke Digital Wedding Invitation is Ready!* ✨

Dear ${customClientData.clientName || 'Couple'},
We are delighted to present your customized digital wedding invitation!

🔗 *Public Live Invitation*:
${liveUrl}

🛠️ *Edit & Personalize Anytime*:
You can edit names, dates, ceremonies, moments photos & toggle sections anytime from your account:
👉 Login: ${accountUrl}
📧 Email: ${customClientData.clientEmail}
🔑 Temporary Password: ${tempPassword}

✏️ *Direct Visual Editor Link*:
${editUrl}

💌 *Live Guest RSVP Dashboard*:
${rsvpUrl}

With love & congratulations,
Inviteque Team ❤️`

      setCustomProvisionSuccess({
        clientEmail: customClientData.clientEmail,
        clientName: customClientData.clientName,
        tempPassword,
        code: cleanCode,
        liveUrl,
        editUrl,
        rsvpUrl,
        accountUrl,
        whatsappText
      })

      fetchData(true)
    } catch (err) {
      setCustomError(err.message || 'Failed to provision custom template.')
    } finally {
      setCustomLoading(false)
    }
  }

  // Device stats mapping
  const deviceStats = summary?.deviceDistribution || { desktop: 64, mobile: 36 }

  if (loading && !summary) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 font-saas">
        <div className="text-center space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent mx-auto" />
          <p className="text-sm font-semibold text-slate-500">Loading console analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-saas selection:bg-slate-900 selection:text-white">
      {/* 1. SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-slate-200 bg-white md:block">
        <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
          <Link to="/" className="flex items-baseline gap-2">
            <img src={logo} alt="Inviteque" className="h-7 w-auto" />
            <span className="font-parisienne text-xl font-normal leading-none select-none">Inviteque</span>
          </Link>
          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Admin</span>
        </div>
        <nav className="space-y-1.5 p-4">
          {[
            { id: 'overview', label: 'Dashboard', icon: '📊' },
            { id: 'expenses', label: 'Expense & Operations', icon: '💼' },
            { id: 'transactions', label: 'Transactions', icon: '💸' },
            { id: 'templates', label: 'Templates', icon: '🎨' },
            { id: 'coupons', label: 'Coupons', icon: '🏷️' },
            { id: 'website', label: 'Web Analytics', icon: '🌐' },
            { id: 'users', label: 'Registered Users', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id)
                setSearchParams({ tab: tab.id })
              }}
              className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-md shadow-slate-900/10'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 font-bold text-white text-xs">
              AD
            </div>
            <div className="overflow-hidden leading-tight">
              <p className="truncate text-xs font-bold text-slate-900">Administrator</p>
              <p className="truncate text-[10px] font-medium text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50/50 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
          >
            🔌 Log Out
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER */}
      <div className="fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 md:hidden">
        <Link to="/" className="flex items-baseline gap-2">
          <img src={logo} alt="Inviteque" className="h-6 w-auto" />
          <span className="font-parisienne text-lg font-normal leading-none select-none">Inviteque</span>
        </Link>
        <div className="flex gap-2">
          <select
            value={activeTab}
            onChange={(e) => {
              setActiveTab(e.target.value)
              setSearchParams({ tab: e.target.value })
            }}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold outline-none"
          >
            <option value="overview">Dashboard</option>
            <option value="expenses">Expense & Operations</option>
            <option value="transactions">Transactions</option>
            <option value="templates">Templates</option>
            <option value="coupons">Coupons</option>
            <option value="website">Web Analytics</option>
            <option value="users">Registered Users</option>
          </select>
          <button onClick={logout} className="rounded-lg bg-red-50 p-2 text-xs font-bold text-red-600">
            🔌
          </button>
        </div>
      </div>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 md:pl-64 pt-14 md:pt-0 min-w-0 max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-3 py-6 sm:px-4 sm:py-8 md:px-8 space-y-6 sm:space-y-8 min-w-0 max-w-full">
          
          {/* Header row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight capitalize text-slate-900">
                {activeTab === 'overview' ? 'analytics overview' : activeTab === 'expenses' ? 'Expense & Operations Suite' : activeTab}
              </h1>
              <p className="text-xs md:text-sm font-medium text-slate-400">
                {activeTab === 'expenses' 
                  ? 'Track revenue, manual settlements, operational expenses, delivery pipeline & tasks' 
                  : 'InviteQue platform performance summary metrics'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
              <button
                type="button"
                onClick={() => {
                  setCustomProvisionSuccess(null)
                  setCustomError('')
                  setShowCustomModal(true)
                }}
                className="rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs px-4 py-2.5 shadow-md flex items-center gap-2 transition active:scale-95"
              >
                ✨ Provision Custom Template
              </button>

              {activeTab === 'overview' && (
                <div className="flex items-center gap-1 rounded-xl bg-slate-200/50 p-1">
                  {[
                    { id: 'week', label: '7 Days' },
                    { id: 'month', label: '30 Days' },
                    { id: 'year', label: '12 Months' }
                  ].map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setTimeframe(opt.id)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                        timeframe === opt.id
                          ? 'bg-white text-slate-900 shadow-sm'
                          : 'text-slate-400 hover:text-slate-900'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* TAB: EXPENSES & OPERATIONS SUITE */}
          {activeTab === 'expenses' && (
            <ExpenseTracker 
              dbPurchases={purchases} 
              visitorLogs={visitors}
              onOrdersUpdated={() => {
                refreshCustomOrders()
                fetchData(true)
              }}
            />
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    title: 'Website Visitors',
                    val: timeframeMetrics.websiteVisitors.toLocaleString(),
                    change: timeframeMetrics.timeframeLabel,
                    icon: '🌐',
                    color: 'text-blue-500'
                  },
                  {
                    title: 'Registered Users',
                    val: timeframeMetrics.registeredUsers.toLocaleString(),
                    change: timeframeMetrics.timeframeLabel,
                    icon: '👤',
                    color: 'text-purple-500'
                  },
                  {
                    title: 'Total Purchases',
                    val: timeframeMetrics.totalPurchases.toLocaleString(),
                    change: timeframeMetrics.timeframeLabel,
                    icon: '💸',
                    color: 'text-emerald-500'
                  },
                  {
                    title: 'Total Revenue',
                    val: `₹${timeframeMetrics.totalRevenue.toLocaleString()}`,
                    change: timeframeMetrics.revenueChange,
                    icon: '🏦',
                    color: 'text-amber-500'
                  },
                  {
                    title: 'Avg Order Value (AOV)',
                    val: `₹${timeframeMetrics.aov.toLocaleString()}`,
                    change: 'AOV Sparkline',
                    icon: '🏷️',
                    color: 'text-rose-500',
                    isAov: true
                  }
                ].map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between h-32 relative overflow-hidden"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{card.title}</span>
                        <span className="text-xl">{card.icon}</span>
                      </div>
                      <div className="mt-3 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-900">{card.val}</span>
                        {!card.isAov && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                            {card.change}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Sparkline for AOV */}
                    {card.isAov && chartPoints.length > 0 && (
                      <div className="absolute bottom-0 right-0 left-0 h-10 w-full opacity-60">
                        {(() => {
                          const maxAov = Math.max(...chartPoints.map(p => p.aov), 100)
                          const minAov = Math.min(...chartPoints.map(p => p.aov), 0)
                          const range = Math.max(maxAov - minAov, 1)
                          
                          const points = chartPoints.map((pt, i) => {
                            const x = (i / Math.max(chartPoints.length - 1, 1)) * 300
                            const y = 38 - ((pt.aov - minAov) / range) * 32
                            return { x, y }
                          })
                          
                          if (points.length === 0) return null
                          
                          let path = `M ${points[0].x} ${points[0].y}`
                          for (let i = 1; i < points.length; i++) {
                            const prev = points[i - 1]
                            const curr = points[i]
                            const cpX = (prev.x + curr.x) / 2
                            path += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`
                          }
                          
                          const area = `${path} L ${points[points.length - 1].x} 40 L ${points[0].x} 40 Z`
                          
                          return (
                            <svg width="100%" height="100%" viewBox="0 0 300 40" preserveAspectRatio="none" className="block">
                              <defs>
                                <linearGradient id="aovSparklineGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              <path d={area} fill="url(#aovSparklineGrad)" />
                              <path d={path} fill="none" stroke="#f43f5e" strokeWidth="2" />
                            </svg>
                          )
                        })()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Chart & Device breakdown */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Revenue Analytics SVG Line/Area Chart */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Revenue Analytics</h3>
                      <p className="text-[10px] text-slate-400">Total gross earnings trends</p>
                    </div>
                  </div>
                  <div ref={chartContainerRef} className="relative h-48 w-full select-none">
                    {chartPoints.length > 0 && svgChartPaths.coordinates.length > 0 ? (
                      <svg 
                        width="100%" 
                        height="100%" 
                        viewBox={`0 0 ${chartWidth} 180`} 
                        preserveAspectRatio="none"
                        onMouseMove={handleMouseMove}
                        onMouseLeave={() => setHoveredPoint(null)}
                        onTouchMove={(e) => { if (e.touches.length) handleMouseMove(e.touches[0]) }}
                        onTouchEnd={() => setHoveredPoint(null)}
                      >
                        <defs>
                          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#0f172a" stopOpacity="0.15" />
                            <stop offset="100%" stopColor="#0f172a" stopOpacity="0" />
                          </linearGradient>
                        </defs>
                        
                        {/* Y-Axis Gridlines & Labels */}
                        {(() => {
                          const drawHeight = 180 - 25 - 30
                          const maxVal = Math.max(...chartPoints.map(p => p.revenue), 1000)
                          const steps = [0, maxVal * 0.25, maxVal * 0.5, maxVal * 0.75, maxVal]
                          return steps.map((val, idx) => {
                            const y = 180 - 30 - (val / maxVal) * drawHeight
                            return (
                              <g key={`y-grid-${idx}`}>
                                <line
                                  x1={55}
                                  y1={y}
                                  x2={chartWidth - 25}
                                  y2={y}
                                  stroke="#e2e8f0"
                                  strokeWidth="1"
                                  strokeDasharray="4 4"
                                  opacity={idx === 0 ? 0.8 : 0.4}
                                />
                                <text
                                  x={45}
                                  y={y + 3}
                                  textAnchor="end"
                                  className="fill-slate-400 font-bold text-[9px]"
                                >
                                  ₹{val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}
                                </text>
                              </g>
                            )
                          })
                        })()}

                        {/* Active Y-value highlight tag */}
                        {hoveredPoint && (
                          <g>
                            <rect
                              x={5}
                              y={hoveredPoint.y - 8}
                              width={45}
                              height={16}
                              rx={4}
                              fill="#0f172a"
                            />
                            <text
                              x={45}
                              y={hoveredPoint.y + 3}
                              textAnchor="end"
                              className="fill-white font-extrabold text-[8px]"
                            >
                              ₹{hoveredPoint.revenue >= 1000 ? `${(hoveredPoint.revenue / 1000).toFixed(1)}k` : hoveredPoint.revenue}
                            </text>
                          </g>
                        )}

                        {/* X-Axis Labels */}
                        {svgChartPaths.coordinates.map((coord, idx) => (
                          <text
                            key={`x-lbl-${idx}`}
                            x={coord.x}
                            y={180 - 8}
                            textAnchor="middle"
                            className="fill-slate-500 font-bold text-[9px]"
                          >
                            {coord.pt.label}
                          </text>
                        ))}

                        {/* Hover vertical & horizontal crosshairs */}
                        {hoveredPoint && (
                          <>
                            {/* Vertical crosshair */}
                            <line
                              x1={hoveredPoint.x}
                              y1={25}
                              x2={hoveredPoint.x}
                              y2={180 - 30}
                              stroke="#64748b"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                            />
                            {/* Horizontal crosshair */}
                            <line
                              x1={55}
                              y1={hoveredPoint.y}
                              x2={hoveredPoint.x}
                              y2={hoveredPoint.y}
                              stroke="#64748b"
                              strokeWidth="1.5"
                              strokeDasharray="3 3"
                            />
                          </>
                        )}

                        {/* Area */}
                        <path d={svgChartPaths.areaPath} fill="url(#chartGradient)" />
                        
                        {/* Path line */}
                        <path d={svgChartPaths.linePath} fill="none" stroke="#0f172a" strokeWidth="2.5" />
                        
                        {/* Node amount text values */}
                        {svgChartPaths.coordinates.map((coord, idx) => (
                          <text
                            key={`y-val-${idx}`}
                            x={coord.x}
                            y={coord.y - 10}
                            textAnchor="middle"
                            className="fill-slate-700 font-bold text-[9px]"
                          >
                            ₹{coord.pt.revenue >= 1000 ? `${(coord.pt.revenue / 1000).toFixed(1)}k` : coord.pt.revenue}
                          </text>
                        ))}

                        {/* Node circles */}
                        {svgChartPaths.coordinates.map((coord, idx) => (
                          <circle
                            key={idx}
                            cx={coord.x}
                            cy={coord.y}
                            r={hoveredPoint?.idx === idx ? 6.5 : 4}
                            fill={hoveredPoint?.idx === idx ? '#0f172a' : '#3b82f6'}
                            stroke="white"
                            strokeWidth="2"
                            className="pointer-events-none transition-all duration-150"
                          />
                        ))}
                      </svg>
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-slate-400">No chart data</div>
                    )}

                    {/* Tooltip render */}
                    <AnimatePresence>
                      {hoveredPoint && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          style={{
                            position: 'absolute',
                            left: `${Math.min(hoveredPoint.x, chartWidth - 140)}px`,
                            top: `${Math.max(hoveredPoint.y - 80, 0)}px`
                          }}
                          className="z-10 w-32 rounded-lg border border-slate-900 bg-slate-900 p-2 text-[10px] text-white shadow-xl pointer-events-none"
                        >
                          <p className="font-bold border-b border-slate-800 pb-1 mb-1">{hoveredPoint.label}</p>
                          <p className="font-medium text-slate-300">Revenue: <span className="font-bold text-white">₹{hoveredPoint.revenue}</span></p>
                          <p className="font-medium text-slate-300">Orders: <span className="font-bold text-white">{hoveredPoint.orders}</span></p>
                          {hoveredPoint.aov > 0 && (
                            <p className="font-medium text-slate-300">AOV: <span className="font-bold text-white">₹{hoveredPoint.aov}</span></p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Device & Conversion breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 font-saas">Device Distribution</h3>
                    <p className="text-[10px] text-slate-400 mb-6">Visitor logins by platform device profile</p>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                          <span>🖥️ Desktop</span>
                          <span>{deviceStats.desktop}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-slate-900 rounded-full" style={{ width: `${deviceStats.desktop}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 mb-1">
                          <span>📱 Mobile / Tablet</span>
                          <span>{deviceStats.mobile}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-slate-900 rounded-full" style={{ width: `${deviceStats.mobile}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-4 mt-6">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Average Conversion Rate</span>
                      <span className="text-emerald-500">
                        {summary ? ((summary.totalTransactions / Math.max(summary.uniqueVisitors || 1, 1)) * 100).toFixed(2) : '3.24'}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Conversion Funnel & Template Sales Revenue */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Funnel chart */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Conversion Funnel Analytics</h3>
                    <p className="text-[10px] text-slate-400">Step-by-step platform conversion and drop-off rate tracking</p>
                  </div>
                  
                  {(() => {
                    const visitors = summary?.uniqueVisitors || 0
                    const signups = summary?.totalMembers || 0
                    const customized = Object.values(summary?.templateUsage || {}).reduce((sum, v) => sum + v, 0)
                    const purchasesCount = summary?.totalTransactions || 0
                    
                    const stages = [
                      { label: '1. Unique Visitors', val: visitors, rate: 100, color: 'bg-blue-600' },
                      { label: '2. Registered Users', val: signups, rate: visitors > 0 ? Math.round((signups / visitors) * 100) : 0, color: 'bg-indigo-600' },
                      { label: '3. Customized Invites', val: customized, rate: signups > 0 ? Math.round((customized / signups) * 100) : 0, color: 'bg-purple-600' },
                      { label: '4. Paid Purchases', val: purchasesCount, rate: customized > 0 ? Math.round((purchasesCount / customized) * 100) : 0, color: 'bg-emerald-600' }
                    ]
                    
                    return (
                      <div className="space-y-4 pt-2">
                        {stages.map((stage, idx) => {
                          const prevStage = idx > 0 ? stages[idx - 1] : null
                          const dropoff = prevStage ? 100 - Math.round((stage.val / Math.max(prevStage.val, 1)) * 100) : 0
                          
                          return (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                                <span>{stage.label}</span>
                                <span className="font-mono text-slate-900">{stage.val.toLocaleString()} ({stage.rate}%)</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="h-4 flex-1 rounded-full bg-slate-100 overflow-hidden">
                                  <div className={`h-full rounded-full ${stage.color} transition-all duration-500`} style={{ width: `${stage.rate}%` }} />
                                </div>
                                {idx > 0 && (
                                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full shrink-0">
                                    ↓ {dropoff}% drop-off
                                  </span>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>

                {/* Template Sales Revenue Distribution */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Revenue by Template</h3>
                    <p className="text-[10px] text-slate-400 mb-4">Earnings distribution share from customer purchases</p>
                    
                    <div className="space-y-4">
                      {purchasedTemplateAnalytics.map((t, idx) => {
                        const totalRevenue = purchasedTemplateAnalytics.reduce((sum, item) => sum + item.revenue, 0)
                        const percentage = totalRevenue > 0 ? Math.round((t.revenue / totalRevenue) * 100) : 0
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-700">
                              <span className="capitalize">{t.name}</span>
                              <span className="font-mono">₹{t.revenue.toLocaleString()} ({percentage}%)</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-slate-900 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
                            </div>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>{t.purchases} {t.purchases === 1 ? 'purchase' : 'purchases'}</span>
                              <span>avg ₹{t.purchases > 0 ? Math.round(t.revenue / t.purchases) : 0}/order</span>
                            </div>
                          </div>
                        )
                      })}
                      {purchasedTemplateAnalytics.length === 0 && (
                        <div className="py-8 text-center text-xs text-slate-400">No template purchases recorded yet.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary table highlights */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Purchases highlight */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Recent Purchases &amp; Custom Orders</h3>
                      <p className="text-[10px] text-slate-400">Latest online payments and customized client bookings</p>
                    </div>
                    <button onClick={() => setActiveTab('transactions')} className="text-xs font-bold text-slate-500 hover:text-slate-900">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 overflow-hidden">
                    {allPurchases.slice(0, 5).map((p, idx) => {
                      const views = getInviteViews(p.code, p.deliverableUrl)
                      return (
                        <div 
                          key={idx} 
                          onClick={() => setSelectedPurchase(p)}
                          className="flex items-center justify-between py-3 cursor-pointer hover:bg-slate-50 px-2.5 rounded-xl transition-all duration-200"
                        >
                          <div className="space-y-0.5 max-w-[60%]">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-slate-800 truncate">{p.userName || 'Customer'}</p>
                              {p.isCustom ? (
                                <span className="rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-1.5 py-0.2 text-[8px] font-bold">
                                  Custom Order
                                </span>
                              ) : (
                                <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.2 text-[8px] font-bold">
                                  Web Order
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                              <span className="font-mono">{p.code || p.inviteId}</span>
                              {views > 0 && (
                                <span className="text-blue-600 font-semibold flex items-center gap-0.5">
                                  👁️ {views} {views === 1 ? 'view' : 'views'}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex flex-col items-end gap-1">
                            <p className="text-xs font-bold text-slate-800 font-mono">₹{(p.amountPaid || 0).toLocaleString('en-IN')}</p>
                            <span className={`rounded-full px-2 py-0.2 text-[9px] font-bold ${
                              p.status === 'Completed' || p.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {p.status || 'Paid'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                    {allPurchases.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">No purchases or custom orders found.</div>
                    )}
                  </div>
                </div>

                {/* Templates Reach highlight */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">Top Viewed Templates</h3>
                      <p className="text-[10px] text-slate-400">Popular invitation designs</p>
                    </div>
                    <button onClick={() => setActiveTab('templates')} className="text-xs font-bold text-slate-500 hover:text-slate-900">
                      View All
                    </button>
                  </div>
                  <div className="space-y-3">
                    {templateAnalytics.slice(0, 4).map((t, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>{t.name}</span>
                          <span>{t.views} views</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div className="h-full bg-slate-950 rounded-full" style={{ width: `${Math.min((t.views / Math.max(...templateAnalytics.map(o => o.views), 1)) * 100, 100)}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Coupon ROI Tracker & Recent Sign-ups */}
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Coupon ROI Tracker */}
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Coupon Marketing Performance (ROI Tracker)</h3>
                    <p className="text-[10px] text-slate-400">Campaign returns, usages, and discounts given</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-slate-500">
                      <thead className="border-b border-slate-100 bg-slate-50 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-4 py-3">Promo Code</th>
                          <th className="px-4 py-3">Discount Rate</th>
                          <th className="px-4 py-3">Usage Count</th>
                          <th className="px-4 py-3">Discounts Given</th>
                          <th className="px-4 py-3">Net Revenue</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {couponRoiData.slice(0, 5).map((c, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="px-4 py-3 font-mono font-bold text-slate-900 uppercase">{c.code}</td>
                            <td className="px-4 py-3 font-semibold text-slate-800">{c.discountPercentage || 'N/A'}%</td>
                            <td className="px-4 py-3 font-bold text-slate-900">{c.usageCount} uses</td>
                            <td className="px-4 py-3 text-red-500 font-semibold">-₹{Math.round(c.discountGiven).toLocaleString()}</td>
                            <td className="px-4 py-3 font-extrabold text-emerald-600">₹{Math.round(c.netRevenue).toLocaleString()}</td>
                          </tr>
                        ))}
                        {couponRoiData.length === 0 && (
                          <tr>
                            <td colSpan="5" className="py-6 text-center text-xs text-slate-400">No coupon campaign activities recorded.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Registered Users Mini Feed */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-bold text-slate-800">Recent Sign-ups</h3>
                        <p className="text-[10px] text-slate-400">Recently registered platform members</p>
                      </div>
                      <button onClick={() => setActiveTab('users')} className="text-xs font-bold text-slate-500 hover:text-slate-900">
                        View All
                      </button>
                    </div>
                    <div className="divide-y divide-slate-100 overflow-hidden mt-3">
                      {usersData.slice(0, 4).map((u, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3">
                          <div className="truncate max-w-[150px]">
                            <p className="text-xs font-bold text-slate-800 truncate">{u.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{u.email}</p>
                          </div>
                          <span className="text-[9px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full shrink-0">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric'
                            }) : 'N/A'}
                          </span>
                        </div>
                      ))}
                      {usersData.length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400">No user sign-ups found.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSACTIONS */}
          {activeTab === 'transactions' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                {/* Search & filters */}
                <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={txSearch}
                    onChange={(e) => { setTxSearch(e.target.value); setTxPage(1); }}
                    placeholder="Search Order ID, Customer, Email, Link..."
                    className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-slate-900 transition-colors"
                  />
                  <select
                    value={txTemplateFilter}
                    onChange={(e) => { setTxTemplateFilter(e.target.value); setTxPage(1); }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none font-bold"
                  >
                    <option value="ALL">All Types &amp; Templates</option>
                    <option value="CUSTOM">🎨 Custom Client Orders</option>
                    {templates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>
                
                {/* Export button */}
                <button
                  onClick={exportTransactionsCsv}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition flex items-center gap-1.5"
                >
                  <span>📥</span> Export CSV
                </button>
              </div>

              {/* Transactions Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-500">
                  <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Order ID &amp; Type</th>
                      <th className="px-6 py-4">Customer &amp; Live Link</th>
                      <th className="px-6 py-4">Email / Contact</th>
                      <th className="px-6 py-4">Template / Scope</th>
                      <th className="px-6 py-4">Amount Paid</th>
                      <th className="px-6 py-4">Source / Coupon</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Method</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedPurchases.map((p, idx) => {
                      const views = getInviteViews(p.code, p.deliverableUrl)
                      return (
                        <tr 
                          key={idx} 
                          onClick={() => setSelectedPurchase(p)}
                          className="hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="font-bold text-slate-900 font-mono truncate max-w-[130px]">{p.code || p.inviteId}</span>
                              {p.isCustom ? (
                                <span className="inline-block rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.2 text-[8px] font-bold w-fit">
                                  Custom Order
                                </span>
                              ) : (
                                <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.2 text-[8px] font-bold w-fit">
                                  Web Purchase
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-semibold text-slate-800 block">{p.userName || 'Customer'}</span>
                            {p.deliverableUrl ? (
                              <div className="flex items-center gap-1.5 mt-0.5" onClick={(e) => e.stopPropagation()}>
                                <a
                                  href={p.deliverableUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[10px] text-indigo-600 hover:underline font-mono truncate max-w-[160px]"
                                >
                                  🔗 {p.deliverableUrl}
                                </a>
                                <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 rounded-full shrink-0">
                                  👁️ {views}
                                </span>
                              </div>
                            ) : views > 0 ? (
                              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 rounded-full mt-0.5 inline-block">
                                👁️ {views} views
                              </span>
                            ) : null}
                          </td>
                          <td className="px-6 py-4">{p.userEmail || p.phone || 'N/A'}</td>
                          <td className="px-6 py-4 font-medium text-slate-700 capitalize max-w-[180px] truncate">
                            {p.templateId ? p.templateId.replace(/-/g, ' ') : 'N/A'}
                          </td>
                          <td className="px-6 py-4">
                            <span className="font-bold text-slate-900 font-mono block">₹{(p.amountPaid || 0).toLocaleString('en-IN')}</span>
                            {p.remainingBalance > 0 && (
                              <span className="text-[9px] text-amber-600 font-bold block">Due: ₹{p.remainingBalance.toLocaleString('en-IN')}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            {p.couponCode ? (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-600 font-bold">{p.couponCode}</span>
                            ) : (
                              <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">{p.source || 'Direct'}</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                              p.status === 'Completed' || p.status === 'Paid'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}>
                              {p.status || 'Paid'}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-[11px] truncate max-w-[120px]">
                            {p.isCustom ? (p.razorpayPaymentId || 'UPI / Direct') : 'Razorpay'}
                          </td>
                          <td className="px-6 py-4">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}</td>
                        </tr>
                      )
                    })}
                    {filteredPurchases.length === 0 && (
                      <tr>
                        <td colSpan="9" className="py-10 text-center text-xs text-slate-400">No transactions or custom orders recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedPurchases.map((p, idx) => {
                  const views = getInviteViews(p.code, p.deliverableUrl)
                  return (
                    <div 
                      key={idx} 
                      onClick={() => setSelectedPurchase(p)}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3 cursor-pointer hover:bg-slate-50 transition-all duration-200"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Order ID:</span>
                            <span className="text-xs font-bold text-slate-900 font-mono truncate">{p.code || p.inviteId}</span>
                          </div>
                          {p.isCustom ? (
                            <span className="inline-block rounded-full bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.2 text-[8px] font-bold mt-0.5">
                              Custom Order
                            </span>
                          ) : (
                            <span className="inline-block rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.2 text-[8px] font-bold mt-0.5">
                              Web Purchase
                            </span>
                          )}
                        </div>
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${
                          p.status === 'Completed' || p.status === 'Paid'
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {p.status || 'Paid'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Customer</span>
                          <span className="font-bold text-slate-800">{p.userName || 'Customer'}</span>
                          {views > 0 && (
                            <span className="text-[9px] font-bold text-blue-600 block mt-0.5">👁️ {views} views</span>
                          )}
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Email / Contact</span>
                          <span className="text-slate-600 break-all">{p.userEmail || p.phone || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Template / Scope</span>
                          <span className="font-semibold text-slate-700 capitalize truncate block">
                            {p.templateId ? p.templateId.replace(/-/g, ' ') : 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Amount Paid</span>
                          <span className="font-bold text-slate-900 font-mono">₹{(p.amountPaid || 0).toLocaleString('en-IN')}</span>
                          {p.remainingBalance > 0 && (
                            <span className="text-[9px] text-amber-600 block font-semibold">Bal: ₹{p.remainingBalance}</span>
                          )}
                        </div>
                      </div>

                      {p.deliverableUrl && (
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]" onClick={(e) => e.stopPropagation()}>
                          <span className="font-mono text-indigo-600 font-semibold truncate max-w-[70%]">
                            🔗 {p.deliverableUrl}
                          </span>
                          <a
                            href={p.deliverableUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded bg-indigo-600 text-white px-2 py-0.5 font-bold text-[10px]"
                          >
                            Open ↗
                          </a>
                        </div>
                      )}
                    </div>
                  )
                })}
                {filteredPurchases.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                    No transactions or custom orders recorded.
                  </div>
                )}
              </div>

              {/* Pagination controls */}
              {filteredPurchases.length > txPerPage && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="text-xs text-slate-400">
                    Showing <span className="font-bold text-slate-700">{(txPage - 1) * txPerPage + 1}</span> to <span className="font-bold text-slate-700">{Math.min(txPage * txPerPage, filteredPurchases.length)}</span> of <span className="font-bold text-slate-700">{filteredPurchases.length}</span> orders
                  </span>
                  <div className="flex gap-2">
                    <button
                      disabled={txPage === 1}
                      onClick={() => setTxPage(prev => prev - 1)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <button
                      disabled={txPage === totalTxPages}
                      onClick={() => setTxPage(prev => prev + 1)}
                      className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TEMPLATES */}
          {activeTab === 'templates' && (
            <div className="space-y-6">
              {/* Template Analytics List */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Template Conversion Details</h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                    <span>Sort By:</span>
                    <select
                      value={templateSortBy}
                      onChange={(e) => setTemplateSortBy(e.target.value)}
                      className="rounded border border-slate-200 bg-white px-2 py-1 text-slate-700 outline-none"
                    >
                      <option value="views">Views</option>
                      <option value="purchases">Purchases</option>
                      <option value="rate">Conversion Rate</option>
                      <option value="revenue">Revenue</option>
                    </select>
                    <button
                      onClick={() => setTemplateSortAsc(!templateSortAsc)}
                      className="rounded border border-slate-200 bg-white px-2.5 py-1 text-slate-700"
                    >
                      {templateSortAsc ? '↑' : '↓'}
                    </button>
                  </div>
                </div>

                {/* Desktop View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-500">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Template ID / Name</th>
                        <th className="px-6 py-4">Preview Views</th>
                        <th className="px-6 py-4">Purchased Invite Views</th>
                        <th className="px-6 py-4">Total Views</th>
                        <th className="px-6 py-4">Purchases Count</th>
                        <th className="px-6 py-4">Conversion Rate</th>
                        <th className="px-6 py-4">Revenue Generated</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {templateAnalytics.map((t, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-bold text-slate-900 capitalize">{t.name.replace(/-/g, ' ')}</td>
                          <td className="px-6 py-4 font-semibold text-slate-500">{t.previewViews} views</td>
                          <td className="px-6 py-4 font-semibold text-slate-500">{t.purchaseViews} views</td>
                          <td className="px-6 py-4 font-bold text-slate-800">{t.views} total</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{t.purchases} sales</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <span className="font-bold text-slate-800 w-10">{t.rate}%</span>
                              <div className="h-2 w-24 rounded-full bg-slate-100 overflow-hidden hidden sm:block">
                                <div 
                                  className={`h-full rounded-full ${t.rate > 4 ? 'bg-emerald-500' : t.rate > 1.5 ? 'bg-amber-500' : 'bg-red-500'}`} 
                                  style={{ width: `${Math.min(t.rate * 10, 100)}%` }} 
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-900">₹{t.revenue.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile/Tablet Card View */}
                <div className="grid grid-cols-1 gap-4 md:hidden">
                  {templateAnalytics.map((t, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <span className="text-sm font-extrabold text-slate-900 capitalize">{t.name.replace(/-/g, ' ')}</span>
                        <span className="text-xs font-bold text-slate-500">{t.views} total views</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Preview Views</span>
                          <span className="font-semibold text-slate-600">{t.previewViews} views</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Purchased Views</span>
                          <span className="font-semibold text-slate-600">{t.purchaseViews} views</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Purchases</span>
                          <span className="font-bold text-slate-800">{t.purchases} sales</span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Revenue</span>
                          <span className="font-extrabold text-slate-900">₹{t.revenue.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100">
                        <div className="flex justify-between text-xs font-bold text-slate-700">
                          <span>Conversion Rate (on Previews)</span>
                          <span>{t.rate}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${t.rate > 4 ? 'bg-emerald-500' : t.rate > 1.5 ? 'bg-amber-500' : 'bg-red-500'}`} 
                            style={{ width: `${Math.min(t.rate * 10, 100)}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: COUPONS */}
          {activeTab === 'coupons' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Left Column: Create Coupon Form */}
              <div className="lg:col-span-1 space-y-6">
                {/* Single Form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-slate-800">Create Single Coupon</h3>
                  
                  {couponError && <p className="text-xs font-bold text-red-500">{couponError}</p>}
                  {couponSuccess && <p className="text-xs font-bold text-emerald-500">{couponSuccess}</p>}

                  <form onSubmit={handleCreateCoupon} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Coupon Code</label>
                      <input
                        type="text"
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        placeholder="e.g. WELCOME50"
                        className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-slate-900 transition-colors uppercase font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Discount Percentage</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={newCouponDiscount}
                        onChange={(e) => setNewCouponDiscount(e.target.value)}
                        placeholder="e.g. 50"
                        className="mt-1 block w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-slate-900 transition-colors"
                      />
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow hover:opacity-90 active:scale-[0.98] transition">
                      Create Coupon
                    </button>
                  </form>
                </div>

                {/* Bulk Form */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-slate-800">Bulk CSV Upload</h3>
                    <button onClick={downloadSampleCsv} className="text-[10px] font-bold text-slate-400 hover:text-slate-900 hover:underline">
                      Download Sample
                    </button>
                  </div>

                  {bulkError && <p className="text-xs font-bold text-red-500">{bulkError}</p>}
                  {bulkSuccess && <p className="text-xs font-bold text-emerald-500">{bulkSuccess}</p>}

                  <form onSubmit={handleBulkCsvUpload} className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">CSV Data (CODE,PERCENTAGE)</label>
                      <textarea
                        value={bulkCsvText}
                        onChange={(e) => setBulkCsvText(e.target.value)}
                        placeholder="SUMMER30,30&#10;FESTIVAL15,15"
                        rows="4"
                        className="mt-1 block w-full rounded-xl border border-slate-200 p-3 text-xs outline-none focus:border-slate-900 transition-colors font-mono"
                      />
                    </div>
                    <button type="submit" className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white shadow hover:opacity-90 active:scale-[0.98] transition">
                      Upload Bulk Coupons
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Column: Coupon list */}
              <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800">Active Coupon Codes</h3>
                  {coupons.length > 0 && (
                    <button
                      onClick={exportCouponsCsv}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition"
                    >
                      📥 Export CSV
                    </button>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-500">
                    <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-6 py-4">Code</th>
                        <th className="px-6 py-4">Discount</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {coupons.map((c, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-6 py-4 font-mono font-bold text-slate-900 uppercase">{c.code}</td>
                          <td className="px-6 py-4 font-semibold text-slate-800">{c.discountPercentage}% Off</td>
                          <td className="px-6 py-4">
                            {c.available ? (
                              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Available</span>
                            ) : (
                              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">Used</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleDeleteCoupon(c.id)}
                              className="rounded-lg bg-red-50 px-2.5 py-1 text-[10px] font-bold text-red-600 hover:bg-red-100 transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {coupons.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-10 text-center text-xs text-slate-400">No active coupons available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: WEBSITE */}
          {activeTab === 'website' && (
            <div className="space-y-8">
              {/* Site Performance Indicators */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Traffic Breakdown */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Traffic Cohort</h3>
                    <p className="text-[10px] text-slate-400">Audience composition breakdown</p>
                  </div>
                  
                  {/* Custom visual ring chart using SVG */}
                  <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
                    <svg width="100%" height="100%" viewBox="0 0 36 36" className="transform -rotate-90">
                      <circle cx="18" cy="18" r="15.91" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                      <circle 
                        cx="18" 
                        cy="18" 
                        r="15.91" 
                        fill="none" 
                        stroke="#0f172a" 
                        strokeWidth="3" 
                        strokeDasharray="65 100" 
                      />
                    </svg>
                    <div className="absolute text-center">
                      <p className="text-sm font-extrabold text-slate-800">65%</p>
                      <p className="text-[8px] font-bold text-slate-400 uppercase">New</p>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs font-bold text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-900" />
                      <span>New: {summary?.uniqueVisitors || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                      <span>Returning: {summary?.returningVisitors || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Bounce Rate */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Bounce Rate</h3>
                    <p className="text-[10px] text-slate-400">Percentage of single page sessions</p>
                  </div>
                  <div className="py-4 text-center">
                    <span className="text-5xl font-black text-slate-900">{summary?.bounceRate || '42.5'}%</span>
                    <p className="mt-2 text-xs font-bold text-emerald-500">↓ 2.4% last month</p>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center leading-normal pt-4 border-t border-slate-100">
                    Industry standard for Wedding SaaS platforms falls between 40% and 55%.
                  </p>
                </div>

                {/* Session stays */}
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-800">Average Stay Duration</h3>
                    <p className="text-[10px] text-slate-400">Total engagement times per visitor</p>
                  </div>
                  <div className="py-4 text-center">
                    <span className="text-5xl font-black text-slate-900">4m 44s</span>
                    <p className="mt-2 text-xs font-bold text-emerald-500">↑ 18s last month</p>
                  </div>
                  <p className="text-[10px] text-slate-400 text-center leading-normal pt-4 border-t border-slate-100">
                    High stay times correlate directly with a 3.4x higher conversion rate.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: REGISTERED USERS */}
          {activeTab === 'users' && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-800">Registered Users Console</h3>
                  <p className="text-[10px] text-slate-400">Total registered members: {usersTotalItems}</p>
                </div>
              </div>

              {usersLoading ? (
                <div className="py-16 text-center text-xs font-semibold text-slate-400">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-900 border-t-transparent mx-auto mb-3" />
                  Loading registered members...
                </div>
              ) : (
                <>
                  {/* Desktop view */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs text-slate-500">
                      <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        <tr>
                          <th className="px-6 py-4">User Name</th>
                          <th className="px-6 py-4">Email Address</th>
                          <th className="px-6 py-4">Registration Date & Time</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {usersData.map((u, idx) => (
                          <tr key={u.id || idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-900">{u.name}</td>
                            <td className="px-6 py-4 font-semibold text-slate-800">{u.email}</td>
                            <td className="px-6 py-4 text-slate-500">
                              {u.createdAt ? new Date(u.createdAt).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }) : 'N/A'}
                            </td>
                          </tr>
                        ))}
                        {usersData.length === 0 && (
                          <tr>
                            <td colSpan="3" className="py-10 text-center text-xs text-slate-400">No users found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile/Tablet Card View */}
                  <div className="grid grid-cols-1 gap-4 md:hidden">
                    {usersData.map((u, idx) => (
                      <div key={u.id || idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                          <span className="text-xs font-bold text-slate-900">{u.name}</span>
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500">
                            User
                          </span>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Email</span>
                            <span className="font-semibold text-slate-800 break-all">{u.email}</span>
                          </div>
                          <div>
                            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Registered At</span>
                            <span className="text-slate-600">
                              {u.createdAt ? new Date(u.createdAt).toLocaleString(undefined, {
                                dateStyle: 'medium',
                                timeStyle: 'short'
                              }) : 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                    {usersData.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                        No users registered.
                      </div>
                    )}
                  </div>

                  {/* Pagination controls */}
                  {usersTotalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs text-slate-400">
                        Page <span className="font-bold text-slate-700">{usersPage}</span> of <span className="font-bold text-slate-700">{usersTotalPages}</span>
                      </span>
                      <div className="flex gap-2">
                        <button
                          disabled={usersPage === 1}
                          onClick={() => setUsersPage(prev => prev - 1)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-40"
                        >
                          Previous
                        </button>
                        <button
                          disabled={usersPage === usersTotalPages}
                          onClick={() => setUsersPage(prev => prev + 1)}
                          className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 disabled:opacity-40"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Selected Purchase Detail Modal */}
      <AnimatePresence>
        {selectedPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/40 backdrop-blur-sm">
            {/* Backdrop Click */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPurchase(null)}
              className="absolute inset-0"
            />

            {/* Modal Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl"
            >
              {/* Header */}
              <div className="flex h-16 items-center justify-between border-b border-slate-100 px-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-950">Purchase Details</h3>
                  <p className="text-[10px] text-slate-400 font-mono">{selectedPurchase.code || selectedPurchase.inviteId}</p>
                </div>
                <button 
                  onClick={() => setSelectedPurchase(null)}
                  className="rounded-full p-2 hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Couple Card */}
                <div className="rounded-2xl bg-gradient-to-tr from-amber-50/50 to-rose-50/50 border border-rose-100/50 p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                      💍 Active Wedding
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 capitalize">
                      {selectedPurchase.templateId ? selectedPurchase.templateId.replace(/-/g, ' ') : 'N/A'}
                    </span>
                  </div>

                  <div className="text-center py-2">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">The Couple</p>
                    <h4 className="text-xl font-extrabold text-slate-900 mt-1">
                      {selectedPurchase.groomName && selectedPurchase.brideName 
                        ? `${selectedPurchase.groomName} & ${selectedPurchase.brideName}`
                        : selectedPurchase.coupleNames || selectedPurchase.userName || 'No Names Provided'}
                    </h4>
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Invite Views</span>
                    <span className="text-xl font-extrabold text-slate-950 font-mono">
                      {getInviteViews(selectedPurchase.code || selectedPurchase.inviteId, selectedPurchase.deliverableUrl).toLocaleString()}
                    </span>
                    <span className="text-[9px] text-slate-400 block mt-0.5">guest page views</span>
                  </div>

                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Amount Paid</span>
                    <span className="text-xl font-extrabold text-slate-950 font-mono">₹{(selectedPurchase.amountPaid || 0).toLocaleString('en-IN')}</span>
                    {selectedPurchase.remainingBalance > 0 ? (
                      <span className="text-[9px] text-amber-600 font-bold block mt-0.5">
                        Due: ₹{selectedPurchase.remainingBalance.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">Fully Paid</span>
                    )}
                  </div>
                </div>

                {/* Deliverable URLs if custom order */}
                {selectedPurchase.deliverableUrl && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Deliverable Links</h4>
                    <div className="space-y-1.5">
                      {(selectedPurchase.deliverableUrls || [selectedPurchase.deliverableUrl]).map((url, uidx) => (
                        <div key={uidx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                          <span className="font-mono text-indigo-700 font-semibold truncate max-w-[70%]">{url}</span>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-lg bg-slate-900 text-white px-2.5 py-1 text-[10px] font-bold shadow-2xs hover:bg-slate-800"
                          >
                            Open ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Order Details */}
                <div className="space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Transaction &amp; Billing</h4>
                  
                  <div className="rounded-2xl border border-slate-100 divide-y divide-slate-100 overflow-hidden text-xs">
                    <div className="flex justify-between p-4 bg-slate-50/30">
                      <span className="font-semibold text-slate-500">Customer Name</span>
                      <span className="font-bold text-slate-900">{selectedPurchase.userName || 'Customer'}</span>
                    </div>

                    <div className="flex justify-between p-4 bg-slate-50/30">
                      <span className="font-semibold text-slate-500">Contact / Email</span>
                      <span className="font-semibold text-slate-800 break-all">{selectedPurchase.userEmail || selectedPurchase.phone || 'N/A'}</span>
                    </div>

                    <div className="flex justify-between p-4 bg-slate-50/30">
                      <span className="font-semibold text-slate-500">Payment ID / Source</span>
                      <span className="font-mono font-bold text-slate-900 truncate max-w-[180px]">
                        {selectedPurchase.razorpayPaymentId || selectedPurchase.source || 'N/A'}
                      </span>
                    </div>

                    {selectedPurchase.couponCode && (
                      <div className="flex justify-between p-4 bg-slate-50/30">
                        <span className="font-semibold text-slate-500">Coupon Used</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-slate-600">
                          {selectedPurchase.couponCode}
                        </span>
                      </div>
                    )}

                    <div className="flex justify-between p-4 bg-slate-50/30">
                      <span className="font-semibold text-slate-500">Amount Paid</span>
                      <span className="font-bold text-emerald-600 font-mono">₹{(selectedPurchase.amountPaid || 0).toLocaleString('en-IN')}</span>
                    </div>

                    <div className="flex justify-between p-4 bg-slate-50/30">
                      <span className="font-semibold text-slate-500">Payment Date</span>
                      <span className="font-semibold text-slate-700">
                        {selectedPurchase.paidAt ? new Date(selectedPurchase.paidAt).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="border-t border-slate-100 p-6 flex gap-3">
                <a
                  href={selectedPurchase.deliverableUrl || `/templates/${selectedPurchase.templateId}/${selectedPurchase.code || selectedPurchase.inviteId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-slate-900 py-3 text-center text-xs font-bold text-white shadow hover:opacity-90 transition active:scale-[0.98]"
                >
                  🔗 View Live Invitation
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {/* CUSTOM CLIENT TEMPLATE PROVISIONING MODAL */}
        {showCustomModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCustomModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>✨</span> Provision Custom Client Template
                  </h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">
                    Assign a bespoke template, generate login credentials, and enable self-service editing for your client
                  </p>
                </div>
                <button
                  onClick={() => setShowCustomModal(false)}
                  className="h-8 w-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center text-sm transition"
                >
                  ✕
                </button>
              </div>

              {customProvisionSuccess ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 space-y-2">
                    <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                      <span>✓</span> Custom Invitation Provisioned Successfully!
                    </div>
                    <p className="text-xs text-emerald-700">
                      The template has been linked to <strong>{customProvisionSuccess.clientEmail}</strong> with code <strong>{customProvisionSuccess.code}</strong>.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">WhatsApp Onboarding Message</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(customProvisionSuccess.whatsappText)
                          setCopiedPkg(true)
                          setTimeout(() => setCopiedPkg(false), 2000)
                        }}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm ${
                          copiedPkg ? 'bg-emerald-600 text-white' : 'bg-slate-900 hover:bg-slate-800 text-white'
                        }`}
                      >
                        {copiedPkg ? '✓ Copied Message' : '📋 Copy WhatsApp Message'}
                      </button>
                    </div>

                    <pre className="text-xs font-mono bg-white p-3 rounded-xl border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto">
                      {customProvisionSuccess.whatsappText}
                    </pre>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <a
                      href={customProvisionSuccess.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-3 text-center transition"
                    >
                      🔗 Live Invite
                    </a>
                    <a
                      href={customProvisionSuccess.editUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold py-3 text-center transition"
                    >
                      ✏️ Edit in Builder
                    </a>
                    <a
                      href={customProvisionSuccess.rsvpUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold py-3 text-center transition"
                    >
                      💌 RSVP Dashboard
                    </a>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setShowCustomModal(false)}
                      className="rounded-full bg-slate-900 text-white text-xs font-bold px-8 py-3 transition hover:opacity-90 shadow-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProvisionCustomTemplate} className="space-y-6">
                  {customError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-600">
                      ⚠️ {customError}
                    </div>
                  )}

                  {/* Customer Credentials */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">1. Client Account Credentials</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Client Name <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          required
                          value={customClientData.clientName}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, clientName: e.target.value }))}
                          placeholder="e.g. Pavitra & Sri"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Client Email (Login ID) <span className="text-red-500">*</span></label>
                        <input
                          type="email"
                          required
                          value={customClientData.clientEmail}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, clientEmail: e.target.value }))}
                          placeholder="client@gmail.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Template & Code */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">2. Template &amp; Route Mapping</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Base Template</label>
                        <select
                          value={customClientData.templateId}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, templateId: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
                        >
                          <option value="midnight-waltz">Midnight Waltz (Bespoke)</option>
                          <option value="sunflower-fields">Sunflower Fields</option>
                          <option value="twilight-serenade">Twilight Serenade</option>
                          <option value="everlasting-vows">Everlasting Vows</option>
                          <option value="aura-of-elegance">Aura of Elegance</option>
                          <option value="modern-hearth">Modern Hearth</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Custom Code</label>
                        <input
                          type="text"
                          value={customClientData.customCode}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, customCode: e.target.value.toUpperCase() }))}
                          placeholder="PAVITRASRI"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition font-mono uppercase"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Custom URL Slug</label>
                        <input
                          type="text"
                          value={customClientData.customRoute}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, customRoute: e.target.value }))}
                          placeholder="/template/midnight-waltz/Pavitra-Sri/1"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition text-slate-700"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Wedding Details */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">3. Initial Preset Data (Preloaded in Builder)</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Groom's Name</label>
                        <input
                          type="text"
                          value={customClientData.groomName}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, groomName: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Bride's Name</label>
                        <input
                          type="text"
                          value={customClientData.brideName}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, brideName: e.target.value }))}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Date (Day Month Year)</label>
                        <div className="grid grid-cols-3 gap-2">
                          <input
                            type="text"
                            value={customClientData.weddingDate}
                            onChange={(e) => setCustomClientData(prev => ({ ...prev, weddingDate: e.target.value }))}
                            placeholder="15"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs text-center font-semibold outline-none focus:border-slate-900 focus:bg-white"
                          />
                          <input
                            type="text"
                            value={customClientData.weddingMonth}
                            onChange={(e) => setCustomClientData(prev => ({ ...prev, weddingMonth: e.target.value }))}
                            placeholder="July"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs text-center font-semibold outline-none focus:border-slate-900 focus:bg-white"
                          />
                          <input
                            type="text"
                            value={customClientData.weddingYear}
                            onChange={(e) => setCustomClientData(prev => ({ ...prev, weddingYear: e.target.value }))}
                            placeholder="2026"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-2 py-2.5 text-xs text-center font-semibold outline-none focus:border-slate-900 focus:bg-white"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Ceremony Time</label>
                        <input
                          type="text"
                          value={customClientData.weddingTime}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, weddingTime: e.target.value }))}
                          placeholder="09:00 AM - 10:30 AM"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">Venue / Mahal Name</label>
                        <input
                          type="text"
                          value={customClientData.mahalName}
                          onChange={(e) => setCustomClientData(prev => ({ ...prev, mahalName: e.target.value }))}
                          placeholder="The Leela Palace"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white transition"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-700">City &amp; State</label>
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            type="text"
                            value={customClientData.venueCity}
                            onChange={(e) => setCustomClientData(prev => ({ ...prev, venueCity: e.target.value }))}
                            placeholder="Bangalore"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white"
                          />
                          <input
                            type="text"
                            value={customClientData.state}
                            onChange={(e) => setCustomClientData(prev => ({ ...prev, state: e.target.value }))}
                            placeholder="Karnataka"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-xs font-semibold outline-none focus:border-slate-900 focus:bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Addon / Features */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Enable RSVP &amp; Guest Management Suite</span>
                      <span className="text-[11px] text-slate-500">Gives the client their personal live RSVP dashboard</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={Boolean(customClientData.hasRsvp)}
                      onChange={(e) => setCustomClientData(prev => ({ ...prev, hasRsvp: e.target.checked }))}
                      className="h-5 w-5 rounded accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCustomModal(false)}
                      className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={customLoading}
                      className="flex-[2] rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 text-xs font-bold shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2 active:scale-98"
                    >
                      {customLoading ? 'Provisioning...' : '✨ Generate Credentials & Assign Template'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
