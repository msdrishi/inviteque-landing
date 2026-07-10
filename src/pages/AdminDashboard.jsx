import { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { API_URL } from '../config'
import { motion, AnimatePresence } from 'framer-motion'

const logo = "https://res.cloudinary.com/djbxuk2xr/image/upload/v1782036334/nuyo9eosd2rhpesywkt0.png"

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
  const [activeTab, setActiveTab] = useState('overview') // 'overview', 'transactions', 'templates', 'coupons', 'website'
  const [timeframe, setTimeframe] = useState('month') // 'week' (7 days), 'month' (30 days), 'year' (12 months)

  // API Data states
  const [summary, setSummary] = useState(null)
  const [purchases, setPurchases] = useState([])
  const [visitors, setVisitors] = useState([])
  const [coupons, setCoupons] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  // Template Analytics processor
  const templateAnalytics = useMemo(() => {
    if (!summary) return []
    const reach = summary.templateReach || {}

    const templateNames = {
      'royal-wedding': 'Royal Wedding',
      'aura-of-elegance': 'Aura of Elegance',
      'timeless-grace': 'Timeless Grace',
      'minimal-love': 'Minimal Love',
      'floral-romance': 'Floral Romance',
      'modern-chic': 'Modern Chic'
    }

    const data = Object.keys(templateNames).map(key => {
      const views = reach[key] || 0
      
      // Calculate actual paid purchases and revenue from the purchases state
      const templatePurchases = purchases.filter(p => p.templateId === key)
      const purchasesCount = templatePurchases.length
      const revenue = templatePurchases.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
      
      const rate = views > 0 ? ((purchasesCount / views) * 100).toFixed(1) : '0.0'

      return {
        id: key,
        name: templateNames[key],
        views,
        purchases: purchasesCount,
        rate: parseFloat(rate),
        revenue
      }
    })

    // Sort templates
    return data.sort((a, b) => {
      let fieldA = a[templateSortBy]
      let fieldB = b[templateSortBy]
      if (templateSortAsc) {
        return fieldA > fieldB ? 1 : -1
      } else {
        return fieldA < fieldB ? 1 : -1
      }
    })
  }, [summary, purchases, templateSortBy, templateSortAsc])

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

  // Filter & Search recent transactions
  const filteredPurchases = useMemo(() => {
    return purchases.filter(p => {
      const matchesSearch = 
        p.code?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.userName?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.userEmail?.toLowerCase().includes(txSearch.toLowerCase()) ||
        p.razorpayPaymentId?.toLowerCase().includes(txSearch.toLowerCase())

      const matchesStatus = txStatusFilter === 'ALL' || (p.amountPaid > 0 && txStatusFilter === 'PAID')
      const matchesTemplate = txTemplateFilter === 'ALL' || p.templateId === txTemplateFilter

      return matchesSearch && matchesStatus && matchesTemplate
    })
  }, [purchases, txSearch, txStatusFilter, txTemplateFilter])

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
          code: newCouponCode.trim().toUpperCase(),
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
    if (purchases.length === 0) return
    let csv = 'Order ID,Customer Name,Email,Template ID,Amount Paid,Coupon,Status,Date\n'
    purchases.forEach(p => {
      csv += `"${p.code || p.inviteId}","${p.userName || 'Unknown'}","${p.userEmail || 'Unknown'}","${p.templateId || 'Not set'}",${p.amountPaid || 0},"${p.couponCode || 'None'}","Paid","${p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}"\n`
    })

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "recent_transactions.csv")
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
            { id: 'transactions', label: 'Transactions', icon: '💸' },
            { id: 'templates', label: 'Templates', icon: '🎨' },
            { id: 'coupons', label: 'Coupons', icon: '🏷️' },
            { id: 'website', label: 'Web Analytics', icon: '🌐' },
            { id: 'users', label: 'Registered Users', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
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
            onChange={(e) => setActiveTab(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-bold outline-none"
          >
            <option value="overview">Dashboard</option>
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
      <main className="flex-1 md:pl-64 pt-14 md:pt-0">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 space-y-8">
          
          {/* Header row */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight capitalize text-slate-900">
                {activeTab === 'overview' ? 'analytics overview' : activeTab}
              </h1>
              <p className="text-xs md:text-sm font-medium text-slate-400">
                InviteQue platform performance summary metrics
              </p>
            </div>
            {activeTab === 'overview' && (
              <div className="flex items-center gap-1 rounded-xl bg-slate-200/50 p-1 self-start">
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

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {[
                  {
                    title: 'Website Visitors',
                    val: summary?.totalVisits || 0,
                    change: '+14.2%',
                    icon: '🌐',
                    color: 'text-blue-500'
                  },
                  {
                    title: 'Registered Users',
                    val: summary?.totalMembers || 0,
                    change: '+8.3%',
                    icon: '👤',
                    color: 'text-purple-500'
                  },
                  {
                    title: 'Total Purchases',
                    val: summary?.totalTransactions || 0,
                    change: '+11.5%',
                    icon: '💸',
                    color: 'text-emerald-500'
                  },
                  {
                    title: 'Total Revenue',
                    val: `₹${(summary?.totalEarnings || 0).toLocaleString()}`,
                    change: '+15.7%',
                    icon: '🏦',
                    color: 'text-amber-500'
                  },
                  {
                    title: 'Avg Order Value (AOV)',
                    val: `₹${(summary?.totalTransactions > 0 ? Math.round(summary.totalEarnings / summary.totalTransactions) : 0).toLocaleString()}`,
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
                        {!card.isAov && <span className="text-xs font-bold text-emerald-500">{card.change}</span>}
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
                    <p className="text-[10px] text-slate-400 mb-4">Earnings distribution share per design</p>
                    
                    <div className="space-y-4">
                      {templateAnalytics.map((t, idx) => {
                        const totalRevenue = templateAnalytics.reduce((sum, item) => sum + item.revenue, 0)
                        const percentage = totalRevenue > 0 ? Math.round((t.revenue / totalRevenue) * 100) : 0
                        return (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-bold text-slate-500">
                              <span className="capitalize">{t.name.replace(/-/g, ' ')}</span>
                              <span>₹{t.revenue.toLocaleString()} ({percentage}%)</span>
                            </div>
                            <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                              <div className="h-full bg-slate-900 rounded-full" style={{ width: `${percentage}%` }} />
                            </div>
                          </div>
                        )
                      })}
                      {templateAnalytics.length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400">No template sales data yet.</div>
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
                      <h3 className="text-sm font-bold text-slate-800">Recent Purchases</h3>
                      <p className="text-[10px] text-slate-400">Latest platform order activities</p>
                    </div>
                    <button onClick={() => setActiveTab('transactions')} className="text-xs font-bold text-slate-500 hover:text-slate-900">
                      View All
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 overflow-hidden">
                    {purchases.slice(0, 4).map((p, idx) => (
                      <div key={idx} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-xs font-bold text-slate-800">{p.userName || 'Customer'}</p>
                          <p className="text-[10px] text-slate-400">{p.code || p.inviteId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-800">₹{(p.amountPaid || 0).toLocaleString()}</p>
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-600">Paid</span>
                        </div>
                      </div>
                    ))}
                    {purchases.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400">No purchases found.</div>
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
                    placeholder="Search Order ID, Customer, Email..."
                    className="w-full max-w-xs rounded-xl border border-slate-200 px-4 py-2.5 text-xs outline-none focus:border-slate-900 transition-colors"
                  />
                  <select
                    value={txTemplateFilter}
                    onChange={(e) => { setTxTemplateFilter(e.target.value); setTxPage(1); }}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none font-bold"
                  >
                    <option value="ALL">All Templates</option>
                    <option value="aura-of-elegance">Aura of Elegance</option>
                    <option value="royal-wedding">Royal Wedding</option>
                    <option value="timeless-grace">Timeless Grace</option>
                  </select>
                </div>
                
                {/* Export button */}
                <button
                  onClick={exportTransactionsCsv}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-800 shadow-sm hover:bg-slate-50 transition"
                >
                  📥 Export CSV
                </button>
              </div>

              {/* Transactions Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-left text-xs text-slate-500">
                  <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <tr>
                      <th className="px-6 py-4">Order ID</th>
                      <th className="px-6 py-4">Customer Name</th>
                      <th className="px-6 py-4">Email</th>
                      <th className="px-6 py-4">Template</th>
                      <th className="px-6 py-4">Amount</th>
                      <th className="px-6 py-4">Coupon</th>
                      <th className="px-6 py-4">Payment Status</th>
                      <th className="px-6 py-4">Payment Method</th>
                      <th className="px-6 py-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedPurchases.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-900 truncate max-w-[120px]">{p.code || p.inviteId}</td>
                        <td className="px-6 py-4 font-semibold text-slate-800">{p.userName || 'Customer'}</td>
                        <td className="px-6 py-4">{p.userEmail || 'N/A'}</td>
                        <td className="px-6 py-4 font-medium text-slate-600 capitalize">{p.templateId ? p.templateId.replace(/-/g, ' ') : 'N/A'}</td>
                        <td className="px-6 py-4 font-bold text-slate-900">₹{(p.amountPaid || 0).toLocaleString()}</td>
                        <td className="px-6 py-4"><span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">{p.couponCode || 'None'}</span></td>
                        <td className="px-6 py-4">
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600">Paid</span>
                        </td>
                        <td className="px-6 py-4 font-semibold">Razorpay</td>
                        <td className="px-6 py-4">{p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}</td>
                      </tr>
                    ))}
                    {filteredPurchases.length === 0 && (
                      <tr>
                        <td colSpan="9" className="py-10 text-center text-xs text-slate-400">No transactions recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedPurchases.map((p, idx) => (
                  <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">Order ID</span>
                        <p className="text-xs font-bold text-slate-900 font-mono truncate">{p.code || p.inviteId}</p>
                      </div>
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-extrabold text-emerald-600">
                        Paid
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Customer</span>
                        <span className="font-bold text-slate-800">{p.userName || 'Customer'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Email</span>
                        <span className="text-slate-600 break-all">{p.userEmail || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Template</span>
                        <span className="font-semibold text-slate-700 capitalize">
                          {p.templateId ? p.templateId.replace(/-/g, ' ') : 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Amount</span>
                        <span className="font-bold text-slate-900">₹{(p.amountPaid || 0).toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Coupon</span>
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[9px] font-mono text-slate-500 font-bold">
                          {p.couponCode || 'None'}
                        </span>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">Date</span>
                        <span className="text-slate-600">
                          {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {filteredPurchases.length === 0 && (
                  <div className="rounded-2xl border border-dashed border-slate-200 py-10 text-center text-xs text-slate-400">
                    No transactions recorded.
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
                          <td className="px-6 py-4 font-semibold text-slate-800">{t.views} views</td>
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
                        <span className="text-xs font-bold text-slate-500">{t.views} views</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
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
                          <span>Conversion Rate</span>
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
    </div>
  )
}
