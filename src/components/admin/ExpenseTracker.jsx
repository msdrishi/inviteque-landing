import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Storage Keys
const STORAGE_KEYS = {
  EXPENSES: 'iq_admin_expenses_v7',
  SETTLEMENTS: 'iq_admin_settlements_v7',
  CLIENT_ORDERS: 'iq_admin_client_orders_v7',
  LEADS: 'iq_admin_leads_v7',
  TODOS: 'iq_admin_todos_v7'
}

// User's Real Pre-seeded Data
const SEED_EXPENSES = [
  {
    id: 'exp-1',
    title: 'Promotion on Instagram (Meta Ads)',
    category: 'Marketing & Ads',
    amount: 1062,
    frequency: 'One-time',
    paymentMethod: 'Meta Ads UPI',
    date: '2026-08-27',
    notes: 'Instagram ad campaign targeting wedding & engagement couples'
  },
  {
    id: 'exp-2',
    title: 'Domain Charges on Namecheap (Inviteque)',
    category: 'Domain & DNS',
    amount: 700,
    frequency: 'Annual',
    paymentMethod: 'Debit Card',
    date: '2026-05-24',
    notes: 'Annual domain name registration on Namecheap'
  },
  {
    id: 'exp-3',
    title: 'Render Backend Hosting Web Service',
    category: 'Hosting & Server',
    amount: 350,
    frequency: 'Monthly',
    paymentMethod: 'Credit Card',
    date: '2026-08-09',
    notes: 'Monthly Node.js & PostgreSQL backend instance on Render'
  }
]

// Settlements from confirmed advance payments
const SEED_SETTLEMENTS = [
  {
    id: 'set-1',
    clientName: 'Pavitra',
    serviceType: 'Template Customization (2 links / variant)',
    amount: 500,
    paymentMethod: 'UPI - GPay',
    date: '2026-08-24',
    status: 'Settled',
    notes: 'Advance paid on 24 Aug (Total ₹2,500, pending ₹2,000)'
  },
  {
    id: 'set-2',
    clientName: 'Shradha',
    serviceType: 'Template Customization (Splash screen addition)',
    amount: 500,
    paymentMethod: 'UPI - PhonePe',
    date: '2026-08-24',
    status: 'Settled',
    notes: 'Advance paid on 24 Aug (Total ₹2,000, pending ₹1,500)'
  }
]

// Real Active Customized Clients
const SEED_CLIENT_ORDERS = [
  {
    id: 'ord-1',
    clientName: 'Pavitra',
    phone: '+919876543210',
    source: 'Instagram',
    serviceName: 'Customized Wedding Template (2 Links / Custom Variants)',
    totalCharge: 2500,
    advancePaid: 500,
    advanceDate: '2026-08-24',
    clientDeadline: '2026-09-07',
    deliveryDate: '2026-09-07',
    status: 'In Progress',
    deliverableUrl: '/template/midnight-waltz/Pavitra-Sri',
    notes: 'Client wants little modification over the existing template and needs two links.'
  },
  {
    id: 'ord-2',
    clientName: 'Shradha',
    phone: '+919123456789',
    source: 'WhatsApp',
    serviceName: 'Customized Wedding Template + Custom Splash Screen',
    totalCharge: 2000,
    advancePaid: 500,
    advanceDate: '2026-08-24',
    clientDeadline: '2026-09-20',
    deliveryDate: '2026-09-20',
    status: 'In Progress',
    deliverableUrl: '',
    notes: 'Client wants custom splash screen on existing template page.'
  }
]

// Inquiries / Leads
const SEED_LEADS = [
  {
    id: 'lead-1',
    name: 'Kirti',
    phone: '+919988776655',
    source: 'Instagram',
    serviceInterested: 'Custom Luxury Wedding Invitation',
    budgetExpectation: 2500,
    inquiryDate: '2026-08-26',
    status: 'Waiting for Reply',
    notes: 'Asked the plan and waiting for reply. Move to active client once confirmed with timeline & budget.'
  },
  {
    id: 'lead-2',
    name: 'Anoushka',
    phone: '+919876501234',
    source: 'WhatsApp',
    serviceInterested: 'Bespoke Sunflower Fields + Custom Audio',
    budgetExpectation: 3000,
    inquiryDate: '2026-08-27',
    status: 'Waiting for Reply',
    notes: 'Discussed custom animations and music synch. Awaiting package confirmation.'
  },
  {
    id: 'lead-3',
    name: 'Saaransh',
    phone: '+919811223344',
    source: 'Mail',
    serviceInterested: 'House Warming / Wedding Suite',
    budgetExpectation: 2000,
    inquiryDate: '2026-08-28',
    status: 'Waiting for Reply',
    notes: 'Sent portfolio pricing sheet. Waiting for confirmation on final dates.'
  }
]

// Tasks Checklist
const SEED_TODOS = [
  {
    id: 'td-1',
    text: 'Prepare 2 custom links & template modifications for Pavitra (Deadline: Sep 7)',
    priority: 'High',
    tag: 'Client Work',
    dueDate: '2026-09-07',
    completed: false,
    createdAt: '2026-08-28'
  },
  {
    id: 'td-2',
    text: 'Design custom splash screen draft for Shradha (Deadline: Sep 20)',
    priority: 'Medium',
    tag: 'Design',
    dueDate: '2026-09-15',
    completed: false,
    createdAt: '2026-08-28'
  },
  {
    id: 'td-3',
    text: 'Follow up with inquiries: Kirti, Anoushka, and Saaransh on Instagram & WhatsApp',
    priority: 'High',
    tag: 'Leads & Sales',
    dueDate: '2026-08-29',
    completed: false,
    createdAt: '2026-08-28'
  },
  {
    id: 'td-4',
    text: 'Monitor Instagram promotion ad performance (Spent: ₹1,062 on Aug 27)',
    priority: 'Medium',
    tag: 'Marketing',
    dueDate: '2026-08-30',
    completed: true,
    createdAt: '2026-08-27'
  }
]

const EXPENSE_CATEGORIES = [
  'Marketing & Ads',
  'Domain & DNS',
  'Hosting & Server',
  'Cloud Storage',
  'Design & Assets',
  'Software & Tools',
  'Miscellaneous'
]

const CATEGORY_COLORS = {
  'Marketing & Ads': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Domain & DNS': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Hosting & Server': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Cloud Storage': { bg: 'bg-sky-50', text: 'text-sky-700', border: 'border-sky-200' },
  'Design & Assets': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Software & Tools': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Miscellaneous': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' }
}

const SOURCE_ICONS = {
  'Instagram': { icon: '📸', label: 'Instagram', bg: 'bg-pink-50 text-pink-700 border-pink-200' },
  'WhatsApp': { icon: '💬', label: 'WhatsApp', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  'Mail': { icon: '✉️', label: 'Email / Web', bg: 'bg-blue-50 text-blue-700 border-blue-200' }
}

export default function ExpenseTracker({ dbPurchases = [] }) {
  // Global Period Selector
  const [selectedMonth, setSelectedMonth] = useState('ALL')

  // Clickable Subtab for Logs (Inquiries, Expenses, Settlements)
  const [activeLogTab, setActiveLogTab] = useState('leads')

  // Monthly P&L Selected Month (Defaults to current month '2026-08')
  const [pnlSelectedMonth, setPnlSelectedMonth] = useState('2026-08')
  const [showAllTransactionsModal, setShowAllTransactionsModal] = useState(false)

  // Persistent States
  const [expenses, setExpenses] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPENSES)
      return saved ? JSON.parse(saved) : SEED_EXPENSES
    } catch {
      return SEED_EXPENSES
    }
  })

  const [settlements, setSettlements] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTLEMENTS)
      return saved ? JSON.parse(saved) : SEED_SETTLEMENTS
    } catch {
      return SEED_SETTLEMENTS
    }
  })

  const [clientOrders, setClientOrders] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLIENT_ORDERS)
      return saved ? JSON.parse(saved) : SEED_CLIENT_ORDERS
    } catch {
      return SEED_CLIENT_ORDERS
    }
  })

  const [leads, setLeads] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADS)
      return saved ? JSON.parse(saved) : SEED_LEADS
    } catch {
      return SEED_LEADS
    }
  })

  const [todos, setTodos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TODOS)
      return saved ? JSON.parse(saved) : SEED_TODOS
    } catch {
      return SEED_TODOS
    }
  })

  // Sync to LocalStorage
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses)) } catch (e) {}
  }, [expenses])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.SETTLEMENTS, JSON.stringify(settlements)) } catch (e) {}
  }, [settlements])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.CLIENT_ORDERS, JSON.stringify(clientOrders)) } catch (e) {}
  }, [clientOrders])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.LEADS, JSON.stringify(leads)) } catch (e) {}
  }, [leads])

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEYS.TODOS, JSON.stringify(todos)) } catch (e) {}
  }, [todos])

  // Modals & Form States
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [editingExpense, setEditingExpense] = useState(null)
  const [expenseForm, setExpenseForm] = useState({
    title: '',
    category: 'Marketing & Ads',
    amount: '',
    frequency: 'One-time',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })

  const [showSettlementModal, setShowSettlementModal] = useState(false)
  const [editingSettlement, setEditingSettlement] = useState(null)
  const [settlementForm, setSettlementForm] = useState({
    clientName: '',
    serviceType: '',
    amount: '',
    paymentMethod: 'UPI - GPay',
    date: new Date().toISOString().split('T')[0],
    status: 'Settled',
    notes: ''
  })

  const [showClientModal, setShowClientModal] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [clientForm, setClientForm] = useState({
    clientName: '',
    phone: '',
    source: 'Instagram',
    serviceName: '',
    totalCharge: '',
    advancePaid: '',
    advanceDate: new Date().toISOString().split('T')[0],
    clientDeadline: '',
    deliveryDate: new Date().toISOString().split('T')[0],
    status: 'In Progress',
    deliverableUrl: '',
    notes: ''
  })

  // Selected Client for Deep-Dive Details Popup
  const [selectedClientDetail, setSelectedClientDetail] = useState(null)

  // Lead Modal & Form
  const [showLeadModal, setShowLeadModal] = useState(false)
  const [editingLead, setEditingLead] = useState(null)
  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    source: 'Instagram',
    serviceInterested: '',
    budgetExpectation: '',
    inquiryDate: new Date().toISOString().split('T')[0],
    status: 'Waiting for Reply',
    notes: ''
  })

  // Task Form State
  const [newTodoText, setNewTodoText] = useState('')
  const [newTodoPriority, setNewTodoPriority] = useState('High')
  const [newTodoTag, setNewTodoTag] = useState('Client Work')
  const [newTodoDueDate, setNewTodoDueDate] = useState(new Date().toISOString().split('T')[0])
  const [todoFilter, setTodoFilter] = useState('all')

  // Calendar State
  const [calCurrentDate, setCalCurrentDate] = useState(new Date(2026, 7, 1))
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('2026-09-07')

  // Search States
  const [clientSearch, setClientSearch] = useState('')
  const [expenseSearch, setExpenseSearch] = useState('')

  // Available Months for Selector
  const availableMonths = useMemo(() => {
    const monthsSet = new Set()
    expenses.forEach(e => { if (e.date) monthsSet.add(e.date.slice(0, 7)) })
    settlements.forEach(s => { if (s.date) monthsSet.add(s.date.slice(0, 7)) })
    dbPurchases.forEach(p => { if (p.paidAt) monthsSet.add(p.paidAt.slice(0, 7)) })
    clientOrders.forEach(c => { if (c.deliveryDate) monthsSet.add(c.deliveryDate.slice(0, 7)) })
    monthsSet.add('2026-08')
    monthsSet.add('2026-05')
    return Array.from(monthsSet).sort().reverse()
  }, [expenses, settlements, dbPurchases, clientOrders])

  // Filtered Financial Data for Core KPIs
  const filteredDbPurchases = useMemo(() => {
    if (selectedMonth === 'ALL') return dbPurchases
    return dbPurchases.filter(p => p.paidAt && p.paidAt.startsWith(selectedMonth))
  }, [dbPurchases, selectedMonth])

  const filteredSettlements = useMemo(() => {
    return settlements.filter(s => {
      const matchMonth = selectedMonth === 'ALL' || (s.date && s.date.startsWith(selectedMonth))
      return matchMonth
    })
  }, [settlements, selectedMonth])

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchMonth = selectedMonth === 'ALL' || (e.date && e.date.startsWith(selectedMonth))
      const matchSearch = !expenseSearch ||
        e.title?.toLowerCase().includes(expenseSearch.toLowerCase()) ||
        e.category?.toLowerCase().includes(expenseSearch.toLowerCase())
      return matchMonth && matchSearch
    })
  }, [expenses, selectedMonth, expenseSearch])

  // Financial Aggregates
  const stats = useMemo(() => {
    const dbRevenue = filteredDbPurchases.reduce((sum, p) => sum + (p.amountPaid || 0), 0)
    const customRevenue = filteredSettlements.reduce((sum, s) => sum + (Number(s.amount) || 0), 0)
    const grossRevenue = dbRevenue + customRevenue

    const totalExpense = filteredExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0)
    const netProfit = grossRevenue - totalExpense
    const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : 0

    const totalReceivables = clientOrders.reduce((sum, o) => {
      const total = Number(o.totalCharge) || 0
      const advance = Number(o.advancePaid) || 0
      return sum + Math.max(0, total - advance)
    }, 0)

    const categoryMap = {}
    EXPENSE_CATEGORIES.forEach(cat => { categoryMap[cat] = 0 })
    filteredExpenses.forEach(e => {
      const cat = e.category || 'Miscellaneous'
      categoryMap[cat] = (categoryMap[cat] || 0) + (Number(e.amount) || 0)
    })

    return {
      dbRevenue,
      dbOrdersCount: filteredDbPurchases.length,
      customRevenue,
      customSettlementsCount: filteredSettlements.length,
      grossRevenue,
      totalExpense,
      netProfit,
      profitMargin,
      totalReceivables,
      categoryBreakdown: categoryMap
    }
  }, [filteredDbPurchases, filteredSettlements, filteredExpenses, clientOrders])

  // Monthly P&L Ledger Builder
  const monthlyPnlData = useMemo(() => {
    const monthsMap = {}

    const ensureMonth = (mKey) => {
      if (!mKey || mKey.length < 7) return
      if (!monthsMap[mKey]) {
        const d = new Date(`${mKey}-01`)
        monthsMap[mKey] = {
          monthKey: mKey,
          monthLabel: d.toLocaleString('default', { month: 'long', year: 'numeric' }),
          directPurchases: [],
          directPurchasesTotal: 0,
          customSettlements: [],
          customSettlementsTotal: 0,
          expenses: [],
          expensesTotal: 0,
          grossRevenue: 0,
          netProfit: 0,
          profitMargin: 0
        }
      }
    }

    // Direct Purchases
    dbPurchases.forEach(p => {
      if (!p.paidAt) return
      const mKey = p.paidAt.slice(0, 7)
      ensureMonth(mKey)
      if (monthsMap[mKey]) {
        monthsMap[mKey].directPurchases.push(p)
        monthsMap[mKey].directPurchasesTotal += (p.amountPaid || 0)
      }
    })

    // Custom Settlements
    settlements.forEach(s => {
      if (!s.date) return
      const mKey = s.date.slice(0, 7)
      ensureMonth(mKey)
      if (monthsMap[mKey]) {
        monthsMap[mKey].customSettlements.push(s)
        monthsMap[mKey].customSettlementsTotal += (Number(s.amount) || 0)
      }
    })

    // Expenses
    expenses.forEach(e => {
      if (!e.date) return
      const mKey = e.date.slice(0, 7)
      ensureMonth(mKey)
      if (monthsMap[mKey]) {
        monthsMap[mKey].expenses.push(e)
        monthsMap[mKey].expensesTotal += (Number(e.amount) || 0)
      }
    })

    ensureMonth('2026-08')
    ensureMonth('2026-05')

    const result = Object.values(monthsMap).map(m => {
      const grossRevenue = m.directPurchasesTotal + m.customSettlementsTotal
      const netProfit = grossRevenue - m.expensesTotal
      const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : 0
      return {
        ...m,
        grossRevenue,
        netProfit,
        profitMargin
      }
    })

    return result.sort((a, b) => b.monthKey.localeCompare(a.monthKey))
  }, [dbPurchases, settlements, expenses])

  // Calendar Helpers
  const calendarData = useMemo(() => {
    const year = calCurrentDate.getFullYear()
    const month = calCurrentDate.getMonth()

    const firstDayIndex = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const monthName = calCurrentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

    const deliveriesByDate = {}
    const activeSpansByDate = {}

    clientOrders.forEach(order => {
      if (!order.deliveryDate) return

      const deliveryKey = order.deliveryDate
      if (!deliveriesByDate[deliveryKey]) deliveriesByDate[deliveryKey] = []
      deliveriesByDate[deliveryKey].push(order)

      const startDate = order.advanceDate || (order.advancePaid ? '2026-08-24' : order.deliveryDate)
      const startMs = new Date(startDate).getTime()
      const endMs = new Date(order.deliveryDate).getTime()

      if (!isNaN(startMs) && !isNaN(endMs)) {
        for (let t = startMs; t <= endMs; t += 24 * 60 * 60 * 1000) {
          const dayKey = new Date(t).toISOString().split('T')[0]
          if (!activeSpansByDate[dayKey]) activeSpansByDate[dayKey] = []
          activeSpansByDate[dayKey].push({
            orderId: order.id,
            clientName: order.clientName,
            isStart: dayKey === startDate,
            isEnd: dayKey === order.deliveryDate
          })
        }
      }
    })

    const days = []
    for (let i = 0; i < firstDayIndex; i++) {
      days.push({ blank: true, key: `blank-${i}` })
    }

    const todayStr = '2026-08-28'

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const ordersOnThisDay = deliveriesByDate[dateStr] || []
      const activeSpans = activeSpansByDate[dateStr] || []

      days.push({
        blank: false,
        day: d,
        dateStr,
        isToday: dateStr === todayStr,
        isSelected: dateStr === selectedCalendarDate,
        orders: ordersOnThisDay,
        count: ordersOnThisDay.length,
        activeSpans,
        hasTimeline: activeSpans.length > 0,
        key: dateStr
      })
    }

    return { monthName, days, deliveriesByDate }
  }, [calCurrentDate, clientOrders, selectedCalendarDate])

  const selectedDateOrders = useMemo(() => {
    return clientOrders.filter(o => o.deliveryDate === selectedCalendarDate)
  }, [clientOrders, selectedCalendarDate])

  // Handlers for Expenses
  const handleOpenExpenseModal = (expense = null) => {
    if (expense) {
      setEditingExpense(expense)
      setExpenseForm({ ...expense })
    } else {
      setEditingExpense(null)
      setExpenseForm({
        title: '',
        category: 'Marketing & Ads',
        amount: '',
        frequency: 'One-time',
        paymentMethod: 'Meta Ads UPI',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
    }
    setShowExpenseModal(true)
  }

  const handleSaveExpense = (e) => {
    e.preventDefault()
    if (!expenseForm.title.trim() || !expenseForm.amount) {
      alert('Please enter title and amount.')
      return
    }

    const payload = {
      ...expenseForm,
      amount: Number(expenseForm.amount),
      id: editingExpense ? editingExpense.id : `exp-${Date.now()}`
    }

    if (editingExpense) {
      setExpenses(prev => prev.map(item => item.id === editingExpense.id ? payload : item))
    } else {
      setExpenses(prev => [payload, ...prev])
    }
    setShowExpenseModal(false)
  }

  const handleDeleteExpense = (id) => {
    if (window.confirm('Delete this expense?')) {
      setExpenses(prev => prev.filter(e => e.id !== id))
    }
  }

  // Handlers for Settlements
  const handleOpenSettlementModal = (settlement = null) => {
    if (settlement) {
      setEditingSettlement(settlement)
      setSettlementForm({ ...settlement })
    } else {
      setEditingSettlement(null)
      setSettlementForm({
        clientName: '',
        serviceType: '',
        amount: '',
        paymentMethod: 'UPI - GPay',
        date: new Date().toISOString().split('T')[0],
        status: 'Settled',
        notes: ''
      })
    }
    setShowSettlementModal(true)
  }

  const handleSaveSettlement = (e) => {
    e.preventDefault()
    if (!settlementForm.clientName.trim() || !settlementForm.amount) {
      alert('Please fill out client name and amount.')
      return
    }

    const payload = {
      ...settlementForm,
      amount: Number(settlementForm.amount),
      id: editingSettlement ? editingSettlement.id : `set-${Date.now()}`
    }

    if (editingSettlement) {
      setSettlements(prev => prev.map(item => item.id === editingSettlement.id ? payload : item))
    } else {
      setSettlements(prev => [payload, ...prev])
    }
    setShowSettlementModal(false)
  }

  const handleDeleteSettlement = (id) => {
    if (window.confirm('Delete this settlement record?')) {
      setSettlements(prev => prev.filter(s => s.id !== id))
    }
  }

  // Handlers for Client Orders
  const handleOpenClientModal = (client = null, defaultDeliveryDate = '') => {
    if (client) {
      setEditingClient(client)
      setClientForm({ ...client })
    } else {
      setEditingClient(null)
      setClientForm({
        clientName: '',
        phone: '',
        source: 'Instagram',
        serviceName: '',
        totalCharge: '',
        advancePaid: '',
        advanceDate: new Date().toISOString().split('T')[0],
        clientDeadline: defaultDeliveryDate || '2026-09-10',
        deliveryDate: defaultDeliveryDate || '2026-09-10',
        status: 'In Progress',
        deliverableUrl: '',
        notes: ''
      })
    }
    setShowClientModal(true)
  }

  const handleSaveClientOrder = (e) => {
    e.preventDefault()
    if (!clientForm.clientName.trim() || !clientForm.totalCharge) {
      alert('Please enter client name and total charge.')
      return
    }

    const payload = {
      ...clientForm,
      totalCharge: Number(clientForm.totalCharge) || 0,
      advancePaid: Number(clientForm.advancePaid) || 0,
      id: editingClient ? editingClient.id : `ord-${Date.now()}`
    }

    if (editingClient) {
      setClientOrders(prev => prev.map(item => item.id === editingClient.id ? payload : item))
    } else {
      setClientOrders(prev => [payload, ...prev])

      if (payload.advancePaid > 0) {
        const newSet = {
          id: `set-${Date.now()}`,
          clientName: payload.clientName,
          serviceType: `${payload.serviceName} (Advance)`,
          amount: payload.advancePaid,
          paymentMethod: 'UPI',
          date: payload.advanceDate || new Date().toISOString().split('T')[0],
          status: 'Settled',
          notes: `Advance for ${payload.clientName}`
        }
        setSettlements(s => [newSet, ...s])
      }
    }
    setShowClientModal(false)
  }

  const handleDeleteClientOrder = (id) => {
    if (window.confirm('Delete this client project?')) {
      setClientOrders(prev => prev.filter(o => o.id !== id))
    }
  }

  // Convert Lead / Inquiry to Active Client
  const handleConvertLeadToClient = (lead) => {
    setClientForm({
      clientName: lead.name,
      phone: lead.phone || '',
      source: lead.source || 'Instagram',
      serviceName: lead.serviceInterested || 'Customized Wedding Template',
      totalCharge: lead.budgetExpectation || 2500,
      advancePaid: 500,
      advanceDate: new Date().toISOString().split('T')[0],
      clientDeadline: '2026-09-15',
      deliveryDate: '2026-09-15',
      status: 'In Progress',
      deliverableUrl: '',
      notes: lead.notes || ''
    })
    setEditingClient(null)
    setShowClientModal(true)
  }

  const handleSaveLead = (e) => {
    e.preventDefault()
    if (!leadForm.name.trim()) return

    const payload = {
      ...leadForm,
      budgetExpectation: Number(leadForm.budgetExpectation) || 0,
      id: editingLead ? editingLead.id : `lead-${Date.now()}`
    }

    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === editingLead.id ? payload : l))
    } else {
      setLeads(prev => [payload, ...prev])
    }
    setShowLeadModal(false)
  }

  const handleDeleteLead = (id) => {
    if (window.confirm('Remove this lead inquiry?')) {
      setLeads(prev => prev.filter(l => l.id !== id))
    }
  }

  // Handlers for Tasks
  const handleAddTodo = (e) => {
    e?.preventDefault()
    if (!newTodoText.trim()) return

    const newTodo = {
      id: `td-${Date.now()}`,
      text: newTodoText.trim(),
      priority: newTodoPriority,
      tag: newTodoTag,
      dueDate: newTodoDueDate,
      completed: false,
      createdAt: new Date().toISOString().split('T')[0]
    }

    setTodos(prev => [newTodo, ...prev])
    setNewTodoText('')
  }

  const handleToggleTodo = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))
  }

  const handleDeleteTodo = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }

  const filteredTodos = useMemo(() => {
    if (todoFilter === 'active') return todos.filter(t => !t.completed)
    if (todoFilter === 'completed') return todos.filter(t => t.completed)
    return todos
  }, [todos, todoFilter])

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-10 font-saas w-full max-w-full min-w-0 overflow-x-hidden">
      {/* 1. TOP ACTION & PERIOD CONTROL (Responsive, Non-overflowing) */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-xs min-w-0">
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 sm:gap-3 min-w-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold">
            <span className="text-slate-400 font-medium">Period:</span>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer text-xs sm:text-sm"
            >
              <option value="ALL">All Time</option>
              {availableMonths.map(m => (
                <option key={m} value={m}>
                  {new Date(`${m}-01`).toLocaleString('default', { month: 'short', year: 'numeric' })}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{clientOrders.length} Active</span>
            <span>•</span>
            <span>{leads.length} Inquiries</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 pt-1 sm:pt-0">
          <button
            onClick={() => handleOpenClientModal()}
            className="flex items-center justify-center gap-1 rounded-xl bg-slate-900 px-2.5 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold text-white shadow-xs hover:bg-slate-800 transition truncate"
          >
            <span>+</span> Client
          </button>

          <button
            onClick={() => handleOpenExpenseModal()}
            className="flex items-center justify-center gap-1 rounded-xl bg-rose-600 px-2.5 py-2 sm:px-4 sm:py-2.5 text-[11px] sm:text-xs font-bold text-white shadow-xs hover:bg-rose-700 transition truncate"
          >
            <span>+</span> Expense
          </button>

          <button
            onClick={() => handleOpenSettlementModal()}
            className="flex items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-2.5 py-2 sm:px-3.5 sm:py-2.5 text-[11px] sm:text-xs font-bold text-slate-700 hover:bg-slate-50 transition truncate"
          >
            <span>+</span> Settle
          </button>
        </div>
      </div>

      {/* 2. CORE FINANCIAL KPI CARDS (Uniform height & single-line footers) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-saas min-w-0">
        {/* Gross Revenue */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px] sm:h-[135px] min-w-0">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Total Inflow</span>
            <span className="text-base sm:text-lg">💰</span>
          </div>
          <div className="mt-2 sm:mt-0">
            <div className="font-saas font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-none truncate">
              ₹{stats.grossRevenue.toLocaleString('en-IN')}
            </div>
            <div className="h-5 flex items-center text-[10px] sm:text-[11px] font-medium text-slate-500 mt-2 truncate">
              Custom: <b className="text-slate-800 font-bold ml-1">₹{stats.customRevenue.toLocaleString('en-IN')}</b> • Web: <b className="text-slate-800 font-bold ml-1">₹{stats.dbRevenue.toLocaleString('en-IN')}</b>
            </div>
          </div>
        </div>

        {/* Total Expenses / Spent */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px] sm:h-[135px] min-w-0">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Total Spent</span>
            <span className="text-base sm:text-lg">📉</span>
          </div>
          <div className="mt-2 sm:mt-0">
            <div className="font-saas font-extrabold text-2xl sm:text-3xl text-rose-600 tracking-tight leading-none truncate">
              ₹{stats.totalExpense.toLocaleString('en-IN')}
            </div>
            <div className="h-5 flex items-center text-[10px] sm:text-[11px] font-medium text-slate-500 mt-2 truncate">
              <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] mr-1.5">
                {filteredExpenses.length} Logs
              </span>
              <span>Hosting & Meta Ads active</span>
            </div>
          </div>
        </div>

        {/* Net Operating Profit */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px] sm:h-[135px] min-w-0">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Net Profit</span>
            <span className={`text-base sm:text-lg ${stats.netProfit >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stats.netProfit >= 0 ? '📈' : '⚠️'}
            </span>
          </div>
          <div className="mt-2 sm:mt-0">
            <div className={`font-saas font-extrabold text-2xl sm:text-3xl tracking-tight leading-none truncate ${stats.netProfit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              ₹{stats.netProfit.toLocaleString('en-IN')}
            </div>
            <div className="h-5 flex items-center text-[10px] sm:text-[11px] font-medium text-slate-500 mt-2 truncate">
              Margin: <span className="font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] ml-1">{stats.profitMargin}%</span>
            </div>
          </div>
        </div>

        {/* Pending Receivables */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200 shadow-xs flex flex-col justify-between min-h-[120px] sm:h-[135px] min-w-0">
          <div className="flex justify-between items-start">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 truncate">Receivables</span>
            <span className="text-base sm:text-lg">⏳</span>
          </div>
          <div className="mt-2 sm:mt-0">
            <div className="font-saas font-extrabold text-2xl sm:text-3xl text-amber-600 tracking-tight leading-none truncate">
              ₹{stats.totalReceivables.toLocaleString('en-IN')}
            </div>
            <div className="h-5 flex items-center text-[10px] sm:text-[11px] font-medium text-slate-500 mt-2 truncate">
              <span className="font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded text-[9px] sm:text-[10px] mr-1.5">
                {clientOrders.length} Orders
              </span>
              <span>Expected on delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. SECTION: ACTIVE CUSTOMIZED CLIENTS & PIPELINE */}
      <section className="rounded-2xl bg-white p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4 sm:space-y-5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
              Customized Template Clients
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-saas">
              Active clients with custom requests. Click any row/card to view timeline & scope.
            </p>
          </div>
          <button
            onClick={() => handleOpenClientModal()}
            className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition self-start sm:self-auto font-saas"
          >
            + Add Client Project
          </button>
        </div>

        {/* Search */}
        <div className="relative font-saas">
          <input
            type="text"
            value={clientSearch}
            onChange={(e) => setClientSearch(e.target.value)}
            placeholder="Search by client name (e.g. Pavitra, Shradha)..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs outline-none focus:border-slate-900 transition font-saas"
          />
        </div>

        {/* MOBILE CARDS VIEW (Clean, No Horizontal Scroll on Phones) */}
        <div className="block sm:hidden space-y-3 font-saas">
          {clientOrders
            .filter(c => !clientSearch || c.clientName?.toLowerCase().includes(clientSearch.toLowerCase()) || c.notes?.toLowerCase().includes(clientSearch.toLowerCase()))
            .map(client => {
              const total = Number(client.totalCharge) || 0
              const adv = Number(client.advancePaid) || 0
              const bal = Math.max(0, total - adv)
              const src = SOURCE_ICONS[client.source] || { icon: '💬', label: client.source || 'Direct' }

              return (
                <div
                  key={client.id}
                  onClick={() => setSelectedClientDetail(client)}
                  className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5 space-y-3 cursor-pointer hover:bg-slate-100/70 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{client.clientName}</span>
                      <span className="text-[10px] text-slate-400">{client.phone || 'No phone'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-md bg-white border border-slate-200 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                        {src.icon} {src.label}
                      </span>
                      <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 text-[9px] font-bold">
                        {client.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-700 font-medium line-clamp-2">{client.serviceName}</p>

                  <div className="grid grid-cols-3 gap-2 text-center bg-white p-2 rounded-lg border border-slate-200/60 text-[10px]">
                    <div>
                      <span className="text-slate-400 block">Total</span>
                      <span className="font-bold text-slate-900">₹{total}</span>
                    </div>
                    <div>
                      <span className="text-emerald-600 block">Advance</span>
                      <span className="font-bold text-emerald-600">₹{adv}</span>
                    </div>
                    <div>
                      <span className="text-amber-600 block">Pending</span>
                      <span className="font-bold text-amber-600">₹{bal}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-slate-200/50">
                    <span className="text-slate-500">Target: <b className="text-slate-800">{client.deliveryDate}</b></span>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedClientDetail(client)}
                        className="rounded-md bg-slate-200 px-2 py-1 font-bold text-slate-700 text-[10px]"
                      >
                        Timeline 🔍
                      </button>
                      <button
                        onClick={() => handleOpenClientModal(client)}
                        className="text-slate-500 font-bold p-1"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteClientOrder(client.id)}
                        className="text-rose-500 font-bold p-1"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        {/* DESKTOP / TABLET TABLE VIEW */}
        <div className="hidden sm:block overflow-x-auto font-saas">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3 px-3">Client & Source</th>
                <th className="py-3 px-3">Customization Scope</th>
                <th className="py-3 px-3">Advance Paid</th>
                <th className="py-3 px-3">Pending Balance</th>
                <th className="py-3 px-3">Total Fee</th>
                <th className="py-3 px-3">Delivery Deadline</th>
                <th className="py-3 px-3 text-center whitespace-nowrap min-w-[120px]">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {clientOrders
                .filter(c => !clientSearch || c.clientName?.toLowerCase().includes(clientSearch.toLowerCase()) || c.notes?.toLowerCase().includes(clientSearch.toLowerCase()))
                .map(client => {
                  const total = Number(client.totalCharge) || 0
                  const adv = Number(client.advancePaid) || 0
                  const bal = Math.max(0, total - adv)
                  const src = SOURCE_ICONS[client.source] || { icon: '💬', label: client.source || 'Direct' }

                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientDetail(client)}
                      className="hover:bg-slate-50/80 transition cursor-pointer group"
                    >
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition">
                            {client.clientName}
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold text-slate-600">
                            {src.icon} {src.label}
                          </span>
                        </div>
                        {client.phone && <p className="text-[10px] text-slate-400 mt-0.5">{client.phone}</p>}
                      </td>
                      <td className="py-3.5 px-3 max-w-[280px]">
                        <p className="text-slate-800 font-semibold truncate">{client.serviceName}</p>
                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{client.notes}</p>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-emerald-600">
                        ₹{adv.toLocaleString('en-IN')}
                        {client.advanceDate && <span className="block text-[9px] text-slate-400 font-normal">Paid {client.advanceDate}</span>}
                      </td>
                      <td className="py-3.5 px-3 font-bold text-amber-600">
                        ₹{bal.toLocaleString('en-IN')}
                        <span className="block text-[9px] text-slate-400 font-normal">Due on delivery</span>
                      </td>
                      <td className="py-3.5 px-3 font-bold text-slate-900">
                        ₹{total.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold text-slate-800 block">{client.deliveryDate}</span>
                        <span className="text-[9px] text-slate-400">Target: {client.clientDeadline || client.deliveryDate}</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-block whitespace-nowrap rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-3 py-1 text-[11px] font-bold">
                          {client.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedClientDetail(client)}
                            className="rounded-lg bg-slate-100 hover:bg-slate-200 px-2.5 py-1 text-[11px] font-bold text-slate-700 transition"
                          >
                            Timeline 🔍
                          </button>
                          <button
                            onClick={() => handleOpenClientModal(client)}
                            className="text-slate-400 hover:text-slate-800 font-bold p-1"
                            title="Edit Client"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteClientOrder(client.id)}
                            className="text-rose-400 hover:text-rose-700 font-bold p-1"
                            title="Delete Client"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. SECTION: DELIVERY CALENDAR & TIMELINE HIGHLIGHT (Responsive Mobile Grid) */}
      <section className="rounded-2xl bg-white p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4 sm:space-y-6 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
              Delivery Schedule & Timelines
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-saas">
              Horizontal highlight bars represent active client durations; badges mark delivery deadlines.
            </p>
          </div>
          <div className="flex items-center gap-2 font-saas self-start sm:self-auto">
            <button
              onClick={() => {
                const prev = new Date(calCurrentDate)
                prev.setMonth(prev.getMonth() - 1)
                setCalCurrentDate(prev)
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center transition"
            >
              ←
            </button>
            <span className="text-xs font-bold text-slate-800 min-w-[110px] sm:min-w-[120px] text-center">
              {calendarData.monthName}
            </span>
            <button
              onClick={() => {
                const next = new Date(calCurrentDate)
                next.setMonth(next.getMonth() + 1)
                setCalCurrentDate(next)
              }}
              className="h-7 w-7 sm:h-8 sm:w-8 rounded-lg border border-slate-200 hover:bg-slate-50 font-bold text-xs text-slate-700 flex items-center justify-center transition"
            >
              →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 font-saas min-w-0">
          {/* Calendar Month Grid */}
          <div className="lg:col-span-2 space-y-2 sm:space-y-3 min-w-0">
            <div className="grid grid-cols-7 gap-1 text-center text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            <div className="grid grid-cols-7 gap-1 sm:gap-1.5 pt-1">
              {calendarData.days.map((item) => {
                if (item.blank) {
                  return <div key={item.key} className="min-h-[46px] sm:min-h-[75px] rounded-lg sm:rounded-xl bg-slate-50/40" />
                }

                const hasDeliveries = item.count > 0
                const hasSpans = item.activeSpans && item.activeSpans.length > 0

                return (
                  <div
                    key={item.key}
                    onClick={() => setSelectedCalendarDate(item.dateStr)}
                    className={`min-h-[46px] sm:min-h-[75px] rounded-lg sm:rounded-xl p-1 sm:p-1.5 border transition cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                      item.isSelected
                        ? 'border-slate-900 bg-slate-900 text-white shadow-xs'
                        : item.isToday
                        ? 'border-amber-400 bg-amber-50/40 text-slate-900'
                        : hasDeliveries
                        ? 'border-indigo-300 bg-indigo-50/60 text-slate-900'
                        : hasSpans
                        ? 'border-purple-200 bg-purple-50/30 text-slate-900'
                        : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-center z-10">
                      <span className={`text-[10px] sm:text-xs font-bold ${item.isSelected ? 'text-white' : item.isToday ? 'text-amber-700' : 'text-slate-700'}`}>
                        {item.day}
                      </span>
                      {item.isToday && !item.isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      )}
                    </div>

                    {/* Timeline Span Bar */}
                    {hasSpans && (
                      <div className="space-y-0.5 my-auto z-10">
                        {item.activeSpans.slice(0, 2).map((sp, sidx) => (
                          <div
                            key={sidx}
                            className={`h-1 sm:h-1.5 w-full rounded-full transition-all ${
                              item.isSelected ? 'bg-indigo-300' : 'bg-indigo-500/80'
                            }`}
                            title={`Active timeline for ${sp.clientName}`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Final Delivery Badge */}
                    {hasDeliveries && (
                      <div className="z-10 mt-auto">
                        <span className={`block truncate text-center text-[8px] sm:text-[9px] font-bold px-0.5 sm:px-1 py-0.2 sm:py-0.5 rounded ${
                          item.isSelected ? 'bg-white text-slate-900' : 'bg-indigo-600 text-white shadow-xs'
                        }`}>
                          📦 {item.orders[0]?.clientName || `${item.count}`}
                        </span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Focused Date Panel */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 sm:p-5 space-y-3 sm:space-y-4 flex flex-col justify-between font-saas min-w-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-2.5">
                <div>
                  <h3 className="font-heading text-sm sm:text-base font-bold text-slate-900">
                    Focus: {selectedCalendarDate}
                  </h3>
                  <span className="text-[9px] sm:text-[10px] text-slate-500 font-medium">Selected Delivery Date</span>
                </div>
                <button
                  onClick={() => handleOpenClientModal(null, selectedCalendarDate)}
                  className="rounded-lg bg-slate-900 hover:bg-slate-800 text-white px-2.5 py-1 text-[10px] sm:text-[11px] font-bold shadow-xs transition"
                >
                  + Add Delivery
                </button>
              </div>

              {selectedDateOrders.length === 0 ? (
                <div className="py-6 sm:py-8 text-center border border-dashed border-slate-200 rounded-xl bg-white/60 space-y-1">
                  <span className="text-lg sm:text-xl">📅</span>
                  <p className="text-[11px] sm:text-xs font-bold text-slate-700">No deliveries on {selectedCalendarDate}</p>
                  <button
                    onClick={() => handleOpenClientModal(null, selectedCalendarDate)}
                    className="text-[11px] sm:text-xs font-bold text-indigo-600 hover:underline block mx-auto pt-1"
                  >
                    + Schedule delivery for a new client on this date
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[260px] overflow-y-auto">
                  {selectedDateOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedClientDetail(order)}
                      className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 hover:border-slate-300 transition cursor-pointer shadow-xs"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-xs text-slate-900">{order.clientName}</p>
                          <p className="text-[10px] text-slate-500">{order.serviceName}</p>
                        </div>
                        <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] font-bold px-2 py-0.5">
                          {order.status}
                        </span>
                      </div>

                      <div className="flex justify-between text-[10px] sm:text-[11px] border-t border-slate-100 pt-2 font-medium">
                        <span>Total: <b>₹{order.totalCharge}</b></span>
                        <span>Pending: <b className="text-amber-600">₹{Math.max(0, order.totalCharge - order.advancePaid)}</b></span>
                      </div>

                      {order.phone && (
                        <a
                          href={`https://wa.me/${order.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(order.clientName)},%20your%20wedding%20invitation%20is%20scheduled%20for%20delivery!`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="block text-center rounded-lg bg-emerald-600 text-white py-1 text-[10px] font-bold hover:bg-emerald-700 transition"
                        >
                          💬 WhatsApp Dispatch Update
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="text-[9px] sm:text-[10px] text-slate-400 border-t border-slate-200/60 pt-2 font-medium">
              💡 Tip: Tap any date to inspect or add deliveries directly.
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION: CLICKABLE OPERATIONS LOGS (Responsive Switcher) */}
      <section className="rounded-2xl bg-white p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4 sm:space-y-5 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
              Operations & Inflow/Outflow Logs
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-saas">
              Switch between prospect inquiries, operational expenses, and custom settlements.
            </p>
          </div>

          {/* Clickable Subtab Switcher */}
          <div className="grid grid-cols-3 sm:flex rounded-xl bg-slate-100 p-1 text-[10px] sm:text-xs font-bold font-saas gap-0.5">
            <button
              onClick={() => setActiveLogTab('leads')}
              className={`flex items-center justify-center gap-1 rounded-lg px-2 sm:px-3.5 py-1.5 transition text-center truncate ${
                activeLogTab === 'leads' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>💬 Leads</span>
              <span className="rounded-full bg-slate-200 px-1 text-[9px]">{leads.length}</span>
            </button>
            <button
              onClick={() => setActiveLogTab('expenses')}
              className={`flex items-center justify-center gap-1 rounded-lg px-2 sm:px-3.5 py-1.5 transition text-center truncate ${
                activeLogTab === 'expenses' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>💸 Expenses</span>
              <span className="rounded-full bg-slate-200 px-1 text-[9px]">{filteredExpenses.length}</span>
            </button>
            <button
              onClick={() => setActiveLogTab('settlements')}
              className={`flex items-center justify-center gap-1 rounded-lg px-2 sm:px-3.5 py-1.5 transition text-center truncate ${
                activeLogTab === 'settlements' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>💰 Settled</span>
              <span className="rounded-full bg-slate-200 px-1 text-[9px]">{filteredSettlements.length}</span>
            </button>
          </div>
        </div>

        {/* LOG TAB 1: INQUIRIES & LEADS */}
        {activeLogTab === 'leads' && (
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Prospects investigating from Instagram, WhatsApp & Mail</span>
              <button
                onClick={() => {
                  setEditingLead(null)
                  setLeadForm({
                    name: '',
                    phone: '',
                    source: 'Instagram',
                    serviceInterested: '',
                    budgetExpectation: '',
                    inquiryDate: new Date().toISOString().split('T')[0],
                    status: 'Waiting for Reply',
                    notes: ''
                  })
                  setShowLeadModal(true)
                }}
                className="rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white hover:bg-slate-800 transition font-saas"
              >
                + Add Inquiry
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 font-saas">
              {leads.map(lead => {
                const src = SOURCE_ICONS[lead.source] || { icon: '💬', label: lead.source || 'Direct' }

                return (
                  <div key={lead.id} className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 sm:p-4 space-y-3 hover:bg-slate-50 transition flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">{lead.name}</h4>
                          <span className="text-[10px] text-slate-400">{lead.phone || 'No phone'}</span>
                        </div>
                        <span className="rounded-md bg-pink-50 text-pink-700 border border-pink-200 px-2 py-0.5 text-[9px] font-bold">
                          {src.icon} {src.label}
                        </span>
                      </div>

                      <div className="text-xs text-slate-700 space-y-1">
                        <p className="font-semibold">{lead.serviceInterested || 'Wedding Customization'}</p>
                        <p className="text-[11px] text-slate-500">{lead.notes}</p>
                      </div>

                      <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-slate-200/60">
                        <span className="text-slate-400">Budget:</span>
                        <span className="text-slate-900">₹{(lead.budgetExpectation || 2500).toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <button
                        onClick={() => handleConvertLeadToClient(lead)}
                        className="flex-1 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-xs font-bold shadow-xs transition"
                      >
                        Convert to Client 🚀
                      </button>
                      <button
                        onClick={() => handleDeleteLead(lead.id)}
                        className="rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-600 px-2.5 py-2 text-xs font-bold text-slate-400 transition"
                        title="Remove Lead"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* LOG TAB 2: EXPENSES LOG */}
        {activeLogTab === 'expenses' && (
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Logged operational expenses and infrastructure costs</span>
              <button
                onClick={() => handleOpenExpenseModal()}
                className="rounded-xl bg-rose-600 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white hover:bg-rose-700 transition font-saas"
              >
                + Record Expense
              </button>
            </div>

            {/* Mobile View for Expenses */}
            <div className="block sm:hidden space-y-2.5 font-saas">
              {filteredExpenses.map(item => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex justify-between items-center">
                  <div className="space-y-1 min-w-0 flex-1 pr-2">
                    <p className="font-bold text-xs text-slate-900 truncate">{item.title}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>{item.category}</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-extrabold text-xs text-rose-600">₹{Number(item.amount).toLocaleString('en-IN')}</span>
                    <button onClick={() => handleDeleteExpense(item.id)} className="text-slate-300 hover:text-rose-600 font-bold p-1 text-xs">🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View for Expenses */}
            <div className="hidden sm:block overflow-x-auto font-saas">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">Expense Title</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Amount Spent</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredExpenses.map(item => {
                    const colors = CATEGORY_COLORS[item.category] || { bg: 'bg-slate-50', text: 'text-slate-700' }
                    return (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-3 font-semibold text-slate-900">
                          {item.title}
                          {item.notes && <p className="text-[10px] text-slate-400 mt-0.5">{item.notes}</p>}
                        </td>
                        <td className="py-3 px-3">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${colors.bg} ${colors.text}`}>
                            {item.category}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-600">{item.paymentMethod}</td>
                        <td className="py-3 px-3 text-slate-500">{item.date}</td>
                        <td className="py-3 px-3 text-right font-bold text-rose-600 text-sm">
                          ₹{Number(item.amount).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => handleOpenExpenseModal(item)} className="text-slate-400 hover:text-slate-800 font-bold">✏️</button>
                            <button onClick={() => handleDeleteExpense(item.id)} className="text-rose-400 hover:text-rose-700 font-bold">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* LOG TAB 3: CUSTOM SETTLEMENTS */}
        {activeLogTab === 'settlements' && (
          <div className="space-y-3 sm:space-y-4 min-w-0">
            <div className="flex justify-between items-center">
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Offline payments received from client advance & customized templates</span>
              <button
                onClick={() => handleOpenSettlementModal()}
                className="rounded-xl bg-slate-900 px-3 py-1.5 text-[11px] sm:text-xs font-bold text-white hover:bg-slate-800 transition font-saas"
              >
                + Add Settlement
              </button>
            </div>

            {/* Mobile View for Settlements */}
            <div className="block sm:hidden space-y-2.5 font-saas">
              {filteredSettlements.map(item => (
                <div key={item.id} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 flex justify-between items-center">
                  <div className="space-y-1 min-w-0 flex-1 pr-2">
                    <p className="font-bold text-xs text-slate-900 truncate">{item.clientName}</p>
                    <p className="text-[10px] text-slate-500 truncate">{item.serviceType} • {item.date}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-extrabold text-xs text-emerald-600">+₹{Number(item.amount).toLocaleString('en-IN')}</span>
                    <button onClick={() => handleDeleteSettlement(item.id)} className="text-slate-300 hover:text-rose-600 font-bold p-1 text-xs">🗑️</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View for Settlements */}
            <div className="hidden sm:block overflow-x-auto font-saas">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-3 px-3">Client</th>
                    <th className="py-3 px-3">Scope / Order Detail</th>
                    <th className="py-3 px-3">Payment Method</th>
                    <th className="py-3 px-3">Date</th>
                    <th className="py-3 px-3 text-right">Settled Amount</th>
                    <th className="py-3 px-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredSettlements.map(item => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-3 font-bold text-slate-900">{item.clientName}</td>
                      <td className="py-3 px-3 text-slate-700">
                        {item.serviceType}
                        {item.notes && <p className="text-[10px] text-slate-400 mt-0.5">{item.notes}</p>}
                      </td>
                      <td className="py-3 px-3 text-slate-600">{item.paymentMethod}</td>
                      <td className="py-3 px-3 text-slate-500">{item.date}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-600 text-sm">
                        +₹{Number(item.amount).toLocaleString('en-IN')}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={() => handleOpenSettlementModal(item)} className="text-slate-400 hover:text-slate-800 font-bold">✏️</button>
                          <button onClick={() => handleDeleteSettlement(item.id)} className="text-rose-400 hover:text-rose-700 font-bold">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* 6. SECTION: TASK & DELIVERABLE CHECKLIST */}
      <section className="rounded-2xl bg-white p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4 sm:space-y-5 font-saas min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
              Task & Deliverable Checklist
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-saas">
              Keep track of template modifications, client deliveries, and follow-ups.
            </p>
          </div>
          <div className="flex rounded-xl bg-slate-100 p-1 text-[11px] sm:text-xs font-bold font-saas self-start sm:self-auto">
            {['all', 'active', 'completed'].map(f => (
              <button
                key={f}
                onClick={() => setTodoFilter(f)}
                className={`rounded-lg px-2.5 sm:px-3 py-1 capitalize transition ${
                  todoFilter === f ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Task Adder */}
        <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row flex-wrap gap-2 p-2.5 sm:p-3 bg-slate-50 rounded-2xl border border-slate-200 font-saas min-w-0">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new deliverable or follow-up task..."
            className="w-full sm:flex-1 sm:min-w-[180px] rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs outline-none focus:border-slate-900 transition font-saas"
          />
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={newTodoPriority}
              onChange={(e) => setNewTodoPriority(e.target.value)}
              className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[11px] sm:text-xs font-semibold outline-none cursor-pointer font-saas"
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
            <input
              type="date"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              className="flex-1 sm:flex-none rounded-xl border border-slate-200 bg-white px-2.5 py-2 text-[11px] sm:text-xs font-semibold outline-none font-saas"
            />
            <button
              type="submit"
              className="rounded-xl bg-slate-900 px-3.5 py-2 text-[11px] sm:text-xs font-bold text-white hover:bg-slate-800 transition font-saas flex-shrink-0"
            >
              + Add
            </button>
          </div>
        </form>

        {/* Tasks List */}
        <div className="space-y-2 font-saas min-w-0">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center justify-between gap-2.5 sm:gap-3 rounded-xl border p-2.5 sm:p-3 transition min-w-0 ${
                todo.completed ? 'bg-slate-50/70 border-slate-200' : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => handleToggleTodo(todo.id)}
                  className={`h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0 rounded-md border flex items-center justify-center transition ${
                    todo.completed ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-300 bg-white hover:border-slate-900'
                  }`}
                >
                  {todo.completed && <span className="text-[10px] sm:text-xs font-bold">✓</span>}
                </button>
                <span className={`text-[11px] sm:text-xs font-medium break-words ${todo.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                  {todo.text}
                </span>
              </div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                <span className="text-[9px] sm:text-[10px] text-slate-400 hidden sm:inline">{todo.dueDate}</span>
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="text-slate-300 hover:text-rose-600 text-xs font-bold p-1"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. SECTION: MONTHLY PROFIT & LOSS STATEMENT (P&L) */}
      <section className="rounded-2xl bg-white p-4 sm:p-6 border border-slate-200 shadow-xs space-y-4 sm:space-y-6 font-saas min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
          <div>
            <h2 className="font-heading text-lg sm:text-2xl font-bold text-slate-900">
              Monthly Profit & Loss Statement (P&L)
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 font-saas">
              Detailed month-by-month profit ledger including direct online website purchases, custom settlements, and operational expenses.
            </p>
          </div>
          <div className="flex items-center gap-2 font-saas self-start sm:self-auto">
            <span className="text-xs font-semibold text-slate-400">View Month:</span>
            <select
              value={pnlSelectedMonth}
              onChange={(e) => setPnlSelectedMonth(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-800 outline-none cursor-pointer"
            >
              {monthlyPnlData.map(m => (
                <option key={m.monthKey} value={m.monthKey}>{m.monthLabel}</option>
              ))}
              <option value="ALL">All Months (Cumulative)</option>
            </select>
          </div>
        </div>

        {/* CASE A: ALL MONTHS CUMULATIVE SUMMARY */}
        {pnlSelectedMonth === 'ALL' ? (
          <div className="space-y-4 min-w-0">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 sm:p-5 space-y-4 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="font-heading text-base sm:text-lg font-bold text-slate-900">
                    Cumulative Multi-Month Operating Summary
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500">
                    Aggregated revenue, operational expenses, and net profit across all recorded operating months.
                  </p>
                </div>
                <button
                  onClick={() => setShowAllTransactionsModal(true)}
                  className="rounded-xl bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-slate-800 transition self-start sm:self-auto shadow-xs"
                >
                  View Full Transaction Ledger 🔍
                </button>
              </div>

              {/* Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs bg-white rounded-xl border border-slate-200">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50">
                      <th className="py-2.5 px-3 sm:px-4">Month</th>
                      <th className="py-2.5 px-3 sm:px-4">Gross Inflow</th>
                      <th className="py-2.5 px-3 sm:px-4">Expenses Spent</th>
                      <th className="py-2.5 px-3 sm:px-4 text-right">Net Profit</th>
                      <th className="py-2.5 px-3 sm:px-4 text-center">Margin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {monthlyPnlData.map(m => (
                      <tr key={m.monthKey} className="hover:bg-slate-50/80 transition">
                        <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">{m.monthLabel}</td>
                        <td className="py-2.5 px-3 sm:px-4 font-bold text-slate-900">+₹{m.grossRevenue.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 sm:px-4 font-bold text-rose-600">-₹{m.expensesTotal.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 sm:px-4 text-right font-extrabold text-emerald-600">₹{m.netProfit.toLocaleString('en-IN')}</td>
                        <td className="py-2.5 px-3 sm:px-4 text-center">
                          <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold">
                            {m.profitMargin}%
                          </span>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-900 text-white font-bold border-t-2 border-slate-900">
                      <td className="py-3 px-3 sm:px-4 font-extrabold">ALL TIME TOTAL</td>
                      <td className="py-3 px-3 sm:px-4 text-emerald-300 font-extrabold">+₹{stats.grossRevenue.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 sm:px-4 text-rose-300 font-extrabold">-₹{stats.totalExpense.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 sm:px-4 text-right text-emerald-300 font-black text-sm">₹{stats.netProfit.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3 sm:px-4 text-center text-emerald-300 font-bold">{stats.profitMargin}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* CASE B: SELECTED SPECIFIC MONTH (Default Current Month) */
          <div className="space-y-5 font-saas min-w-0">
            {monthlyPnlData
              .filter(m => m.monthKey === pnlSelectedMonth)
              .map(m => (
                <div key={m.monthKey} className="rounded-2xl border border-slate-200 bg-slate-50/40 p-3.5 sm:p-5 space-y-4 sm:space-y-5 min-w-0">
                  {/* Month Summary Banner */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200 shadow-xs min-w-0">
                    <div>
                      <h3 className="font-heading text-base sm:text-xl font-bold text-slate-900">
                        {m.monthLabel} Operating Statement
                      </h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                        Web Orders: <b className="text-slate-800 font-bold">{m.directPurchases.length}</b> • Custom Clients: <b className="text-slate-800 font-bold">{m.customSettlements.length}</b> • Expenses: <b className="text-slate-800 font-bold">{m.expenses.length}</b>
                      </p>
                    </div>

                    <div className="grid grid-cols-3 sm:flex items-center gap-2 sm:gap-4 text-xs pt-1 sm:pt-0">
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Gross</span>
                        <span className="font-bold text-slate-900 text-xs sm:text-sm">₹{m.grossRevenue.toLocaleString('en-IN')}</span>
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Spent</span>
                        <span className="font-bold text-rose-600 text-xs sm:text-sm">₹{m.expensesTotal.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="border-l border-slate-200 pl-2 sm:pl-4">
                        <span className="text-[9px] uppercase font-bold text-emerald-700 block">Profit</span>
                        <span className="font-extrabold text-emerald-700 text-xs sm:text-base">₹{m.netProfit.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>

                  {/* Detailed Tables for this Month */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 text-xs font-saas min-w-0">
                    {/* Inflow Details */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 space-y-3 shadow-xs min-w-0">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          📈 Inflows ({m.monthLabel})
                        </h4>
                        <span className="font-bold text-emerald-600">
                          +₹{m.grossRevenue.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Direct Purchases (Razorpay / DB)
                        </span>
                        {m.directPurchases.length === 0 ? (
                          <p className="text-slate-400 italic text-[11px] py-1">No direct website transactions recorded for this month.</p>
                        ) : (
                          <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                            {m.directPurchases.map((p, pidx) => (
                              <div key={p.code || p.inviteId || pidx} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 text-[11px] gap-2 min-w-0">
                                <div className="truncate min-w-0">
                                  <span className="font-bold text-slate-800 block truncate">{p.userName || p.code || 'Direct Customer'}</span>
                                  <span className="text-[10px] text-slate-400 block truncate">{p.templateId ? p.templateId.replace(/-/g, ' ') : 'Wedding Template'} • {p.paidAt ? p.paidAt.split('T')[0] : ''}</span>
                                </div>
                                <span className="font-bold text-emerald-600 flex-shrink-0">+₹{(p.amountPaid || 0).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          Custom Template Settlements
                        </span>
                        {m.customSettlements.length === 0 ? (
                          <p className="text-slate-400 italic text-[11px] py-1">No custom client settlements in this month.</p>
                        ) : (
                          <div className="space-y-1.5">
                            {m.customSettlements.map(s => (
                              <div key={s.id} className="flex justify-between items-center p-2 rounded-lg bg-emerald-50/50 text-[11px] gap-2 min-w-0">
                                <div className="truncate min-w-0">
                                  <span className="font-bold text-slate-800 block truncate">{s.clientName}</span>
                                  <span className="text-[10px] text-slate-500 block truncate">{s.serviceType} • {s.date}</span>
                                </div>
                                <span className="font-bold text-emerald-700 flex-shrink-0">+₹{Number(s.amount).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Outflow Details */}
                    <div className="rounded-xl border border-slate-200 bg-white p-3.5 sm:p-4 space-y-3 shadow-xs min-w-0">
                      <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                          📉 Operational Expenses ({m.monthLabel})
                        </h4>
                        <span className="font-bold text-rose-600">
                          -₹{m.expensesTotal.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {m.expenses.length === 0 ? (
                          <p className="text-slate-400 italic text-[11px] py-4 text-center">No expenses recorded for this month.</p>
                        ) : (
                          <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                            {m.expenses.map(e => (
                              <div key={e.id} className="flex justify-between items-center p-2.5 rounded-lg bg-rose-50/40 text-[11px] border border-rose-100/60 gap-2 min-w-0">
                                <div className="truncate min-w-0">
                                  <span className="font-bold text-slate-900 block truncate">{e.title}</span>
                                  <span className="text-[10px] text-slate-500 truncate block">{e.category} • {e.paymentMethod} • {e.date}</span>
                                </div>
                                <span className="font-bold text-rose-600 flex-shrink-0">-₹{Number(e.amount).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </section>

      {/* FULL TRANSACTIONS MODAL */}
      {showAllTransactionsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-slate-200 max-h-[85vh] overflow-y-auto font-saas text-xs">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">Full All-Time Transaction Ledger</h3>
                <p className="text-slate-400 text-[10px] sm:text-[11px]">All direct customer purchases, custom settlements & operating expenses</p>
              </div>
              <button
                onClick={() => setShowAllTransactionsModal(false)}
                className="rounded-full h-7 w-7 sm:h-8 sm:w-8 hover:bg-slate-100 text-slate-400 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {monthlyPnlData.map(m => (
                <div key={m.monthKey} className="rounded-xl border border-slate-200 p-3.5 space-y-3 bg-slate-50/50">
                  <div className="flex justify-between items-center border-b border-slate-200/60 pb-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900">{m.monthLabel}</span>
                    <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700">Net: ₹{m.netProfit.toLocaleString('en-IN')} ({m.profitMargin}%)</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Inflows (+₹{m.grossRevenue.toLocaleString()})</span>
                      <div className="space-y-1 max-h-[140px] overflow-y-auto">
                        {m.directPurchases.map((p, idx) => (
                          <div key={idx} className="flex justify-between text-[11px] p-1 rounded bg-slate-50">
                            <span className="truncate">{p.userName || p.code || 'Direct Customer'}</span>
                            <span className="font-bold text-emerald-600 flex-shrink-0">+₹{p.amountPaid}</span>
                          </div>
                        ))}
                        {m.customSettlements.map(s => (
                          <div key={s.id} className="flex justify-between text-[11px] p-1 rounded bg-emerald-50/50">
                            <span className="truncate">{s.clientName}</span>
                            <span className="font-bold text-emerald-700 flex-shrink-0">+₹{s.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1.5">Outflows (-₹{m.expensesTotal.toLocaleString()})</span>
                      <div className="space-y-1 max-h-[140px] overflow-y-auto">
                        {m.expenses.map(e => (
                          <div key={e.id} className="flex justify-between text-[11px] p-1 rounded bg-rose-50/50">
                            <span className="truncate">{e.title}</span>
                            <span className="font-bold text-rose-600 flex-shrink-0">-₹{e.amount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CLIENT DEEP-DIVE MODAL WITH VISUAL TIMELINE */}
      {selectedClientDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl space-y-4 sm:space-y-5 border border-slate-200 max-h-[90vh] overflow-y-auto font-saas min-w-0">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3 sm:pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-slate-900">{selectedClientDetail.clientName}</h3>
                  <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-[9px] sm:text-[10px] font-bold px-2.5 py-0.5">
                    {selectedClientDetail.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">{selectedClientDetail.serviceName}</p>
              </div>
              <button
                onClick={() => setSelectedClientDetail(null)}
                className="rounded-full h-7 w-7 sm:h-8 sm:w-8 hover:bg-slate-100 text-slate-400 font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3 border border-slate-100">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-slate-400 block">Total</span>
                <span className="text-sm sm:text-base font-bold text-slate-900">₹{selectedClientDetail.totalCharge}</span>
              </div>
              <div className="rounded-xl bg-emerald-50/60 p-2.5 sm:p-3 border border-emerald-100">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-emerald-700 block">Advance</span>
                <span className="text-sm sm:text-base font-bold text-emerald-700">₹{selectedClientDetail.advancePaid}</span>
              </div>
              <div className="rounded-xl bg-amber-50/60 p-2.5 sm:p-3 border border-amber-100">
                <span className="text-[9px] sm:text-[10px] font-bold uppercase text-amber-700 block">Balance</span>
                <span className="text-sm sm:text-base font-bold text-amber-700">
                  ₹{Math.max(0, selectedClientDetail.totalCharge - selectedClientDetail.advancePaid)}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-3.5 sm:p-4 space-y-2.5 sm:space-y-3">
              <div className="flex justify-between items-center text-[11px] sm:text-xs font-bold text-slate-800">
                <span>Timeline Window</span>
                <span className="text-indigo-700">
                  {selectedClientDetail.advanceDate || '2026-08-24'} ➔ {selectedClientDetail.deliveryDate}
                </span>
              </div>

              <div className="space-y-1">
                <div className="h-2.5 sm:h-3 w-full bg-slate-200 rounded-full overflow-hidden flex">
                  <div className="bg-indigo-600 h-full rounded-full w-[45%]" />
                </div>
                <div className="flex justify-between text-[9px] sm:text-[10px] text-slate-500 font-medium">
                  <span>Start: {selectedClientDetail.advanceDate || '24 Aug 2026'}</span>
                  <span>Delivery: {selectedClientDetail.deliveryDate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px]">Client Scope & Notes</span>
              <div className="rounded-xl bg-slate-50 p-3 sm:p-3.5 border border-slate-200 text-slate-700 leading-relaxed font-medium text-[11px] sm:text-xs">
                {selectedClientDetail.notes || 'No extra notes provided.'}
              </div>
            </div>

            {selectedClientDetail.phone && (
              <a
                href={`https://wa.me/${selectedClientDetail.phone.replace(/\D/g, '')}?text=Hi%20${encodeURIComponent(selectedClientDetail.clientName)},%20this%20is%20Inviteque%20regarding%20your%20wedding%20template%20timeline.`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-center rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 sm:py-3 text-xs font-bold shadow-xs transition"
              >
                💬 Open WhatsApp Chat with {selectedClientDetail.clientName}
              </a>
            )}

            <div className="flex gap-2 sm:gap-3 pt-1">
              <button
                onClick={() => {
                  handleOpenClientModal(selectedClientDetail)
                  setSelectedClientDetail(null)
                }}
                className="flex-1 rounded-xl bg-slate-900 text-white py-2.5 text-xs font-bold hover:bg-slate-800 transition"
              >
                ✏️ Edit Client Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODALS: ADD / EDIT CLIENT ORDER, EXPENSE, SETTLEMENT, LEAD */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 border border-slate-200 max-h-[90vh] overflow-y-auto text-xs font-saas">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">
                {editingClient ? 'Edit Client Order' : 'Record Client Order'}
              </h3>
              <button onClick={() => setShowClientModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveClientOrder} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={clientForm.clientName}
                    onChange={(e) => setClientForm({ ...clientForm, clientName: e.target.value })}
                    placeholder="e.g. Pavitra / Shradha"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-slate-900 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    value={clientForm.phone}
                    onChange={(e) => setClientForm({ ...clientForm, phone: e.target.value })}
                    placeholder="+919876543210"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Communication Source</label>
                  <select
                    value={clientForm.source}
                    onChange={(e) => setClientForm({ ...clientForm, source: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none font-semibold"
                  >
                    <option value="Instagram">📸 Instagram DM</option>
                    <option value="WhatsApp">💬 WhatsApp</option>
                    <option value="Mail">✉️ Email / Website</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Status</label>
                  <select
                    value={clientForm.status}
                    onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none font-semibold"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="In Review">In Review</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Customization Scope *</label>
                <input
                  type="text"
                  required
                  value={clientForm.serviceName}
                  onChange={(e) => setClientForm({ ...clientForm, serviceName: e.target.value })}
                  placeholder="e.g. 2 Links / Splash Screen / Custom Audio"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-slate-900 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Total Fee (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={clientForm.totalCharge}
                    onChange={(e) => setClientForm({ ...clientForm, totalCharge: e.target.value })}
                    placeholder="e.g. 2500"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-slate-900 font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Advance Paid (₹)</label>
                  <input
                    type="number"
                    min={0}
                    value={clientForm.advancePaid}
                    onChange={(e) => setClientForm({ ...clientForm, advancePaid: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-slate-900 font-bold text-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Advance Date</label>
                  <input
                    type="date"
                    value={clientForm.advanceDate}
                    onChange={(e) => setClientForm({ ...clientForm, advanceDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Delivery Deadline *</label>
                  <input
                    type="date"
                    required
                    value={clientForm.deliveryDate}
                    onChange={(e) => setClientForm({ ...clientForm, deliveryDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Comments & Details</label>
                <textarea
                  rows={2}
                  value={clientForm.notes}
                  onChange={(e) => setClientForm({ ...clientForm, notes: e.target.value })}
                  placeholder="Notes about modifications, variants, etc..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-slate-900 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowClientModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 font-bold text-white shadow hover:bg-slate-800"
                >
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT EXPENSE */}
      {showExpenseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 border border-slate-200 text-xs font-saas">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">Record Business Expense</h3>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Title *</label>
                <input
                  type="text"
                  required
                  value={expenseForm.title}
                  onChange={(e) => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  placeholder="e.g. Promotion on Instagram, Render backend"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none focus:border-slate-900 font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none font-semibold"
                  >
                    {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    placeholder="e.g. 1062"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none font-bold text-rose-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Payment Method</label>
                  <input
                    type="text"
                    value={expenseForm.paymentMethod}
                    onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                    placeholder="UPI / Card / Meta"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 font-bold text-white shadow hover:bg-slate-800"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT SETTLEMENT */}
      {showSettlementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 border border-slate-200 text-xs font-saas">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">Record Settlement</h3>
              <button onClick={() => setShowSettlementModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveSettlement} className="space-y-3">
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Client Name *</label>
                <input
                  type="text"
                  required
                  value={settlementForm.clientName}
                  onChange={(e) => setSettlementForm({ ...settlementForm, clientName: e.target.value })}
                  placeholder="e.g. Pavitra"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Scope / Detail *</label>
                <input
                  type="text"
                  required
                  value={settlementForm.serviceType}
                  onChange={(e) => setSettlementForm({ ...settlementForm, serviceType: e.target.value })}
                  placeholder="e.g. Advance paid for 2 links"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={settlementForm.amount}
                    onChange={(e) => setSettlementForm({ ...settlementForm, amount: e.target.value })}
                    placeholder="e.g. 500"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none font-bold text-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Payment Date</label>
                  <input
                    type="date"
                    value={settlementForm.date}
                    onChange={(e) => setSettlementForm({ ...settlementForm, date: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowSettlementModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 font-bold text-white shadow hover:bg-slate-800"
                >
                  Save Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD / EDIT LEAD */}
      {showLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-3 sm:p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-4 sm:p-6 shadow-2xl space-y-3.5 sm:space-y-4 border border-slate-200 text-xs font-saas">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-heading text-lg sm:text-xl font-bold text-slate-900">Add Prospective Inquiry</h3>
              <button onClick={() => setShowLeadModal(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSaveLead} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Prospect Name *</label>
                  <input
                    type="text"
                    required
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    placeholder="e.g. Kirti"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Source</label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none font-semibold"
                  >
                    <option value="Instagram">📸 Instagram DM</option>
                    <option value="WhatsApp">💬 WhatsApp</option>
                    <option value="Mail">✉️ Email / Web</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Interested Service / Template</label>
                <input
                  type="text"
                  value={leadForm.serviceInterested}
                  onChange={(e) => setLeadForm({ ...leadForm, serviceInterested: e.target.value })}
                  placeholder="e.g. Midnight Waltz / Royal Palace suite"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Discussion Notes</label>
                <textarea
                  rows={2}
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  placeholder="e.g. Asked the plan and waiting for reply..."
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2 outline-none resize-none"
                />
              </div>

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowLeadModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-2.5 font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-slate-900 py-2.5 font-bold text-white shadow hover:bg-slate-800"
                >
                  Save Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
