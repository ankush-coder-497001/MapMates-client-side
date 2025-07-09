
import { MoreHorizontal, Reply, Flag, Clock, User, Fan } from "lucide-react"
import { useState, useEffect } from "react"
import ReportModal from "./ReportModel"
export default function MessageBubble({ message, index, isAnnouncement = false }) {
  const [isVisible, setIsVisible] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showReportModel, setShowReportModel] = useState(false);
  const [reportData, setReportData] = useState({
    reportedUser: "",
    reason: "",
    reportedMessageId: null,
    context: "",
  })

  const parseMentions = (text) => {
    const regex = /@\[(.*?)\]\((.*?)\)/g;
    const parts = [];
    let lastIndex = 0;

    let match;
    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.slice(lastIndex, match.index));
      }

      parts.push(
        <span key={match[2]} className="text-[#E50914] font-semibold">
          @{match[1]}
        </span>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex));
    }

    return parts;
  };




  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), index * 100)
    return () => clearTimeout(timer)
  }, [index])

  const handleDropdownAction = (action) => {

    if (action === "Report") {
      console.log("Report data:", reportData)
      setShowReportModel(true)
    }

  }

  // Detect tag from message content
  const getMessageTag = (content) => {
    if (content == null) return null
    if (content.startsWith("[Help]")) return "help"
    if (content.startsWith("[Emergency]")) return "emergency"
    if (content.startsWith("[News]")) return "news"
    return null
  }

  const messageTag = getMessageTag(message.content)

  // Get tag-specific styling
  const getTagStyling = (tag) => {
    switch (tag) {
      case "help":
        return {
          bg: "bg-blue-500/20 border-blue-400/50 shadow-blue-500/30",
          glow: "shadow-2xl shadow-blue-500/40",
          pulse: "animate-pulse",
          accent: "border-l-4 border-l-blue-400",
        }
      case "emergency":
        return {
          bg: "bg-red-500/20 border-red-400/50 shadow-red-500/30",
          glow: "shadow-2xl shadow-red-500/40",
          pulse: "animate-pulse",
          accent: "border-l-4 border-l-red-400",
        }
      case "news":
        return {
          bg: "bg-amber-500/20 border-amber-400/50 shadow-amber-500/30",
          glow: "shadow-2xl shadow-amber-500/40",
          pulse: "animate-pulse",
          accent: "border-l-4 border-l-amber-400",
        }
      default:
        return null
    }
  }

  const tagStyling = getTagStyling(messageTag)

  // Get announcement styling
  const getAnnouncementStyling = (type) => {
    switch (type) {
      case "joined":
        return {
          bg: "bg-gradient-to-r from-emerald-500/20 to-green-500/20 border-emerald-400/30",
          icon: "🎉",
          textColor: "text-emerald-300",
          accentColor: "text-emerald-400",
        }
      case "left":
        return {
          bg: "bg-gradient-to-r from-orange-500/20 to-amber-500/20 border-orange-400/30",
          icon: "👋",
          textColor: "text-orange-300",
          accentColor: "text-orange-400",
        }
      default:
        return null
    }
  }

  const announcementStyling = isAnnouncement ? getAnnouncementStyling(message.announcementType) : null

  return (
    <>

      <div
        className={`
      flex transition-all duration-500 ease-out
      ${isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}
      ${isAnnouncement ? "justify-center" : message.isOwn ? "justify-end" : "justify-start"}
    `}
      >
        {isAnnouncement ? (
          // Announcement Message
          <div
            className={`
          max-w-md backdrop-blur-md rounded-2xl p-4 shadow-xl border text-center
          ${announcementStyling?.bg}
          animate-fade-in
        `}
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">{announcementStyling?.icon}</span>
              <div>
                <p className={`text-sm font-semibold ${announcementStyling?.textColor}`}>
                  <span className={`${announcementStyling?.accentColor} font-bold`}>{message.sender}</span>{" "}
                  {message.content}
                </p>
                <p className="text-xs text-gray-400 mt-1 font-medium">{message.time}</p>
              </div>
            </div>
          </div>
        ) : (
          // Regular Message (keep existing code)
          <div
            className={`
          max-w-xs lg:max-w-md xl:max-w-lg flex items-start space-x-3
          ${message.isOwn ? "flex-row-reverse space-x-reverse" : ""}
        `}
          >
            {/* Avatar */}
            {!message.isOwn && (
              <img
                src={message.avatar || "/placeholder.svg"}
                alt={message.sender}
                className="w-9 h-9 rounded-full border-2 border-[#E50914]/30 flex-shrink-0 shadow-lg"
              />
            )}

            {/* Message Content */}
            <div
              className={`
            backdrop-blur-md rounded-2xl p-4 shadow-xl relative group border
            ${tagStyling ? `${tagStyling.bg} ${tagStyling.glow} ${tagStyling.pulse} ${tagStyling.accent}` : ""}
            ${message.isOwn
                  ? tagStyling
                    ? ""
                    : "bg-[#1F2937]/80 text-gray-100 border-gray-600/30 shadow-gray-800/20"
                  : tagStyling
                    ? ""
                    : "bg-[#374151]/70 text-gray-100 border-gray-500/30 shadow-gray-700/20"
                }
            ${!tagStyling ? "text-gray-100" : "text-white"}
          `}
            >
              {/* Tag Badge */}
              {messageTag && (
                <div
                  className={`
                absolute -top-2 -left-2 px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider
                ${messageTag === "help" ? "bg-blue-500 text-white" : ""}
                ${messageTag === "emergency" ? "bg-red-500 text-white animate-bounce" : ""}
                ${messageTag === "news" ? "bg-amber-500 text-black" : ""}
                shadow-lg
              `}
                >
                  {messageTag}
                </div>
              )}

              {/* Sender Name */}
              {!message.isOwn && (
                <p className="text-sm font-semibold text-[#E50914] mb-2 tracking-wide">{message.sender}</p>
              )}

              {/* Message Text */}
              <p className="text-sm lg:text-base leading-relaxed font-medium">{parseMentions(message.content)}</p>

              {/* Time */}
              <p className="text-xs mt-2 text-gray-300 font-medium">{message.time}</p>

              {/* Three Dots Menu - Always visible on mobile */}
              {!message.isOwn && (
                <div className="absolute top-3 right-3 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                  <button
                    onClick={() => {
                      setShowDropdown(!showDropdown)
                      setReportData({
                        reportedUser: message.senderId,
                        reason: "",
                        reportedMessageId: message.id || null,
                        context: "",
                      })
                    }}
                    className="p-1.5 rounded-full hover:bg-rose-500/20 transition-all duration-200 hover:scale-110"
                  >
                    <MoreHorizontal className="w-4 h-4 text-gray-300" />
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute top-10 right-0 w-48 backdrop-blur-sm bg-red-900 border border-white/20 rounded-2xl shadow-2xl z-10 overflow-hidden">

                      <button
                        onClick={() => handleDropdownAction("Report")}
                        className="w-full px-4 py-3 text-left hover:bg-red-500/20 transition-all duration-200 flex items-center space-x-3 text-gray-100 hover:text-red-300"
                      >
                        <Flag className="w-4 h-4" />
                        <span className="font-medium">Report</span>
                      </button>


                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
        {
          showReportModel &&
          <ReportModal
            isOpen={showReportModel}
            onClose={() => setShowReportModel(false)}
            reportData={reportData}
          />
        }
      </div>
    </>

  )
}
