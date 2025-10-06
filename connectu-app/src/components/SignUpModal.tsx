import React, { useState } from 'react'
import CloseIcon from '@mui/icons-material/Close'
import API_BASE from '../api'
import { useAuth } from '../auth/AuthContext'

interface SignUpModalProps {
    isOpen: boolean
    onClose: () => void
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
    const { login } = useAuth()
    const [username, setUsername] = useState('')
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
            const resp = await fetch(`${API_BASE}/api/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password }),
            })
            if (!resp.ok) throw new Error('Registrierung fehlgeschlagen')
            login(username, 'dummy-token')
            onClose()
        } catch {
            setError('Registrierung fehlgeschlagen')
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <div className="fixed inset-0 bg-background-dark/30 dark:bg-background-dark/50 backdrop-blur-sm z-10" onClick={onClose} />
            <div className="fixed inset-0 flex items-center justify-center p-4 z-20">
                <div className="relative bg-background-light w-full max-w-md p-8 sm:p-10 rounded-xl shadow-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-500 hover:bg-gray-200 rounded-full p-2 transition-colors"
                        aria-label="Schließen"
                    >
                        <CloseIcon />
                    </button>
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Registrieren</h1>
                        <p className="text-gray-600 mt-2">Werde Teil von ConnectU!</p>
                    </div>
                    {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
                    <form className="space-y-6" onSubmit={submit}>
                        <div>
                            <input
                                className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 text-gray-900 placeholder-gray-500 transition-colors"
                                id="username"
                                placeholder="Benutzername"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 text-gray-900 placeholder-gray-500 transition-colors"
                                id="email"
                                placeholder="E-Mail"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 text-gray-900 placeholder-gray-500 transition-colors"
                                id="password"
                                placeholder="Passwort"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <button
                                className="w-full bg-primary text-background-dark font-bold py-4 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer hover:scale-105"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? 'Erstelle Konto…' : 'Registrieren'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignUpModal
