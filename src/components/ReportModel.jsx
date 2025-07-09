
import { useState, useEffect } from "react"
import { X, Flag, ChevronDown, AlertTriangle, MessageSquare, User, Shield, Zap } from "lucide-react"
import toast from "react-hot-toast"
import { createReport } from '../services/report.svc'

export default function ReportModal({ isOpen, onClose, reportTarget, reportData }) {
  const [selectedReason, setSelectedReason] = useState("")
  const [customReason, setCustomReason] = useState("")
  const [additionalDetails, setAdditionalDetails] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)

  const reportReasons = [
    {
      id: "spam",
      label: "Spam or Unwanted Content",
      description: "Repetitive, promotional, or irrelevant messages",
      icon: Zap,
      color: "text-amber-400",
    },
    {
      id: "harassment",
      label: "Harassment or Bullying",
      description: "Targeting, intimidating, or threatening behavior",
      icon: Shield,
      color: "text-red-400",
    },
    {
      id: "inappropriate",
      label: "Inappropriate Content",
      description: "Adult content, violence, or disturbing material",
      icon: AlertTriangle,
      color: "text-orange-400",
    },
    {
      id: "hate_speech",
      label: "Hate Speech",
      description: "Discriminatory language or content",
      icon: MessageSquare,
      color: "text-red-500",
    },
    {
      id: "impersonation",
      label: "Impersonation",
      description: "Pretending to be someone else",
      icon: User,
      color: "text-purple-400",
    },
    {
      id: "privacy",
      label: "Privacy Violation",
      description: "Sharing personal information without consent",
      icon: Shield,
      color: "text-blue-400",
    },
    {
      id: "other",
      label: "Other",
      description: "Something else that violates community guidelines",
      icon: Flag,
      color: "text-gray-400",
    },
  ]

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedReason("")
      setCustomReason("")
      setAdditionalDetails("")
      setShowDropdown(false)
    }
  }, [isOpen])

  const handleReasonSelect = (reasonId) => {
    setSelectedReason(reasonId)
    setShowDropdown(false)
    if (reasonId !== "other") {
      setCustomReason("")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedReason) {
      toast.error("Please select a reason for reporting")
      return
    }

    if (selectedReason === "other" && !customReason.trim()) {
      toast.error("Please provide a custom reason")
      return
    }

    const FinalreportData = {
      reason: selectedReason,
      note: customReason || "",
      reportedMessageId: reportData.reportedMessageId,
      reportedUser: reportData.reportedUser,
      context: 'chat'
    }
    try {
      setIsLoading(true)
      const res = await createReport(FinalreportData);
      toast.success(res.message);
    } catch (error) {
      console.error("Error submitting report:", error)
      toast.error(error.message);
    } finally {
      setIsLoading(false)
      onClose()
    }

  }

  const selectedReasonData = reportReasons.find((r) => r.id === selectedReason)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
        onClick={onClose}
      />

      {/* Modal Container */}
      <div
        className={`
  fixed z-50 overflow-auto transition-all duration-500 ease-out
  lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2
  lg:w-full lg:max-w-md lg:mx-4
  max-lg:bottom-0 max-lg:left-0 max-lg:right-0  max-lg:h-[${selectedReason === "other" ? "80vh" : "57vh"}]
  ${isOpen ? "lg:scale-100 lg:opacity-100 max-lg:translate-y-0" : "lg:scale-95 lg:opacity-0 max-lg:translate-y-full"}
`}
      >
        {/* Modal Content */}
        <div className="h-full backdrop-blur-md bg-white/10 border border-white/20 lg:rounded-3xl max-lg:rounded-t-3xl max-lg:border-b-0 shadow-2xl shadow-black/30 overflow-hidden">
          {/* Mobile Handle Bar */}
          <div className="lg:hidden flex justify-center py-3 border-b border-white/10 flex-shrink-0">
            <div className="w-12 h-1 bg-white/30 rounded-full"></div>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Flag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-100">Report Content</h2>
                <p className="text-sm text-gray-400">Help us keep ChatGlass safe</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-rose-500/20 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <X className="w-5 h-5 text-gray-100" />
            </button>
          </div>

          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto sidebar-scroll">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Report Target Info */}
              {reportTarget && (
                <div className="backdrop-blur-md bg-white/6 border border-white/10 rounded-2xl p-4">
                  <p className="text-sm text-gray-300 mb-2">Reporting:</p>
                  <div className="flex items-center space-x-3">
                    {reportTarget.avatar && (
                      <img
                        src={reportTarget.avatar || "/placeholder.svg"}
                        alt={reportTarget.sender}
                        className="w-8 h-8 rounded-full border-2 border-red-500/30"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-100 text-sm truncate">{reportTarget.sender}</p>
                      <p className="text-xs text-gray-400 truncate">{reportTarget.content}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Why are you reporting this?</label>

                {/* Custom Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="w-full p-4 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-left text-gray-100 hover:bg-white/8 transition-all duration-300 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      {selectedReasonData ? (
                        <>
                          <selectedReasonData.icon className={`w-5 h-5 ${selectedReasonData.color}`} />
                          <div>
                            <p className="font-medium">{selectedReasonData.label}</p>
                            <p className="text-xs text-gray-400">{selectedReasonData.description}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Select a reason...</span>
                      )}
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 backdrop-blur-md bg-black border border-white/20 rounded-2xl shadow-2xl z-10 max-h-80 overflow-y-auto sidebar-scroll">
                      {reportReasons.map((reason) => {
                        const Icon = reason.icon
                        return (
                          <button
                            key={reason.id}
                            type="button"
                            onClick={() => handleReasonSelect(reason.id)}
                            className="w-full p-4 text-left hover:bg-white/10 transition-all duration-200 flex items-center space-x-3 first:rounded-t-2xl last:rounded-b-2xl"
                          >
                            <Icon className={`w-5 h-5 ${reason.color} flex-shrink-0`} />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-100 text-sm">{reason.label}</p>
                              <p className="text-xs text-gray-400 leading-relaxed">{reason.description}</p>
                            </div>
                            {selectedReason === reason.id && (
                              <div className="w-2 h-2 bg-[#E50914] rounded-full flex-shrink-0"></div>
                            )}
                          </button>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Custom Reason Input */}
              {selectedReason === "other" && (
                <div className="space-y-2 animate-fade-in">
                  <label className="text-sm font-medium text-gray-300">Please specify the reason</label>
                  <textarea
                    value={customReason}
                    onChange={(e) => setCustomReason(e.target.value)}
                    placeholder="Describe why you're reporting this content..."
                    className="w-full p-4 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300 resize-none h-24"
                    required
                  />
                </div>
              )}

              {/* Warning Message */}
              <div className="backdrop-blur-md bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-300 mb-1">Important</p>
                    <p className="text-xs text-amber-200/80 leading-relaxed">
                      False reports may result in restrictions on your account. Please only report content that
                      genuinely violates our community guidelines.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Fixed Footer Actions */}
          <div className="p-6 border-t border-white/10 flex-shrink-0 bg-white/5 backdrop-blur-md">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 backdrop-blur-md bg-white/6 border border-white/20 rounded-2xl text-gray-100 hover:bg-white/8 transition-all duration-300 hover:scale-105 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading || !selectedReason}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-2xl hover:from-rose-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 shadow-lg active:scale-95 flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Flag className="w-4 h-4" />
                    <span>Submit Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
