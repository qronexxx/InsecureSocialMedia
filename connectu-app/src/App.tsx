import React, { useEffect, useState } from 'react'
import LoginModal from './components/LoginModal'
import SignUpModal from './components/SignUpModal'
import { Routes, Route, Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import ExplorePage from './pages/ExplorePage.tsx'
import UploadPage from './pages/UploadPage.tsx'
import SavedPage from './pages/SavedPage.tsx'
import { useAuth } from './auth/AuthContext'
import AdminPage from './pages/AdminPage.tsx'

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
            <div className="relative flex flex-col min-h-screen overflow-x-hidden">
                {/* Header */}
                <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-sm border-b border-primary/20">
                    <div className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-gray-900">
                                {/* Neues Logo */}
                                <svg
                                    className="h-8 w-8 text-primary"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2.5"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                                <h2 className="text-2xl font-bold">ConnectU</h2>
                             </div>
                             <nav className="hidden md:flex items-center gap-8">
                                 <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Startseite</Link>
                                 <Link className="text-sm font-medium hover:text-primary transition-colors" to="/explore">Beiträge</Link>
                                 <Link className="text-sm font-medium hover:text-primary transition-colors" to="/upload">Hochladen</Link>
                                 {!(username?.toLowerCase().includes('admin')) && (
                                     <style>{`a[href="/admin"] { display: none !important; }`}</style>
                                 )}
                                 <Link className="text-sm font-medium hover:text-primary transition-colors" to="/admin">Admin</Link>
                                 {isAuthenticated && (
                                     <Link className="text-sm font-medium hover:text-primary transition-colors" to="/saved">Gespeichert</Link>
                                 )}
                             </nav>
                             <div className="flex items-center gap-4">
                                 {!isAuthenticated ? (
                                     <>
                                         <button
                                             onClick={openSignUp}
                                             className="px-6 py-2 rounded-full bg-primary text-gray-900 text-sm font-bold shadow-lg hover:bg-opacity-80 transition-all cursor-pointer hover:scale-105"
                                         >
                                             Registrieren
                                         </button>
                                         <button
                                             onClick={openLogin}
                                             className="px-6 py-2 rounded-full bg-primary/20 text-gray-900 text-sm font-bold hover:bg-primary/30 transition-all cursor-pointer hover:scale-105"
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

                 {/* Routes */}
                 <main className="flex-grow">
                     <Routes>
                         <Route index element={<HomeContent />} />
                         <Route path="/explore" element={<ExplorePage />} />
                         <Route path="/upload" element={isAuthenticated ? <UploadPage /> : <Navigate to="/" replace state={{ showLogin: true }} />} />
                         <Route path="/saved" element={isAuthenticated ? <SavedPage /> : <Navigate to="/" replace state={{ showLogin: true }} />} />
                         <Route path="/ueber" element={<UeberPage />} />
                         <Route path="/admin" element={<AdminPage />} />
                     </Routes>
                 </main>

                 {/* Footer */}
                 <footer className="bg-background-light border-t border-primary/20">
                     <div className="container mx-auto px-6 py-8">
                         <div className="flex flex-col items-center justify-between md:flex-row gap-6">
                             <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                                <Link className="text-sm text-gray-600 hover:text-primary transition-colors" to="/ueber">Über</Link>
                             </div>
                            <p className="text-sm text-gray-500">© 2025 ConnectU - Secure Social Media Plattform. 🔒</p>
                         </div>
                     </div>
                 </footer>
             </div>

             {/* Modals */}
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
            <section className="pt-28 md:pt-40 pb-12 relative overflow-hidden">
                {/* Deko-Bubbles */}
                <div className="pointer-events-none absolute top-0 left-0 w-72 h-72 bg-primary/20 rounded-full -translate-x-1/3 -translate-y-1/3 blur-3xl opacity-50" />
                <div className="pointer-events-none absolute bottom-0 right-0 w-96 h-96 bg-[#89d6f3]/20 rounded-full translate-x-1/4 translate-y-1/4 blur-3xl opacity-30" />
                <div className="pointer-events-none absolute top-1/2 left-1/4 w-64 h-64 bg-[#d9b8f3]/20 rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl opacity-30" />

                <div className="relative container mx-auto px-6">
                    <div className="text-center mb-10">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Hello {username}!</h2>
                        <button
                            onClick={() => navigate('/explore')}
                            className="px-8 py-4 rounded-full bg-primary text-gray-900 text-base font-bold shadow-xl hover:bg-opacity-80 transition-all transform hover:scale-105"
                        >
                            Beiträge ansehen
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-background-light/50 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-primary">add_circle</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Posts erstellen</h3>
                            <p className="text-gray-600 text-sm">
                                Teile deine Gedanken, Fotos und Erlebnisse mit der Community. Erstelle ansprechende Beiträge und lass andere daran teilhaben.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-background-light/50 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#89d6f3]/20 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-[#89d6f3]">thumb_up</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Kommentieren &amp; liken</h3>
                            <p className="text-gray-600 text-sm">
                                Interagiere mit den Beiträgen anderer. Hinterlasse Kommentare, gib Likes und werde Teil der Konversation.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-background-light/50 p-6 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 backdrop-blur-sm border border-gray-200/50 flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-[#d9b8f3]/20 flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-4xl text-[#d9b8f3]">bookmark</span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Private Sammlung</h3>
                            <p className="text-gray-600 text-sm">
                                Speichere deine Lieblingsbeiträge in deiner persönlichen Sammlung. Greife jederzeit darauf zu und organisiere deine Inspirationen.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <>
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
            {/* Neues Grid */}
            <section className="pb-20 md:pb-32">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        <div className="aspect-square bg-cover bg-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuB7CwU8bC_xQrJc0Bw2HG6Nnupar0zvN_vfHv3_ZVJ1zJRrNdsOcifO1Crz46DP_F_SSAQwPMagWlGWaju2LIklUComJDyDNRKVcz8EY9d_DHxoYksR72yE-Kicw3tJyhx6C4eXuDuxp2qN3MpExZjwi02BHRHyvHoTZUQB8iqj11WA32GIQUNLjt60CuLDv3yi0wYypAccpNCtFnejVxDEZcgdX7sHLNAa5t5Xl62hhocgOp5SkdJgpJ9zZiCkh2EPAbmgdJIhBA)' }} />
                        <div className="aspect-square bg-cover bg-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuAaL5irH8A9YpAz9AcV7f3iLftvxU4H6OHFqNufn1e6rVWFlDIAbdSy677V6xbsEAoSjdtwW_RlAOUVj5Wft20exiQgcjfgXukw3NkqoCCRP48YD8j_ycg4S9v0H2cINKu3TGwI62tEmapLyfRGpH7-97wGzuY8ZU-3a5C2LkCiAwc34rwGchw3446VF0Zbgf3KQ5VJ8mChievB0kEJT0oSRCMtCRQITfW_jUDTXGe4ui36_XIZUaAMlpONzERNdkS9VmXFir8Pyw)' }} />
                        <div className="aspect-square bg-cover bg-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCKQtV-ZWH2ualSHcJ3Tikbdj_yqArQLu9xZU4FyS92vNyPJsBFR_pp7jHYIb0-_qUEayUuyJ37EjPUgtMRgfqVWgDmgkNtsG0bRKb9DusjYc9KOeum1ZMPpJM1xKrqycn37fldPmt0SUgm5Vfls7kKAbTa-XB3jZBG_-aKvoyGqWlvbICvQ5Xl6lpfTk379AEfiMAyTHR0vvftcGysIQhp_UMoFVK7OsbXx6CQ1tFfqzbwp0FOD_eTjE5HfHzqcnA8GDwANcp5Ww)' }} />
                        <div className="aspect-square bg-cover bg-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBmhQdrNRE-GgdTNb2phES-MgwS0hob5JUDNCT1bZCbGwUIeU-lkfUsQelGW0v6WAoRk_oQ5cdyeXX_Rr4acTEEshkS88tpCz_CJ-9cHTHBJ9kVAy3UMoykTFPsG7AD4y3MB2KbVe8z9PvtzRnuk8CH0BZKqlCcnFsOy4cKJRKZftQ1NC1LELJnGEaz-slYScCyfTurSqzEDWg3jq6NfRVNiSoTbPVDe1JfKd7cNeF8_zxmjl9uExwqkAgOLvyculP-YCORHdkMDw)' }} />
                        <div className="aspect-square bg-cover bg-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBBgN1Ay0b5-iP7jaW0J8xhjrzkcJa2V1hjARzn8zCMZf9MP9u3cIj-wk8j6vUkb7FgoXMzCnylzMfQtRf-R58z0Wl-wOQ7dxOwbdkDhYPzLvhDyZDRWsPrutQWIk5AXDucWH_KAQxulrRGQSKCULiC-RGTuAexjQ5xSNgry3GxiriZ6FgmVf8rT9iOKKzfzQtf-MbAvuCOGVSq9RYsFExSAiI3iVDYOxuGqcspjJ4xWeIjFRyCmX-GW3CYOWJWNdWubTT9xGYzpQ)' }} />
                        <div className="aspect-square bg-cover bg-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300" style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuBdM6RkiRQ84LSF98FrdDpji9yHEmY7AbJ3dv1k0hFYuo-_RrADcDwUyfUKiR5Sky3j1ixpp2slCI8kEg2vU5WUJTJdLf6lB1D95dBbU0d3nt_6N2QOvLJXXrA2xQSKbo9Ro_6vnsUW3t70R5fh-ex66zRl03iuT3EX5ojzEtFqmrcb9itl-iS-4i2XWlBsHs1ZtPS01e9Oh1WJgTUbdf5sGf9Fuk_JBuaCSuePhR3oTQdFgF2FvCQYATf1EpGphO55BbC4WZPRmQ)' }} />
                    </div>
                </div>
            </section>
        </>
    )
}

const UeberPage: React.FC = () => (
  <main className="flex flex-1 items-center justify-center py-16 px-4 sm:px-6 lg:px-8">
    <div className="w-full max-w-4xl text-center space-y-12">
      <div className="bg-background-light p-8 rounded-xl border border-primary/20 shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 mb-8">Eine Seite von</h1>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-10">
          <div className="flex flex-col items-center gap-4">
            <div
              className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-primary/30"
              style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDlvr6DS_zHGKa2wyOrdix267Ox8k0vwJa1mbnxaHnOnV7EXNzusFV1xJw9Zz5SedVWXmhXNJAigAM8vBzxaaWjIBO2IjNwnLTCHQvyR8AcAyMv6syOqqbFL-g1BWT5m0ukCcAv2GsM0zqsX_m13vDqUsrN7ck4bDxGwzd8ItRNhZsYtNWOF5Wl6Fxvu_o7NGmRQrPqbj_LQZ0OEufajWttyJW114DY9P5lvcg28ghUIINR_fpE7Ktz5GLuQ4bdjVlEQmegbuYtNw)' }}
            />
            <p className="font-medium text-sm">Elias Zessner-Spitzenberg</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div
              className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-primary/30"
              style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuABKsm3zsMCz4LlLQRWOucKDXJ_aRhKQSLikNFj6REyVCsDrejH3lCq-xmVBeN1RxpLE29lYDKj34OBjGeMxnSPZIipQX2e-P5R-qYJdTNtF0rWDNYdRFtdCttzP_ZW7c83JpBgMeeo1FqEqukjC0U-Mk9MwqA2fY2rMgh9qtkkA5VOrEO5xqcvQ8Pq6zdVltID69Cu4PWrPDztQaBNUma5EmQrmbct7nYRVwXaRXCep-7R4c42RUlwKNpBL85B-n_PjvlsDY2D3g)' }}
            />
            <p className="font-medium text-sm">Fabian Hell</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div
              className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-primary/30"
              style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCMbEkBQ-TVcm4cugXiGFIRvMbK6rYOwVV_g3oKJmxNymuS4Z4oXdk2HE3riYltrQ9RoAWKM4-g0p9vf4IcJJdOBO3FIx5aDwm7nOuK1InDb1T5foWh3TmyuqoL1RFNmzWwvcTefqsB9z6oSD8U2SvkfmewoM9WrHyaUdmZG4xPTm5j_UM-ZQ21GWCx46xXG__acz8r42PyG6IAR1mYiabsA70zeBJzkXRss2O0LVZ_Y0NqZUQJkP_U47MMd53Z2_Y0CdFbFtFIpg)' }}
            />
            <p className="font-medium text-sm">Alireza M. Manshadi</p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div
              className="w-32 h-32 rounded-full bg-cover bg-center border-4 border-primary/30"
              style={{ backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuC76glG0NXzA4a3JtIMY5G9n_qnJl1-1Rg_nZ9nAqKoVT1WcFHgtHQ7MYagydr3MW7vaMlI2Y8KmusKJ2-9MBoRcQU0fMm-yaZRl9anYvTJ-LLVcQiVJt-g1cIXpN8NugAN6D4IF4HoUS1kW0kJFpVPaQWSSYZuBkEeXs0npBR6JAKGBQV6-MGTGI8pz3mXVTXFw6GClfmcQUSJI4Ph87_FUl8HkWOmO3PId0mvG4RPdi8spSirCBkYY5_HTBTlYDQPDKW0k8_TBw)' }}
            />
            <p className="font-medium text-sm">Daniel Fiala</p>
          </div>
        </div>
      </div>
    </div>
  </main>
)

export default App
