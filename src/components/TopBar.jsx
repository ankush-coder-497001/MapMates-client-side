
import { Users, Menu } from "lucide-react"
import { useEffect, useState } from "react"

export default function TopBar({ roomName, onlineCount, onMenuClick, members, Typing }) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Get first few member names for display
  const displayMembers = members.slice(0, 3)
  const remainingCount = Math.max(0, members.length - 3)
  const refineNames = (name) => {
    return name.length > 10 ? `${name.slice(0, 10)}...` : name
  }
  const getMembersText = () => {
    if (members.length === 0) return "No members"
    if (members.length === 1) return refineNames(members[0].name)
    if (members.length === 2) return `${refineNames(members[0].name)}, ${refineNames(members[1].name)}`
    if (members.length === 3) return `${refineNames(members[0].name)}, ${refineNames(members[1].name)}, ${refineNames(members[2].name)}`
    return `${displayMembers.map(member => member.name).join(", ")} and ${remainingCount} others`
  }

  return (
    <header
      className={`
      w-full h-16 backdrop-blur-md bg-white/6 border-b border-white/10 
      shadow-xl shadow-black/30 sticky top-0 z-50 transition-all duration-700 ease-out
      ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
    `}
    >
      <div className="flex items-center justify-between h-full px-4 lg:px-6">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl hover:bg-rose-500/20 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center"
        >
          <Menu className="w-6 h-6 text-gray-100" />
        </button>

        {/* Room Name */}
        <div className="flex-1 lg:flex-none px-4 lg:px-0">
          <h1 className="text-xl lg:text-2xl font-bold text-gray-100 truncate tracking-wide">{roomName}'s Chat</h1>
          <p className="text-xs text-gray-400 truncate leading-tight">

            {
              Typing.status ? (
                <span className="text-xs text-green-500 truncate leading-tight">
                  {Typing.text}
                </span>
              ) : (
                getMembersText()
              )}
          </p>
        </div>

        {/* Online Members */}
        <div className="flex items-center space-x-2 bg-white/6 rounded-full px-4 py-2 hover:bg-rose-500/20 transition-all duration-300 hover:scale-105 border border-white/10 shadow-lg">
          <div className="w-2 h-2 bg-[#FACC15] rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
          <Users className="w-4 h-4 text-[#FACC15]" />
          <span className="text-sm font-semibold text-gray-100">{onlineCount}</span>
        </div>
      </div>
    </header>
  )
}
