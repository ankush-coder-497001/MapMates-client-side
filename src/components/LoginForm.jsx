

import { useEffect, useState } from "react"
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react"
import toast from 'react-hot-toast'
import { haveRoom, Login } from "../services/user.svc"
import { useNavigate } from "react-router-dom"
import { auth, provider } from "../FireBase"
import { signInWithPopup } from "firebase/auth"
export default function LoginForm({ onSwitchToSignup }) {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const checkRoomAssignment = async () => {
    try {
      const { isAssigned } = await haveRoom();
      console.log("Room Assignment Check:", isAssigned)
      if (isAssigned) {
        navigate("/home");
      } else {
        navigate("/rooms");
      }
    } catch (error) {
      console.error("Error checking room assignment:", error)
    }
  }
  useEffect(() => {
    const user = localStorage.getItem("chat_user")
    const token = localStorage.getItem("chat_token")
    if (token && user) {
      checkRoomAssignment()
    }
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast.error("Email and password are required")
      return
    }

    setIsLoading(true)
    try {
      const res = await Login(formData);
      toast.success(res.message)
      localStorage.setItem("chat_user", JSON.stringify(res.user))
      localStorage.setItem("chat_token", res.token)
      navigate("/home");
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }

  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const userData = {
        email: user.email,
        password: user.uid,
      }
      const res = await Login(userData)
      toast.success(res.message)
      localStorage.setItem("chat_user", JSON.stringify(res.user))
      localStorage.setItem("chat_token", res.token)
      navigate("/home")
    } catch (error) {
      console.error("Google Sign-In Error:", error)
      toast.error("Failed to sign in with Google. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="backdrop-blur-md bg-white/6 border border-white/10 rounded-3xl p-6 shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100 mb-1">Welcome Back</h2>
          <p className="text-gray-400 text-sm">Sign in to continue your conversations</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-4 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300"
                placeholder="Enter your email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="w-full pl-12 pr-12 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300"
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-600 bg-white/6 text-[#E50914] focus:ring-[#E50914]/50 focus:ring-2"
              />
              <span className="text-sm text-gray-300">Remember me</span>
            </label>
            <button type="button" className="text-sm text-[#E50914] hover:text-rose-400 transition-colors duration-200">
              Forgot password?
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-[#E50914] to-rose-600 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-[#F43F5E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 shadow-lg active:scale-95 flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-5 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
          <span className="px-4 text-sm text-gray-400">or</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-3">
          <button onClick={handleGoogleSignIn} className="w-full py-2.5 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 hover:bg-white/8 transition-all duration-300 hover:scale-105 flex items-center justify-center cursor-pointer space-x-3">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-sm">Continue with Google</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-5 text-center">
          <p className="text-gray-400 text-sm">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-[#E50914] hover:text-rose-400 font-semibold transition-colors duration-200"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
