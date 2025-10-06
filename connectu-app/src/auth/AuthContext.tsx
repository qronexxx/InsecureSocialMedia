import React, { createContext, useContext, useMemo, useState } from 'react'

type AuthContextType = {
    isAuthenticated: boolean
    username: string | null
    token: string | null
    login: (username: string, token: string) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
    const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'))

    const login = (uname: string, tok: string) => {
        setToken(tok)
        setUsername(uname)
        localStorage.setItem('token', tok)
        localStorage.setItem('username', uname)
        localStorage.setItem('auth', '1')
    }

    const logout = () => {
        setToken(null)
        setUsername(null)
        localStorage.removeItem('token')
        localStorage.removeItem('username')
        localStorage.removeItem('auth')
    }

    const value = useMemo(
        () => ({
            isAuthenticated: !!token,
            token,
            username,
            login,
            logout,
        }),
        [token, username]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
