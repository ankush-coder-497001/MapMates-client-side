
import { useState, useEffect } from "react"
import { X, Camera, Eye, EyeOff, User, Mail, Lock, Save, Edit3 } from "lucide-react"
import toast from "react-hot-toast"
import { ResetPassword } from "../services/user.svc"
export default function ProfileModal({ isOpen, onClose, userProfile, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: userProfile?.name || "John Doe",
    email: userProfile?.email || "john.doe@example.com",
    profilePic: userProfile?.profilePic || "/placeholder.svg?height=120&width=120",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })


  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: userProfile?.name || "John Doe",
        email: userProfile?.email || "john.doe@example.com",
        profilePic: userProfile?.profilePic || "/placeholder.svg?height=120&width=120",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
      setIsEditing(false)
    }
  }, [isOpen, userProfile])

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error("New passwords don't match!")
      return
    }


    //lets make a call for reset password if new password is provided
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change password!")
        return
      }
      if (formData.newPassword.length < 6) {
        toast.error("New password must be at least 6 characters long!")
        return
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("New passwords don't match!")
        return
      }
      setIsLoading(true)
      try {
        const res = await ResetPassword({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
        toast.success(res.message)
      } catch (error) {
        toast.error(error.message);
      } finally {
        setIsLoading(false)
      }

    }


    if (formData.name.trim() === "") {
      toast.error("Name cannot be empty!")
      return
    }

    if (formData.email.trim() === "") {
      toast.error("Email cannot be empty!")
      return
    }

    if (formData.profilePic === userProfile.profilePic && formData.name === userProfile.name && formData.email === userProfile.email && !formData.newPassword) {
      setIsEditing(false)
      return
    }


    onUpdateProfile(formData)
  }

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0]
    if (file) {

      //compress image if needed
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert("Image size exceeds 2MB. Please upload a smaller image.")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData({
          ...formData,
          profilePic: e.target.result,
          file: file // Store the file for upload
        })
      }


      reader.readAsDataURL(file)
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`
  fixed z-50 transition-all duration-500 ease-out
  lg:top-0 lg:right-0 lg:h-full lg:w-96
  max-lg:bottom-0 max-lg:left-0 max-lg:right-0 max-lg:h-[90vh]
  ${isOpen ? "lg:translate-x-0 max-lg:translate-y-0" : "lg:translate-x-full max-lg:translate-y-full"}
`}
      >
        {/* Modal Content */}
        <div className="h-full backdrop-blur-md bg-white/10 border-l border-white/20 lg:border-l max-lg:border-t max-lg:rounded-t-3xl max-lg:border-l-0 shadow-2xl shadow-black/30 flex flex-col">
          {/* Mobile Handle Bar */}
          <div className="lg:hidden flex justify-center py-3 border-b border-white/10 flex-shrink-0">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-100">Profile Settings</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-rose-500/20 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-100" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 sidebar-scroll">
            {/* Profile Picture Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={formData.profilePic || "/placeholder.svg"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border-4 border-[#E50914]/30 shadow-2xl shadow-red-500/20 object-cover"
                />
                {isEditing && (
                  <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-[#E50914] to-rose-600 rounded-full cursor-pointer hover:scale-110 transition-all duration-300 shadow-lg">
                    <Camera className="w-4 h-4 text-white" />
                    <input type="file" accept="image/*" onChange={handleProfilePicChange} className="hidden" />
                  </label>
                )}
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {isEditing ? "Click camera to change photo" : "Profile Picture"}
              </p>
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-100 flex items-center space-x-2">
                <User className="w-5 h-5 text-[#E50914]" />
                <span>Basic Information</span>
              </h3>

              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300 disabled:opacity-60"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className="w-full pl-12 pr-4 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300 disabled:opacity-60"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
            </div>

            {/* Password Section */}
            {isEditing && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-100 flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-[#E50914]" />
                  <span>Change Password</span>
                </h3>

                {/* Current Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300"
                      placeholder="Enter current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-12 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors duration-200"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Extra spacing for mobile scrolling */}
            <div className="h-4"></div>
          </div>

          {/* Fixed Footer Actions */}
          <div className="p-6 border-t border-white/10 flex-shrink-0 bg-white/5 backdrop-blur-md">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="w-full py-3 bg-gradient-to-r from-[#E50914] to-rose-600 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-[#F43F5E] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 shadow-lg active:scale-95 flex items-center justify-center space-x-2"
              >
                <Edit3 className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-[#E50914] to-rose-600 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-[#F43F5E] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 shadow-lg active:scale-95 flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="w-full py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 hover:bg-white/8 transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
