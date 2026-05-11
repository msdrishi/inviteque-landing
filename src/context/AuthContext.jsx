import { createContext, useContext, useState, useEffect } from 'react'

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

  const login = (userData) => {
    const userWithInvitations = {
      ...userData,
      purchasedInvitations: userData.purchasedInvitations || [],
    }
    setUser(userWithInvitations)
    localStorage.setItem('inviteque_user', JSON.stringify(userWithInvitations))
  }

  const signup = (userData) => {
    const userWithInvitations = {
      ...userData,
      purchasedInvitations: [],
    }
    setUser(userWithInvitations)
    localStorage.setItem('inviteque_user', JSON.stringify(userWithInvitations))
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

  const logout = () => {
    setUser(null)
    localStorage.removeItem('inviteque_user')
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        addPurchasedInvitation,
        updatePurchasedInvitation,
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
