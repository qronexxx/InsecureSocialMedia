import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type AuthContextType = {
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('auth') === '1'
  })

  const login = () => {
    setIsAuthenticated(true)
    localStorage.setItem('auth', '1')
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('auth')
  }

  const value = useMemo(() => ({ isAuthenticated, login, logout }), [isAuthenticated])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
