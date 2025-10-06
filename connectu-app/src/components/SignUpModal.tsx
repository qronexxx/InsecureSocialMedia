import React from 'react'
import CloseIcon from '@mui/icons-material/Close'

interface SignUpModalProps {
  isOpen: boolean
  onClose: () => void
}

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-background-dark/30 dark:bg-background-dark/50 backdrop-blur-sm z-10"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-20">
        <div className="relative bg-background-light w-full max-w-md p-8 sm:p-10 rounded-xl shadow-2xl">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:bg-gray-200 rounded-full p-2 transition-colors"
          >
            <CloseIcon />
          </button>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Sign Up</h1>
            <p className="text-gray-600 mt-2">Join ConnectU today!</p>
          </div>
          
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="sr-only" htmlFor="username">Username</label>
              <input 
                className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 text-gray-900 placeholder-gray-500 transition-colors" 
                id="username" 
                placeholder="Username" 
                type="text"
              />
            </div>
            
            <div>
              <label className="sr-only" htmlFor="email">Email</label>
              <input 
                className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 text-gray-900 placeholder-gray-500 transition-colors" 
                id="email" 
                placeholder="Email" 
                type="email"
              />
            </div>
            
            <div>
              <label className="sr-only" htmlFor="password">Password</label>
              <input 
                className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 text-gray-900 placeholder-gray-500 transition-colors" 
                id="password" 
                placeholder="Password" 
                type="password"
              />
            </div>
            
            <div>
              <label className="sr-only" htmlFor="confirm-password">Confirm Password</label>
              <input 
                className="w-full bg-gray-100 border-2 border-transparent focus:border-primary focus:ring-0 rounded-lg p-4 text-gray-900 placeholder-gray-500 transition-colors" 
                id="confirm-password" 
                placeholder="Confirm Password" 
                type="password"
              />
            </div>
            
            <div className="flex items-center">
              <input 
                className="h-5 w-5 rounded border-gray-300 text-primary focus:ring-primary bg-gray-100" 
                id="terms" 
                name="terms" 
                type="checkbox"
              />
              <label className="ml-3 block text-sm text-gray-700" htmlFor="terms">
                I agree to the <a className="font-medium text-primary hover:underline" href="#">Terms & Conditions</a>
              </label>
            </div>
            
            <div>
              <button 
                className="w-full bg-primary text-background-dark font-bold py-4 px-4 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg shadow-primary/20 hover:shadow-primary/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer hover:scale-105" 
                type="submit"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default SignUpModal
