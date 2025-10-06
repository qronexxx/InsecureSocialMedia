import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import API_BASE from '../api'
import { useAuth } from '../auth/AuthContext'

interface LoginModalProps {
    isOpen: boolean
    onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const resp = await fetch(`${API_BASE}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            if (!resp.ok) throw new Error('Anmeldung fehlgeschlagen')
            const data = (await resp.json()) as { token: string; username: string }
            login(data.username, data.token)
            onClose()
        } catch {
            setError('Anmeldung fehlgeschlagen')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-background-light/80 backdrop-blur-sm z-10" onClick={onClose} />
            <div className="fixed inset-0 z-20 flex min-h-screen items-center justify-center p-4">
                <div className="w-full max-w-md bg-background-light rounded-xl shadow-2xl p-8 space-y-6 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-accent-light hover:bg-subtle-light/50 rounded-full p-1 transition-colors"
                        aria-label="Schließen"
                    >
                        <CloseIcon />
                    </button>
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-foreground-light">Anmelden</h1>
                        <p className="text-accent-light mt-1">Willkommen zurück bei ConnectU!</p>
                    </div>
                    {error && <div className="text-sm text-red-600">{error}</div>}
                    <form className="space-y-6" onSubmit={submit}>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground-light" htmlFor="email">
                                E-Mail
                            </label>
                            <input
                                className="w-full bg-background-light border border-subtle-light text-foreground-light placeholder:text-accent-light rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                id="email"
                                placeholder="du@beispiel.at"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground-light" htmlFor="password">
                                Passwort
                            </label>
                            <input
                                className="w-full bg-background-light border border-subtle-light text-foreground-light placeholder:text-accent-light rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow"
                                id="password"
                                placeholder="••••••••"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            className="w-full bg-primary text-background-dark font-bold h-12 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-primary transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 cursor-pointer hover:scale-105"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Anmelden...' : 'Anmelden'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

export default LoginModal
