
import { MessageCircle, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

export default function Loader({
  message = "Loading...",
  size = "medium",
  showSparkles = false,
  className = "",
  isOverlay = true,
}) {
  const [dots, setDots] = useState("")
  const [sparklePositions, setSparklePositions] = useState([])

  // Animated dots effect
  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  // Generate random sparkle positions
  useEffect(() => {
    if (showSparkles) {
      const positions = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 1.5 + Math.random() * 1,
      }))
      setSparklePositions(positions)
    }
  }, [showSparkles])

  // Size configurations
  const sizeConfig = {
    small: {
      container: "w-32 h-32",
      logo: "w-8 h-8",
      logoIcon: "w-4 h-4",
      text: "text-xs",
      sparkle: "w-2 h-2",
      progressBar: "w-24",
    },
    medium: {
      container: "w-40 h-40",
      logo: "w-12 h-12",
      logoIcon: "w-6 h-6",
      text: "text-sm",
      sparkle: "w-3 h-3",
      progressBar: "w-32",
    },
    large: {
      container: "w-48 h-48",
      logo: "w-16 h-16",
      logoIcon: "w-8 h-8",
      text: "text-base",
      sparkle: "w-4 h-4",
      progressBar: "w-40",
    },
  }

  const config = sizeConfig[size] || sizeConfig.medium

  const LoaderContent = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Main Loader Container */}
      <div className={`relative ${config.container} flex items-center justify-center`}>
        {/* Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#E50914]/20 to-rose-600/20 rounded-full blur-xl animate-pulse"></div>

        {/* Glassmorphism Container */}
        <div className="relative backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-6 shadow-2xl shadow-red-500/20 animate-float">
          {/* Rotating Border */}
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-[#E50914] via-rose-500 to-[#FACC15] animate-spin"
            style={{
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "xor",
              WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "xor",
              padding: "2px",
            }}
          ></div>

          {/* ChatGlass Logo */}
          <div
            className={`${config.logo} bg-gradient-to-br from-[#E50914] to-rose-600 rounded-2xl flex items-center justify-center shadow-lg relative z-10 animate-pulse`}
          >
            <MessageCircle className={`${config.logoIcon} text-white`} />
          </div>

          {/* Floating Chat Bubbles */}
          <div
            className="absolute -top-2 -right-2 w-4 h-3 bg-gradient-to-r from-[#E50914]/80 to-rose-500/80 rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="absolute -bottom-1 -left-2 w-3 h-2 bg-gradient-to-r from-rose-500/80 to-[#FACC15]/80 rounded-full animate-bounce"
            style={{ animationDelay: "0.8s" }}
          ></div>
          <div
            className="absolute top-1 -left-3 w-2 h-2 bg-gradient-to-r from-[#FACC15]/80 to-yellow-400/80 rounded-full animate-bounce"
            style={{ animationDelay: "1.2s" }}
          ></div>
        </div>

        {/* Sparkles */}
        {showSparkles &&
          sparklePositions.map((sparkle) => (
            <div
              key={sparkle.id}
              className="absolute pointer-events-none"
              style={{
                left: `${sparkle.x}%`,
                top: `${sparkle.y}%`,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: `${sparkle.duration}s`,
              }}
            >
              <Sparkles className={`${config.sparkle} text-[#FACC15] animate-ping opacity-70`} />
            </div>
          ))}

        {/* Pulse Rings */}
        <div
          className="absolute inset-0 rounded-full border border-[#E50914]/30 animate-ping"
          style={{ animationDuration: "2s" }}
        ></div>
        <div
          className="absolute inset-2 rounded-full border border-rose-500/20 animate-ping"
          style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}
        ></div>
      </div>

      {/* Loading Message */}
      <div className="text-center space-y-3">
        <p className={`${config.text} font-semibold text-gray-100 tracking-wide`}>
          {message}
          <span className="text-[#E50914] font-bold w-8 inline-block text-left">{dots}</span>
        </p>

        {/* Progress Bar */}
        <div className={`${config.progressBar} h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm mx-auto`}>
          <div className="h-full bg-gradient-to-r from-[#E50914] via-rose-500 to-[#FACC15] rounded-full animate-pulse transform origin-left">
            <div className="w-full h-full bg-gradient-to-r from-[#E50914] to-rose-500 animate-slide-progress"></div>
          </div>
        </div>
      </div>
    </div>
  )

  // If it's an overlay, render with backdrop blur and absolute positioning
  if (isOverlay) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${className}`}>
        {/* Backdrop Blur Overlay */}
        <div className="absolute inset-0 backdrop-blur-md bg-black/30"></div>

        {/* Loader Content */}
        <div className="relative z-10">
          <LoaderContent />
        </div>
      </div>
    )
  }

  // If not an overlay, render inline
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <LoaderContent />
    </div>
  )
}
