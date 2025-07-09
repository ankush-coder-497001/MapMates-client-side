
import { X, Hash, Crown } from "lucide-react"
import { useEffect, useState } from "react"

export default function Sidebar({ isOpen, onClose, user, memberList, onProfileModel }) {

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <aside
        className={`
        fixed lg:relative top-0 left-0 h-full w-80 lg:w-72 
        backdrop-blur-md bg-white/6 border-r border-white/10 
        shadow-2xl shadow-black/40 z-50 transition-transform duration-300 ease-out
        lg:flex lg:flex-col
        ${isOpen ? "flex flex-col translate-x-0" : "hidden -translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-100 tracking-wide">Members{memberList.length > 0 && ` (${memberList.length})`}</h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-xl hover:bg-rose-500/20 transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <X className="w-5 h-5 text-gray-100" />
          </button>
        </div>

        {/* Room List - Scrollable */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 sidebar-scroll min-h-0">
          {memberList.map((member, index) => (
            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/6 hover:bg-rose-500/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10 hover:border-rose-500/30 shadow-lg">
              <div className="relative flex-shrink-0">
                <img
                  src={member.profilePic}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-[#E50914]/50 shadow-lg"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FACC15] rounded-full border-2 border-[#0F0F0F] shadow-lg flex items-center justify-center">
                  <Crown className="w-2 h-2 text-black" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-100 truncate text-sm">{member.name}</p>
                <p className="text-xs text-[#FACC15] font-medium">{member._id === user.id ? "You" : member.isOnline ? "Online" : "Offline"}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Profile Section */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <div className="flex items-center space-x-3 p-4 rounded-2xl bg-white/6 hover:bg-rose-500/20 transition-all duration-300 hover:scale-105 cursor-pointer border border-white/10 hover:border-rose-500/30 shadow-lg"
            onClick={onProfileModel}
          >
            <div className="relative flex-shrink-0">
              <img
                src={user?.profilePic}
                alt="Profile"
                className="w-10 h-10 rounded-full border-2 border-[#E50914]/50 shadow-lg"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FACC15] rounded-full border-2 border-[#0F0F0F] shadow-lg flex items-center justify-center">
                <Crown className="w-2 h-2 text-black" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-100 truncate text-sm">{user.name} (ME)</p>
              <p className="text-xs text-[#FACC15] font-medium">Online</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
