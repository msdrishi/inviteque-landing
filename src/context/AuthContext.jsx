import { createContext, useContext, useState, useEffect } from 'react'
import { API_URL } from '../config'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem('inviteque_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const loginWithData = (userData) => {
    const userWithToken = {
      ...userData,
      purchasedInvitations: [],
    }
    setUser(userWithToken)
    localStorage.setItem('inviteque_user', JSON.stringify(userWithToken))
  }

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Login failed')
      }

      const data = await response.json()
      const userWithToken = {
        ...data,
        purchasedInvitations: [], // You can fetch this later from DB
      }
      setUser(userWithToken)
      localStorage.setItem('inviteque_user', JSON.stringify(userWithToken))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const signup = async (name, email, password, phoneNumber) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phoneNumber }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Signup failed')
      }

      const data = await response.json()
      setUser(data)
      localStorage.setItem('inviteque_user', JSON.stringify(data))
      return { success: true }
    } catch (error) {
      return { success: false, message: error.message }
    }
  }

  const addPurchasedInvitation = (invitationData) => {
    if (!user) return

    const newInvitation = {
      id: Date.now().toString(),
      ...invitationData,
      purchaseDate: new Date().toISOString(),
    }

    const updatedUser = {
      ...user,
      purchasedInvitations: [...(user.purchasedInvitations || []), newInvitation],
    }

    setUser(updatedUser)
    localStorage.setItem('inviteque_user', JSON.stringify(updatedUser))
  }

  const updatePurchasedInvitation = (invitationId, updates) => {
    if (!user) return

    const updatedInvitations = user.purchasedInvitations.map((inv) =>
      inv.id === invitationId ? { ...inv, ...updates } : inv
    )

    const updatedUser = {
      ...user,
      purchasedInvitations: updatedInvitations,
    }

    setUser(updatedUser)
    localStorage.setItem('inviteque_user', JSON.stringify(updatedUser))
  }

  const saveInvitation = async (invitationRequest) => {
    try {
      const response = await fetch(`${API_URL}/api/invites`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(invitationRequest),
      })

      if (!response.ok) {
        throw new Error('Failed to save invitation')
      }

      return await response.json()
    } catch (error) {
      console.error('Save error:', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('inviteque_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginWithData,
        signup,
        logout,
        addPurchasedInvitation,
        updatePurchasedInvitation,
        saveInvitation,
        loading,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
