import React, { useState } from 'react'
import LoginModal from './components/LoginModal'
import SignUpModal from './components/SignUpModal'
import { Routes, Route, Link } from 'react-router-dom'
import ExplorePage from './pages/ExplorePage.tsx'
import UploadPage from './pages/UploadPage.tsx'

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'login' | 'signup' | null>(null)

  const openLogin = () => setActiveModal('login')
  const closeLogin = () => setActiveModal(null)
  const openSignUp = () => setActiveModal('signup')
  const closeSignUp = () => setActiveModal(null)

  return (
    <div className="bg-background-light font-display text-gray-800">
      <div className="relative flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background-light/80 backdrop-blur-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-gray-900">
                <svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path clipRule="evenodd" d="M24 4H6V17.3333V30.6667H24V44H42V30.6667V17.3333H24V4Z" fill="currentColor" fillRule="evenodd"></path>
                </svg>
                <h2 className="text-2xl font-bold">ConnectU</h2>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <Link className="text-sm font-medium hover:text-primary transition-colors" to="/">Home</Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors" to="/explore">Explore</Link>
                <Link className="text-sm font-medium hover:text-primary transition-colors" to="/upload">Upload</Link>
              </nav>
              <div className="flex items-center gap-4">
                <button
                  onClick={openSignUp}
                  className="px-6 py-2 rounded-full bg-primary text-gray-900 text-sm font-bold shadow-lg hover:bg-primary/90 transition-colors cursor-pointer hover:scale-105"
                >
                  Sign Up
                </button>
                <button
                  onClick={openLogin}
                  className="px-6 py-2 rounded-full bg-primary/20 text-gray-900 text-sm font-bold hover:bg-primary/30 transition-colors cursor-pointer hover:scale-105"
                >
                  Log In
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main routed content */}
        <main className="flex-grow">
          <Routes>
            <Route
              index
              element={<HomeContent onOpenSignUp={openSignUp} />}
            />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path='/upload' element={<UploadPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-background-light border-t border-primary/20">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col items-center justify-between md:flex-row gap-6">
              <div className="flex flex-wrap justify-center gap-6 md:gap-8">
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">About</a>
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">Terms</a>
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">Privacy</a>
                <a className="text-sm text-gray-600 hover:text-primary transition-colors" href="#">Contact</a>
              </div>
              <p className="text-sm text-gray-500">© 2025 ConnectU. All rights reserved.</p>
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

// Neue Startseiten-Komponente für Route "/"
type HomeContentProps = { onOpenSignUp: () => void }

const HomeContent: React.FC<HomeContentProps> = ({ onOpenSignUp }) => (
  <>
    <section className="py-20 md:py-32">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-4">Discover and Share</h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-8">Connect with friends, share your moments, and explore a world of new interests.</p>
        <button
          onClick={onOpenSignUp}
          className="px-8 py-4 rounded-full bg-primary text-gray-900 text-base font-bold shadow-xl hover:bg-opacity-80 transition-all transform hover:scale-105"
        >
          Get Started
        </button>
      </div>
    </section>

    <section className="pb-20 md:pb-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {imageUrls.map((url, index) => (
            <div
              key={index}
              className="aspect-square bg-cover bg-center rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300"
              style={{ backgroundImage: `url("${url}")` }}
            ></div>
          ))}
        </div>
      </div>
    </section>
  </>
)

// Bild-URLs aus deinem Original-HTML
const imageUrls = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB7CwU8bC_xQrJc0Bw2HG6Nnupar0zvN_vfHv3_ZVJ1zJRrNdsOcifO1Crz46DP_F_SSAQwPMagWlGWaju2LIklUComJDyDNRKVcz8EY9d_DHxoYksR72yE-Kicw3tJyhx6C4eXuDuxp2qN3MpExZjwi02BHRHyvHoTZUQB8iqj11WA32GIQUNLjt60CuLDv3yi0wYypAccpNCtFnejVxDEZcgdX7sHLNAa5t5Xl62hhocgOp5SkdJgpJ9zZiCkh2EPAbmgdJIhBA",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAaL5irH8A9YpAz9AcV7f3iLftvxU4H6OHFqNufn1e6rVWFlDIAbdSy677V6xbsEAoSjdtwW_RlAOUVj5Wft20exiQgcjfgXukw3NkqoCCRP48YD8j_ycg4S9v0H2cINKu3TGwI62tEmapLyfRGpH7-97wGzuY8ZU-3a5C2LkCiAwc34rwGchw3446VF0Zbgf3KQ5VJ8mChievB0kEJT0oSRCMtCRQITfW_jUDTXGe4ui36_XIZUaAMlpONzERNdkS9VmXFir8Pyw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCKQtV-ZWH2ualSHcJ3Tikbdj_yqArQLu9xZU4FyS92vNyPJsBFR_pp7jHYIb0-_qUEayUuyJ37EjPUgtMRgfqVWgDmgkNtsG0bRKb9DusjYc9KOeum1ZMPpJM1xKrqycn37fldPmt0SUgm5Vfls7kKAbTa-XB3jZBG_-aKvoyGqWlvbICvQ5Xl6lpfTk379AEfiMAyTHR0vvftcGysIQhp_UMoFVK7OsbXx6CQ1tFfqzbwp0FOD_eTjE5HfHzqcnA8GDwANcp5Ww",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBmhQdrNRE-GgdTNb2phES-MgwS0hob5JUDNCT1bZCbGwUIeU-lkfUsQelGW0v6WAoRk_oQ5cdyeXX_Rr4acTEEshkS88tpCz_CJ-9cHTHBJ9kVAy3UMoykTFPsG7AD4y3MB2KbVe8z9PvtzRnuk8CH0BZKqlCcnFsOy4cKJRKZftQ1NC1LELJnGEaz-slYScCyfTurSqzEDWg3jq6NfRVNiSoTbPVDe1JfKd7cNeF8_zxmjl9uExwqkAgOLvyculP-YCORHdkMDw",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBgN1Ay0b5-iP7jaW0J8xhjrzkcJa2V1hjARzn8zCMZf9MP9u3cIj-wk8j6vUkb7FgoXMzCnylzMfQtRf-R58z0Wl-wOQ7dxOwbdkDhYPzLvhDyZDRWsPrutQWIk5AXDucWH_KAQxulrRGQSKCULiC-RGTuAexjQ5xSNgry3GxiriZ6FgmVf8rT9iOKKzfzQtf-MbAvuCOGVSq9RYsFExSAiI3iVDYOxuGqcspjJ4xWeIjFRyCmX-GW3CYOWJWNdWubTT9xGYzpQ",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBdM6RkiRQ84LSF98FrdDpji9yHEmY7AbJ3dv1k0hFYuo-_RrADcDwUyfUKiR5Sky3j1ixpp2slCI8kEg2vU5WUJTJdLf6lB1D95dBbU0d3nt_6N2QOvLJXXrA2xQSKbo9Ro_6vnsUW3t70R5fh-ex66zRl03iuT3EX5ojzEtFqmrcb9itl-iS-4i2XWlBsHs1ZtPS01e9Oh1WJgTUbdf5sGf9Fuk_JBuaCSuePhR3oTQdFgF2FvCQYATf1EpGphO55BbC4WZPRmQ"
]

export default App
