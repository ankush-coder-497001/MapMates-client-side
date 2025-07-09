
import { Video, User, Cross, LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function MobileActions({ onOpenProfile, user, onLeave, socket }) {
  const navigate = useNavigate()
  return (
    <div className=" fixed z-30">
      {/* Video Call Button */}
      {/* <button
        onClick={() => {
          navigate("/videochat")
        }}
        className="lg:right-4 lg:top-18 fixed top-37 right-4 p-4 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-110 active:scale-95 border border-green-400/30 cursor-pointer "
      >
        <Video className="w-6 h-6" />
      </button> */}

      {/* Profile Button */}

      <button
        onClick={() => {
          console.log("User profile clicked");
          onLeave();
        }}
        className=" lg:right-4 lg:top-17 fixed top-17 right-4 p-4 rounded-full bg-gradient-to-r from-yellow-500 to-red-600 text-white shadow-2xl hover:shadow-green-500/40 transition-all duration-300 hover:scale-110 active:scale-95 border border-green-400/30 cursor-pointer "
      >
        <LogOut className="w-6 h-6" />
      </button>
    </div>
  )
}
