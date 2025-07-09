
import { MessageCircle, Users, Shield, Zap } from "lucide-react"

export default function PlatformBranding() {
  const features = [
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Instant messaging with glassmorphism UI",
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Connect with your team seamlessly",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "End-to-end encrypted conversations",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Optimized for speed and performance",
    },
  ]

  return (
    <div className="flex flex-col justify-center h-full px-8 lg:px-12 py-8">
      {/* Logo and Brand */}
      <div className="text-center lg:text-left mb-6">
        <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-[#E50914] to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/30">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gradient-netflix">ChatGlass</h1>
        </div>

        <h2 className="text-xl lg:text-2xl font-bold text-gray-100 mb-3 leading-tight">
          Welcome to the Future of
          <span className="text-gradient-netflix"> Communication</span>
        </h2>

        <p className="text-gray-300 text-sm lg:text-base leading-relaxed max-w-sm mx-auto lg:mx-0">
          Experience seamless conversations with our premium glassmorphism chat platform.
        </p>
      </div>

      {/* SVG Illustration - Compact */}
      <div className="flex justify-center lg:justify-start mb-6">
        <div className="relative">
          <svg width="240" height="140" viewBox="0 0 240 140" className="drop-shadow-2xl">
            {/* Background Glow */}
            <defs>
              <radialGradient id="glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E50914" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#E50914" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
              </linearGradient>
            </defs>

            <circle cx="120" cy="70" r="60" fill="url(#glow)" />

            {/* Chat Bubbles */}
            <rect
              x="40"
              y="45"
              width="60"
              height="20"
              rx="10"
              fill="url(#cardGradient)"
              stroke="rgba(229,9,20,0.3)"
              strokeWidth="1"
            />
            <rect
              x="140"
              y="65"
              width="50"
              height="18"
              rx="9"
              fill="url(#cardGradient)"
              stroke="rgba(244,63,94,0.3)"
              strokeWidth="1"
            />
            <rect
              x="50"
              y="85"
              width="65"
              height="20"
              rx="10"
              fill="url(#cardGradient)"
              stroke="rgba(229,9,20,0.3)"
              strokeWidth="1"
            />

            {/* Floating Particles */}
            <circle cx="70" cy="30" r="2" fill="#FACC15" opacity="0.8">
              <animate attributeName="cy" values="30;25;30" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="180" cy="35" r="1.5" fill="#E50914" opacity="0.6">
              <animate attributeName="cy" values="35;30;35" dur="1.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="100" r="2" fill="#F43F5E" opacity="0.7">
              <animate attributeName="cy" values="100;95;100" dur="1.8s" repeatCount="indefinite" />
            </circle>

            {/* Connection Lines */}
            <path d="M100 55 L140 75" stroke="rgba(229,9,20,0.2)" strokeWidth="1.5" strokeDasharray="3,3">
              <animate attributeName="stroke-dashoffset" values="0;6" dur="1s" repeatCount="indefinite" />
            </path>
            <path d="M115 95 L150 83" stroke="rgba(244,63,94,0.2)" strokeWidth="1.5" strokeDasharray="3,3">
              <animate attributeName="stroke-dashoffset" values="0;6" dur="1.2s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>
      </div>

      {/* Features Grid - Compact */}
      <div className="grid grid-cols-2 gap-3">
        {features.map((feature, index) => {
          const Icon = feature.icon
          return (
            <div
              key={feature.title}
              className="backdrop-blur-md bg-white/6 border border-white/10 rounded-xl p-3 hover:bg-white/8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/10"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex flex-col items-center text-center space-y-1.5">
                <div className="w-8 h-8 bg-gradient-to-br from-[#E50914]/20 to-rose-600/20 rounded-lg flex items-center justify-center border border-red-500/20">
                  <Icon className="w-4 h-4 text-[#E50914]" />
                </div>
                <h3 className="font-semibold text-gray-100 text-xs">{feature.title}</h3>
                <p className="text-xs text-gray-400 leading-tight">{feature.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
