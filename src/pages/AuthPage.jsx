
import { useState } from "react"
import PlatformBranding from "../components/PlatformBranding"
import LoginForm from "../components/LoginForm"
import SignupForm from "../components/SignupForm"
import Loader from "../components/Loader"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  return (
    <>
      {isLoading && <Loader />}
      <div className="h-screen bg-[#0F0F0F] relative overflow-hidden">
        {/* Background Pattern */}
        <div
          className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23F3F4F6' fillOpacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-50`}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-gray-900/50 to-[#0F0F0F] opacity-80"></div>

        {/* Floating Background Elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-[#E50914]/10 to-rose-600/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-[#FACC15]/10 to-yellow-500/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-[#F43F5E]/10 to-pink-500/10 rounded-full blur-2xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Main Content */}
        <div className="relative z-10 h-full flex">
          {/* Left Side - Platform Branding (Hidden on mobile) */}
          <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative">
            <div className="absolute inset-0 backdrop-blur-md bg-white/5 border-r border-white/10"></div>
            <div className="relative z-10 w-full h-full">
              <PlatformBranding />
            </div>
          </div>

          {/* Right Side - Auth Forms */}
          <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md">
              {/* Mobile Logo (Visible only on mobile) */}
              <div className="lg:hidden text-center mb-6">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#E50914] to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-gradient-netflix">ChatGlass</h1>
                </div>
                <p className="text-gray-300 text-xs">Premium glassmorphism chat platform</p>
              </div>

              {/* Auth Forms */}
              {isLogin ? (
                <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
              ) : (
                <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>

  )
}
