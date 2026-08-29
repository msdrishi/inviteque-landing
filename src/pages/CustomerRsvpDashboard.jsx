import { useState, useEffect, useMemo, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { API_URL } from '../config.js'

const logo = "/assets/logo/inviteq-logo.png"

export default function CustomerRsvpDashboard() {
  const { templateId, code: paramCode } = useParams()
  const code = (paramCode || '').toUpperCase()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // State
  const [invite, setInvite] = useState(null)
  const [summary, setSummary] = useState(null)
  const [rsvps, setRsvps] = useState([])
  const [guestGroups, setGuestGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all') // 'all' | 'yes' | 'no' | 'maybe'
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [selectedEventId, setSelectedEventId] = useState('all')

  // Modals
  const [selectedRsvp, setSelectedRsvp] = useState(null)
  const [showGroupModal, setShowGroupModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupSlug, setNewGroupSlug] = useState('')
  const [creatingGroup, setCreatingGroup] = useState(false)
  const [copiedLink, setCopiedLink] = useState('')

  // Check user authentication
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { redirect: window.location.pathname } })
    }
  }, [user, navigate])

  // Fetch Dashboard Data
  const fetchDashboardData = useCallback(async () => {
    if (!user || !code) return

    try {
      setLoading(true)
      setError(null)

      const headers = {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      }

      // 1. Fetch Invite Details
      const inviteRes = await fetch(`${API_URL}/api/invites/${code}`, { headers })
      if (inviteRes.status === 401) {
        logout()
        navigate('/login')
        return
      }
      if (inviteRes.status === 403) {
        setError('Unauthorized: You do not have permission to view RSVPs for this wedding.')
        setLoading(false)
        return
      }
      if (!inviteRes.ok) {
        throw new Error('Failed to load wedding details')
      }
      const inviteData = await inviteRes.json()
      setInvite(inviteData)

      // 2. Fetch RSVP Summary
      const summaryRes = await fetch(`${API_URL}/api/weddings/${code}/rsvp-summary`, { headers })
      if (summaryRes.ok) {
        const summaryData = await summaryRes.json()
        setSummary(summaryData)
      }

      // 3. Fetch RSVPs List
      const rsvpRes = await fetch(`${API_URL}/api/weddings/${code}/rsvps?size=200`, { headers })
      if (rsvpRes.ok) {
        const rsvpData = await rsvpRes.json()
        const items = Array.isArray(rsvpData) ? rsvpData : (rsvpData.content || [])
        setRsvps(items)
      }

      // 4. Fetch Guest Groups
      const groupRes = await fetch(`${API_URL}/api/weddings/${code}/guest-groups`, { headers })
      if (groupRes.ok) {
        const groupData = await groupRes.json()
        setGuestGroups(groupData || [])
      }
    } catch (err) {
      console.error('Error fetching RSVP dashboard data:', err)
      setError(err.message || 'We could not load your RSVP responses.')
    } finally {
      setLoading(false)
    }
  }, [code, user, logout, navigate])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  // Filtered RSVPs
  const filteredRsvps = useMemo(() => {
    return rsvps.filter(r => {
      // Status filter
      if (selectedStatus !== 'all' && r.attendanceStatus?.toLowerCase() !== selectedStatus.toLowerCase()) {
        return false
      }
      // Group filter
      if (selectedGroup !== 'all') {
        const rGroup = r.guestGroupSlug || r.guestGroupName || 'general'
        if (rGroup.toLowerCase() !== selectedGroup.toLowerCase()) {
          return false
        }
      }
      // Event filter
      if (selectedEventId !== 'all') {
        const attendedEvent = r.eventResponses?.some(
          er => er.eventId === selectedEventId && er.response?.toLowerCase() === 'yes'
        )
        if (!attendedEvent) return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchName = r.guestName?.toLowerCase().includes(q)
        const matchMsg = r.message?.toLowerCase().includes(q)
        const matchGroup = r.guestGroupName?.toLowerCase().includes(q)
        if (!matchName && !matchMsg && !matchGroup) return false
      }
      return true
    })
  }, [rsvps, selectedStatus, selectedGroup, selectedEventId, searchQuery])

  // Export CSV
  const handleExportCsv = async () => {
    if (!user || !code) return

    try {
      const res = await fetch(`${API_URL}/api/weddings/${code}/rsvps/export`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      })
      if (!res.ok) throw new Error('Export failed')

      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rsvp-${code}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error('Failed to export CSV:', err)
      alert('Failed to export CSV. Please try again.')
    }
  }

  // Create Guest Group
  const handleCreateGroup = async (e) => {
    e.preventDefault()
    if (!newGroupName.trim() || creatingGroup) return

    setCreatingGroup(true)
    try {
      const slug = newGroupSlug.trim() || newGroupName.trim().toLowerCase().replace(/[^a-z0-9]/g, '-')
      const res = await fetch(`${API_URL}/api/weddings/${code}/guest-groups`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGroupName.trim(),
          slug: slug,
        }),
      })

      if (res.ok) {
        setNewGroupName('')
        setNewGroupSlug('')
        setShowGroupModal(false)
        fetchDashboardData()
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.message || 'Failed to create guest group link')
      }
    } catch (err) {
      console.error('Create group error:', err)
    } finally {
      setCreatingGroup(false)
    }
  }

  // Copy Link Helper
  const copyLink = (linkUrl, label) => {
    navigator.clipboard.writeText(linkUrl)
    setCopiedLink(label)
    setTimeout(() => setCopiedLink(''), 2500)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center font-saas">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent mb-4" />
        <p className="text-sm font-semibold text-neutral-600">Loading RSVP Dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center p-6 font-saas text-center">
        <div className="h-16 w-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-2xl mb-4">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-neutral-900 mb-2">Access Denied or Not Found</h2>
        <p className="text-sm text-neutral-600 max-w-md mb-6">{error}</p>
        <button
          onClick={() => navigate('/account')}
          className="px-6 py-3 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
        >
          Return to My Account
        </button>
      </div>
    )
  }

  const groomName = invite?.coupleData?.groomName || 'Groom'
  const brideName = invite?.coupleData?.brideName || 'Bride'
  const coupleTitle = `${groomName} & ${brideName}`
  const activeTemplate = templateId || invite?.templateId || 'twilight-serenade'
  const liveInviteUrl = `${window.location.origin}/templates/${activeTemplate}/${code}`

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-neutral-900 font-saas flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/account" className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors">
              <img src={logo} alt="Inviteque" className="h-8 w-auto" />
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">RSVP Portal</span>
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => copyLink(liveInviteUrl, 'main')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-700 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>{copiedLink === 'main' ? '✓ Copied' : '📋 Copy Live Link'}</span>
            </button>
            <a
              href={liveInviteUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-neutral-900 text-white hover:bg-black transition-all flex items-center gap-1.5 shadow-sm"
            >
              <span>View Invite</span>
              <span>↗</span>
            </a>
          </div>
        </div>
      </header>

      {/* ── Main Dashboard Content ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Header Title Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-800">
                Code: {code}
              </span>
              <span className="text-xs text-neutral-400 font-medium capitalize">
                {activeTemplate.replace(/-/g, ' ')}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 tracking-tight font-serif">
              {coupleTitle}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 mt-0.5">
              Guest attendance responses and event RSVPs
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowGroupModal(true)}
              className="px-4 py-2.5 rounded-xl border border-neutral-300 bg-white text-neutral-700 text-xs font-bold hover:bg-neutral-50 transition-all flex items-center gap-2 shadow-sm"
            >
              <span>👥</span>
              <span>Manage Guest Links</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-all flex items-center gap-2 shadow-sm active:scale-95"
            >
              <span>📥</span>
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* ── KPI Summary Cards ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {/* Total Responses */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Total RSVPs</span>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-900 font-serif">
              {summary?.totalResponses ?? rsvps.length}
            </div>
            <span className="text-[10px] text-neutral-500 font-medium">Submissions recorded</span>
          </div>

          {/* Attending */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">Attending</span>
            <div className="text-2xl sm:text-3xl font-bold text-emerald-700 font-serif">
              {summary?.attending ?? rsvps.filter(r => r.attendanceStatus === 'yes').length}
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Joyfully Accepted</span>
          </div>

          {/* Declined */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Declined</span>
            <div className="text-2xl sm:text-3xl font-bold text-neutral-500 font-serif">
              {summary?.declined ?? rsvps.filter(r => r.attendanceStatus === 'no').length}
            </div>
            <span className="text-[10px] text-neutral-400 font-medium">Regretfully Declined</span>
          </div>

          {/* Maybe */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 block">Maybe</span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-700 font-serif">
              {summary?.maybe ?? rsvps.filter(r => r.attendanceStatus === 'maybe').length}
            </div>
            <span className="text-[10px] text-amber-600 font-medium">Pending Decision</span>
          </div>

          {/* Total Expected Headcount */}
          <div className="col-span-2 sm:col-span-1 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-800 text-white shadow-md space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block">Total Expected Guests</span>
            <div className="text-2xl sm:text-3xl font-bold text-white font-serif">
              {summary?.totalAttendingGuests ?? rsvps.filter(r => r.attendanceStatus === 'yes').reduce((acc, r) => acc + (r.guestCount || 1), 0)}
            </div>
            <span className="text-[10px] text-neutral-300 font-medium">Total headcount attending</span>
          </div>
        </div>

        {/* ── Event Breakdown Section ── */}
        {summary?.eventCounts && summary.eventCounts.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-500">
                Event-Level Attendance
              </h3>
              {selectedEventId !== 'all' && (
                <button
                  onClick={() => setSelectedEventId('all')}
                  className="text-xs font-bold text-emerald-700 hover:underline"
                >
                  Clear Event Filter (Show All Events)
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {summary.eventCounts.map((ev) => (
                <div
                  key={ev.eventId || ev.eventName}
                  onClick={() => setSelectedEventId(selectedEventId === ev.eventId ? 'all' : ev.eventId)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedEventId === ev.eventId
                      ? 'bg-emerald-50/70 border-emerald-600 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900">{ev.eventName}</h4>
                      <p className="text-[11px] text-neutral-500">{[ev.eventDate, ev.eventTime].filter(Boolean).join(' • ') || 'Scheduled Event'}</p>
                    </div>
                    <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800">
                      {ev.attending} attending
                    </span>
                  </div>
                  <div className="mt-3 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span>Declined: {ev.declined}</span>
                    <span>Maybe: {ev.maybe}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Filters and Search Bar ── */}
        <div className="p-4 rounded-2xl bg-white border border-neutral-200/80 shadow-sm space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search guest name, wish, notes..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-xs sm:text-sm bg-neutral-50 border border-neutral-200 focus:bg-white focus:border-neutral-400 outline-none transition-all"
              />
              <span className="absolute left-3 top-2.5 text-neutral-400 text-sm">🔍</span>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-2.5 text-neutral-400 hover:text-black text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Attendance Filter Tabs */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
              {[
                { id: 'all', label: 'All' },
                { id: 'yes', label: 'Attending' },
                { id: 'no', label: 'Declined' },
                { id: 'maybe', label: 'Maybe' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedStatus(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedStatus === tab.id
                      ? 'bg-white text-neutral-900 shadow-sm'
                      : 'text-neutral-500 hover:text-neutral-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Guest Group Dropdown */}
            {guestGroups && guestGroups.length > 0 && (
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-neutral-50 border border-neutral-200 text-neutral-700 outline-none cursor-pointer"
              >
                <option value="all">All Guest Groups</option>
                {guestGroups.map(g => (
                  <option key={g.id || g.slug} value={g.slug}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* ── Responses List / Table ── */}
        <div className="rounded-2xl bg-white border border-neutral-200/80 shadow-sm overflow-hidden">
          {filteredRsvps.length === 0 ? (
            /* Empty State */
            <div className="py-16 text-center space-y-3 px-4">
              <div className="mx-auto h-12 w-12 rounded-full bg-neutral-100 flex items-center justify-center text-xl text-neutral-400">
                ✉️
              </div>
              <h4 className="text-base font-bold text-neutral-900">No RSVPs found</h4>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                {rsvps.length === 0
                  ? 'Responses will appear here when your guests confirm their attendance on your wedding page.'
                  : 'No guest responses match the currently selected filters or search terms.'}
              </p>
              {(selectedStatus !== 'all' || selectedGroup !== 'all' || selectedEventId !== 'all' || searchQuery) && (
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedStatus('all')
                    setSelectedGroup('all')
                    setSelectedEventId('all')
                  }}
                  className="mt-2 text-xs font-bold text-emerald-700 hover:underline"
                >
                  Reset all filters
                </button>
              )}
            </div>
          ) : (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50/70 text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                      <th className="py-3.5 px-6">Guest Name</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Headcount</th>
                      <th className="py-3.5 px-4">Guest Wish / Note</th>
                      <th className="py-3.5 px-4">Events</th>
                      <th className="py-3.5 px-4">Submitted</th>
                      <th className="py-3.5 px-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 text-sm font-medium">
                    {filteredRsvps.map((rsvp) => {
                      const isAttending = rsvp.attendanceStatus?.toLowerCase() === 'yes'
                      const isDeclined = rsvp.attendanceStatus?.toLowerCase() === 'no'
                      const attendedEvents = (rsvp.eventResponses || [])
                        .filter(e => e.response?.toLowerCase() === 'yes')
                        .map(e => e.eventName)

                      return (
                        <tr
                          key={rsvp.id}
                          onClick={() => setSelectedRsvp(rsvp)}
                          className="hover:bg-neutral-50/80 transition-colors cursor-pointer"
                        >
                          <td className="py-4 px-6 font-bold text-neutral-900">
                            <div>{rsvp.guestName}</div>
                            {rsvp.guestGroupName && rsvp.guestGroupName !== 'General' && (
                              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-500 font-semibold mt-1 inline-block">
                                {rsvp.guestGroupName}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                                isAttending
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : isDeclined
                                  ? 'bg-neutral-100 text-neutral-600'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {isAttending ? '✓ Attending' : isDeclined ? 'Declined' : 'Maybe'}
                            </span>
                          </td>

                          <td className="py-4 px-4 font-bold text-neutral-800">
                            {isDeclined ? (
                              <span className="text-neutral-400 font-normal">0</span>
                            ) : (
                              <span className="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-bold text-xs">
                                {rsvp.guestCount || 1} {rsvp.guestCount === 1 ? 'Guest' : 'Guests'}
                              </span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-xs text-neutral-600 max-w-xs truncate">
                            {rsvp.message ? (
                              <span className="italic">"{rsvp.message}"</span>
                            ) : (
                              <span className="text-neutral-300">—</span>
                            )}
                          </td>

                          <td className="py-4 px-4">
                            {isDeclined ? (
                              <span className="text-neutral-400 text-xs">—</span>
                            ) : attendedEvents.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {attendedEvents.map(evName => (
                                  <span key={evName} className="text-[11px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200/60 font-semibold">
                                    {evName}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-neutral-400 text-xs">All Events</span>
                            )}
                          </td>

                          <td className="py-4 px-4 text-xs text-neutral-400">
                            {rsvp.submittedAt
                              ? new Date(rsvp.submittedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : 'Recent'}
                          </td>

                          <td className="py-4 px-6 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedRsvp(rsvp)
                              }}
                              className="text-xs font-bold text-emerald-700 hover:text-emerald-900 transition-colors"
                            >
                              View Details →
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* MOBILE CARDS VIEW */}
              <div className="md:hidden divide-y divide-neutral-100">
                {filteredRsvps.map((rsvp) => {
                  const isAttending = rsvp.attendanceStatus?.toLowerCase() === 'yes'
                  const isDeclined = rsvp.attendanceStatus?.toLowerCase() === 'no'
                  const attendedEvents = (rsvp.eventResponses || [])
                    .filter(e => e.response?.toLowerCase() === 'yes')
                    .map(e => e.eventName)

                  return (
                    <div
                      key={rsvp.id}
                      onClick={() => setSelectedRsvp(rsvp)}
                      className="p-4 space-y-2.5 active:bg-neutral-50 cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-neutral-900">{rsvp.guestName}</h4>
                          <span className="text-xs text-neutral-500 font-semibold">
                            {isDeclined ? '0 Guests' : `${rsvp.guestCount || 1} Total ${rsvp.guestCount === 1 ? 'Guest' : 'Guests'}`}
                          </span>
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                            isAttending
                              ? 'bg-emerald-100 text-emerald-800'
                              : isDeclined
                              ? 'bg-neutral-100 text-neutral-600'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isAttending ? '✓ Attending' : isDeclined ? 'Declined' : 'Maybe'}
                        </span>
                      </div>

                      {attendedEvents.length > 0 && !isDeclined && (
                        <div className="flex flex-wrap gap-1">
                          {attendedEvents.map(evName => (
                            <span key={evName} className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/50">
                              {evName}
                            </span>
                          ))}
                        </div>
                      )}

                      {rsvp.message && (
                        <p className="text-xs text-neutral-700 bg-neutral-50 p-2.5 rounded-xl italic">
                          "{rsvp.message}"
                        </p>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-400">
                        <span>
                          {rsvp.submittedAt ? new Date(rsvp.submittedAt).toLocaleDateString() : 'Recent'}
                        </span>
                        <span className="font-bold text-emerald-700">View Full Details →</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {/* ── Guest Detail Modal / Drawer ── */}
      <AnimatePresence>
        {selectedRsvp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 overflow-hidden max-h-[90vh] overflow-y-auto space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">Guest Response</span>
                  <h3 className="text-xl font-bold text-neutral-900 font-serif">{selectedRsvp.guestName}</h3>
                </div>
                <button
                  onClick={() => setSelectedRsvp(null)}
                  className="h-8 w-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Status Banner */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-50 border border-neutral-200/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Attendance</span>
                  <span className="text-sm font-bold text-neutral-900 capitalize">
                    {selectedRsvp.attendanceStatus === 'yes' ? 'Joyfully Accept (Attending)' : selectedRsvp.attendanceStatus === 'no' ? 'Regretfully Decline' : 'Maybe'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total Guests</span>
                  <span className="text-sm font-bold text-neutral-900">
                    {selectedRsvp.attendanceStatus === 'no' ? 0 : `${selectedRsvp.guestCount || 1} ${selectedRsvp.guestCount === 1 ? 'Guest' : 'Guests'}`}
                  </span>
                </div>
              </div>

              {/* Event Responses */}
              {selectedRsvp.eventResponses && selectedRsvp.eventResponses.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500">Event Selection</h4>
                  <div className="space-y-2">
                    {selectedRsvp.eventResponses.map((er) => (
                      <div
                        key={er.eventId || er.eventName}
                        className="p-3 rounded-xl border border-neutral-100 bg-neutral-50/50 flex items-center justify-between text-xs"
                      >
                        <span className="font-semibold text-neutral-800">{er.eventName}</span>
                        <span
                          className={`font-bold px-2 py-0.5 rounded-full ${
                            er.response?.toLowerCase() === 'yes'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-neutral-200 text-neutral-600'
                          }`}
                        >
                          {er.response?.toLowerCase() === 'yes' ? '✓ Attending' : 'Not Attending'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Guest Group</span>
                  <p className="font-semibold text-neutral-800">{selectedRsvp.guestGroupName || 'General'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Meal Preference</span>
                  <p className="font-semibold text-neutral-800">{selectedRsvp.mealPreference || 'Standard'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Accommodation</span>
                  <p className="font-semibold text-neutral-800">{selectedRsvp.accommodationNeeded ? 'Required' : 'Not required'}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Submitted At</span>
                  <p className="font-semibold text-neutral-800">
                    {selectedRsvp.submittedAt ? new Date(selectedRsvp.submittedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Message / Wish */}
              {selectedRsvp.message && (
                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Guest Message</span>
                  <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs text-neutral-700 leading-relaxed italic">
                    "{selectedRsvp.message}"
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  onClick={() => setSelectedRsvp(null)}
                  className="w-full py-3 rounded-full bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-black transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Guest Group / Multi-Link Modal ── */}
      <AnimatePresence>
        {showGroupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 space-y-6"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Multi-Link Support</span>
                  <h3 className="text-xl font-bold text-neutral-900 font-serif">Guest Group Links</h3>
                </div>
                <button
                  onClick={() => setShowGroupModal(false)}
                  className="h-8 w-8 rounded-full bg-neutral-100 text-neutral-500 hover:bg-neutral-200 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Active Links List */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">Existing Invitation Links</label>
                
                {/* Default Main Link */}
                <div className="p-3 rounded-2xl border border-neutral-200 bg-neutral-50/50 flex items-center justify-between gap-3">
                  <div className="truncate">
                    <span className="text-xs font-bold text-neutral-900 block">Standard Link</span>
                    <span className="text-[11px] text-neutral-400 font-mono truncate block">
                      {liveInviteUrl}
                    </span>
                  </div>
                  <button
                    onClick={() => copyLink(liveInviteUrl, 'standard')}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white border border-neutral-300 hover:bg-neutral-100 transition-all shrink-0"
                  >
                    {copiedLink === 'standard' ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                {/* Custom Group Links */}
                {guestGroups.map((g) => {
                  const groupUrl = `${window.location.origin}/templates/${activeTemplate}/${code}/${g.slug}`
                  return (
                    <div key={g.id || g.slug} className="p-3 rounded-2xl border border-neutral-200 bg-white flex items-center justify-between gap-3 shadow-sm">
                      <div className="truncate">
                        <span className="text-xs font-bold text-emerald-800 block">{g.name}</span>
                        <span className="text-[11px] text-neutral-400 font-mono truncate block">
                          {groupUrl}
                        </span>
                      </div>
                      <button
                        onClick={() => copyLink(groupUrl, g.slug)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-neutral-900 text-white hover:bg-black transition-all shrink-0"
                      >
                        {copiedLink === g.slug ? '✓ Copied' : 'Copy Link'}
                      </button>
                    </div>
                  )
                })}
              </div>

              {/* Form to Create New Group */}
              <form onSubmit={handleCreateGroup} className="space-y-4 pt-4 border-t border-neutral-100">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-500 block">
                  Create New Guest Group Link
                </label>
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Group Name (e.g. Close Family, College Friends)"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-neutral-50 border border-neutral-200 outline-none focus:border-neutral-400"
                  />
                  <input
                    type="text"
                    value={newGroupSlug}
                    onChange={(e) => setNewGroupSlug(e.target.value)}
                    placeholder="Custom URL Slug (optional, e.g. family)"
                    className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm bg-neutral-50 border border-neutral-200 outline-none focus:border-neutral-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creatingGroup || !newGroupName.trim()}
                  className="w-full py-3 rounded-full bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-emerald-800 transition-all flex items-center justify-center gap-2"
                >
                  {creatingGroup ? 'Creating...' : '+ Generate Group Link'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
