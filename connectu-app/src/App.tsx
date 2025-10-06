import React, { useEffect, useState } from 'react'
import LoginModal from './components/LoginModal'
import SignUpModal from './components/SignUpModal'
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import ExplorePage from './pages/ExplorePage.tsx'
import UploadPage from './pages/UploadPage.tsx'
import SavedPage from './pages/SavedPage.tsx'
import { useAuth } from './auth/AuthContext'

const App: React.FC = () => {
    const { isAuthenticated, username, logout } = useAuth()
    const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null)
    const location = useLocation()

    const openLogin = () => setActiveModal('login')
    const closeLogin = () => setActiveModal(null)
    const openSignUp = () => setActiveModal('signup')
    const closeSignUp = () => setActiveModal(null)

    useEffect(() => {
        const state = location.state as any
        if (state?.showLogin) {
            setActiveModal('login')
            window.history.replaceState({}, '')
        }
    }, [location.state])

    return (
        <div className="bg-background-light font-display text-gray-800">
            <div className="relative flex flex-col min-h-screen">
                {}
                <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-sm border-b border-primary/20">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-900">
                                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                                    <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                                </svg>
                                <h2 className="text-2xl font-bold">ConnectU</h2>
                            </div>
                            <nav className="hidden md:flex items-center gap-8">
                                <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Startseite</Link>
                                <Link className="text-sm font-medium hover:text-primary transition-colors" to="/explore">Beiträge</Link>
                                <Link className="text-sm font-medium hover:text-primary transition-colors" to="/upload">Hochladen</Link>
                                {isAuthenticated && (
                                    <Link className="text-sm font-medium hover:text-primary transition-colors" to="/saved">Gespeichert</Link>
                                )}
                            </nav>
                            <div className="flex items-center gap-4">
                                {!isAuthenticated ? (
                                    <>
                                        <button
                                            onClick={openSignUp}
                                            className="px-6 py-2 rounded-full bg-primary text-gray-900 text-sm font-bold shadow-lg hover:bg-primary/90 transition-colors cursor-pointer hover:scale-105"
                                        >
                                            Registrieren
                                        </button>
                                        <button
                                            onClick={openLogin}
                                            className="px-6 py-2 rounded-full bg-primary/20 text-gray-900 text-sm font-bold hover:bg-primary/30 transition-colors cursor-pointer hover:scale-105"
                                        >
                                            Anmelden
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <div className="px-3 py-1.5 rounded-full bg-primary/20 text-sm font-semibold text-gray-900">
                                            {username}
                                        </div>
                                        <button
                                            onClick={logout}
                                            className="px-4 py-2 rounded-full bg-primary/20 text-gray-900 text-sm font-bold hover:bg-primary/30 transition-colors cursor-pointer"
                                        >
                                            Abmelden
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {}
                <main className="flex-grow">
                    <Routes>
                        <Route index element={<HomeContent />} />
                        <Route path="/explore" element={<ExplorePage />} />
                        <Route path="/upload" element={isAuthenticated ? <UploadPage /> : <Navigate to="/" replace state={{ showLogin: true }} />} />
                        <Route path="/saved" element={isAuthenticated ? <SavedPage /> : <Navigate to="/" replace state={{ showLogin: true }} />} />
                        <Route path="/ueber" element={<UeberPage />} />
                    </Routes>
                </main>

                {}
                <footer className="bg-background-light border-t border-primary/20">
                    <div className="container mx-auto px-6 py-8">
                        <div className="flex flex-col items-center justify-between md:flex-row gap-6">
                            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                                <Link className="text-sm text-gray-600 hover:text-primary transition-colors" to="/ueber">Über</Link>
                            </div>
                            <p className="text-sm text-gray-500">© 2025 ConnectU. Alle Rechte vorbehalten.</p>
                        </div>
                    </div>
                </footer>
            </div>

            {}
            <LoginModal isOpen={activeModal === 'login'} onClose={closeLogin} />
            <SignUpModal isOpen={activeModal === 'signup'} onClose={closeSignUp} />
        </div>
    )
}

const HomeContent: React.FC = () => {
    const { isAuthenticated, username } = useAuth()
    const navigate = useNavigate()

    if (isAuthenticated) {
        return (
            <section className="py-20 md:py-32">
                <div className="container mx-auto px-6 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">Guten Tag, {username}!</h1>
                    <button
                        onClick={() => navigate('/explore')}
                        className="px-8 py-4 rounded-full bg-primary text-gray-900 text-base font-bold shadow-xl hover:bg-opacity-80 transition-all transform hover:scale-105"
                    >
                        Posts anderer Nutzer ansehen
                    </button>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 md:py-32">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">Entdecken & Teilen</h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Verbinde dich mit Freunden, teile deine Momente und entdecke neue Interessen.
                </p>
                <Link
                    to="/explore"
                    className="px-8 py-4 inline-block rounded-full bg-primary text-gray-900 text-base font-bold shadow-xl hover:bg-opacity-80 transition-all transform hover:scale-105"
                >
                    Beiträge ansehen
                </Link>
            </div>
        </section>
    )
}

const UeberPage: React.FC = () => (
    <main className="min-h-[60vh] w-full flex items-center justify-center">
        <h1 className="text-2xl font-bold">Auf dieser Website können Beiträge gepostet, angesehen und mit ihnen interagiert werden.</h1>
    </main>
)

export default App
