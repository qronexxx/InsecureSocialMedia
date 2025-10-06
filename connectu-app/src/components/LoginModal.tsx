import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background-light/80 backdrop-blur-sm z-10"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-20 flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md bg-background-light rounded-xl shadow-2xl p-8 space-y-6 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-accent-light hover:bg-subtle-light/50 rounded-full p-1 transition-colors"
          >
            <CloseIcon />
          </button>
          
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground-light">Log In</h1>
            <p className="text-accent-light mt-1">Welcome back to ConnectU!</p>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground-light" htmlFor="email">
                Email
              </label>
              <input 
                className="w-full bg-background-light border border-subtle-light text-foreground-light placeholder:text-accent-light rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" 
                id="email" 
                placeholder="you@example.com" 
                type="email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground-light" htmlFor="password">
                Password
              </label>
              <input 
                className="w-full bg-background-light border border-subtle-light text-foreground-light placeholder:text-accent-light rounded-lg h-12 px-4 focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow" 
                id="password" 
                placeholder="••••••••" 
                type="password"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input 
                  className="h-5 w-5 rounded border-subtle-light bg-background-light text-primary focus:ring-primary/50 focus:ring-offset-background-light transition" 
                  type="checkbox"
                />
                <span className="text-sm text-foreground-light">Remember me</span>
              </label>
              <a className="text-sm font-medium text-accent-light hover:text-primary transition-colors" href="#">
                Forgot Password?
              </a>
            </div>
            
            <button 
              className="w-full bg-primary text-background-dark font-bold h-12 rounded-lg hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background-light focus:ring-primary hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 cursor-pointer hover:scale-105" 
              type="submit"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default LoginModal
