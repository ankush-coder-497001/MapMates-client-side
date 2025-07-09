import { useState, useEffect, useRef } from "react"
import {
  MessageCircle,
  Users,
  Shield,
  Zap,
  Hash,
  Crown,
  ChevronLeft,
  ChevronRight,
  Star,
  Search,
  Sparkles,
  TrendingUp,
  Palette,
  Play,
  Video,
  LucideMessageCircleQuestionMark,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { getMyRooms } from "../services/user.svc"
import { useSocket } from "../socketContext"

export default function Rooms() {
  const [searchQuery, setSearchQuery] = useState("")
  const [animatedElements, setAnimatedElements] = useState([])
  const scrollContainerRef = useRef(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate()
  const socket = useSocket();

  const getGradiant = (index) => {
    const gradients = [
      "from-yellow-500/30 to-orange-500/30",
      "from-blue-500/30 to-cyan-500/30",
      "from-purple-500/30 to-pink-500/30",
      "from-amber-500/30 to-yellow-500/30",
      "from-red-500/30 to-rose-500/30",
      "from-orange-500/30 to-red-500/30",
      "from-cyan-500/30 to-blue-500/30",
      "from-emerald-500/30 to-green-500/30",
      "from-green-500/30 to-emerald-500/30",
      "from-indigo-500/30 to-purple-500/30"
    ]
    return gradients[index % gradients.length]
  }

  const [userRooms, setUserRooms] = useState([])


  const handleMyRoomsJoin = (roomName) => {

    socket.current.emit('joinMyRooms', {
      roomId: roomName,
    }, (res) => {
      if (res.success) {
        navigate("/home")
      } else {
        console.error("Failed to join room:", res.message)
      }
    })

  }
  const fetchUserRooms = async () => {
    setIsLoading(true);
    try {
      const res = await getMyRooms();
      const mappedRooms = res.rooms.map((room, index) => ({
        id: index + 1,
        name: room.name,
        members: room.member,
        active: room.active,
        lastMessage: room.lastMessage,
        online: room.online,
        role: room.role,
        avatar: room.avatar,
        category: room.category,
        gradient: getGradiant(index),
        description: room.description,
      }))
      setUserRooms(mappedRooms)
    } catch (error) {
      console.error("Error fetching user rooms:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUserRooms()
  }, [])

  useEffect(() => {
    const elements = [...Array(20)].map((_, i) => i)
    elements.forEach((_, index) => {
      setTimeout(() => {
        setAnimatedElements((prev) => [...prev, index])
      }, index * 100)
    })
  }, [])

  // Check scroll position
  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollPosition)
      checkScrollPosition() // Initial check
      return () => container.removeEventListener("scroll", checkScrollPosition)
    }
  }, [])

  // Filter rooms based on search
  const filteredRooms = userRooms.filter((room) => room.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -350, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 350, behavior: "smooth" })
    }
  }

  const getRoleIcon = (role) => {
    switch (role) {
      case "admin":
        return <Crown className="w-4 h-4 text-yellow-400" />
      case "moderator":
        return <Shield className="w-4 h-4 text-blue-400" />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
      {/* Enhanced Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fillRule=%22evenodd%22%3E%3Cg fill=%22%23F3F4F6%22 fillOpacity=%220.03%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%221.5%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-gray-900/60 to-[#0F0F0F] opacity-90"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-[#E50914]/8 to-rose-600/8 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-[#FACC15]/8 to-yellow-500/8 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        {/* Netflix-Style Header */}
        <div className="flex items-center justify-between p-6 lg:p-8">
          {/* Logo - Top Right (Netflix Style) */}
          <div
            className={`transition-all duration-700 delay-100 ${animatedElements.includes(1) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-[#E50914] to-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-red-500/30 relative">
                <MessageCircle className="w-6 h-6 text-white" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#FACC15] rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-black" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-gradient-netflix">MapMates</h1>
            </div>

          </div>



        </div>

        {/* Hero Text - Center */}
        <div
          className={`text-center px-6 mb-8 transition-all duration-700 delay-200 ${animatedElements.includes(2) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
        >
          <h2 className="text-4xl lg:text-6xl font-bold text-gray-100 mb-4">
            Where Conversations
            <span className="text-gradient-netflix"> Come Alive</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Experience the future of communication with our premium glassmorphism chat platform
          </p>
        </div>

        {/* Search Bar */}
        <div
          className={`w-full max-w-6xl flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4 mx-auto px-4 mb-12 transition-all duration-700 delay-300 ${animatedElements.includes(3)
            ? "translate-y-0 opacity-100"
            : "translate-y-8 opacity-0"
            }`}
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute z-10 left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms and conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-base sm:text-lg backdrop-blur-md bg-white/6 border border-white/20 rounded-3xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E50914]/50 focus:border-[#E50914]/50 transition-all duration-300 shadow-2xl"
            />
          </div>

          {/* Join Button */}
          <Link to="/home" className="sm:w-auto w-full mt-2 sm:mt-0  ">
            <button className="w-full sm:w-auto px-6 py-3 sm:py-4 text-sm sm:text-lg font-semibold text-white bg-[#E50914] rounded-3xl shadow-md hover:bg-[#E50914]/80 transition-all duration-300 cursor-pointer ">
              <MessageCircle className="inline-block w-4 h-4 ml-2" /> Join Your City's Chat Room
            </button>
          </Link>
        </div>


        {/* Rooms Section - Positioned Higher */}
        <div className="px-6 lg:px-8 mb-16">
          <div
            className={`transition-all duration-700 delay-400 ${animatedElements.includes(4) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold text-gray-100 flex items-center space-x-3">
                  <Hash className="w-6 lg:w-8 h-6 lg:h-8 text-[#E50914]" />
                  <span>Your Rooms</span>

                </h3>
                <p className="text-gray-400 text-sm lg:text-lg mt-2">{filteredRooms.length} active conversations</p>
              </div>

              {/* Desktop Navigation Arrows */}
              <div className="hidden lg:flex items-center space-x-3">
                <button
                  onClick={scrollLeft}
                  disabled={!canScrollLeft}
                  className={`p-3 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 hover:scale-110 group ${canScrollLeft ? "bg-white/6 hover:bg-white/10" : "bg-white/3 opacity-50 cursor-not-allowed"
                    }`}
                >
                  <ChevronLeft
                    className={`w-6 h-6 ${canScrollLeft ? "text-gray-300 group-hover:text-white" : "text-gray-600"}`}
                  />
                </button>
                <button
                  onClick={scrollRight}
                  disabled={!canScrollRight}
                  className={`p-3 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-300 hover:scale-110 group ${canScrollRight ? "bg-white/6 hover:bg-white/10" : "bg-white/3 opacity-50 cursor-not-allowed"
                    }`}
                >
                  <ChevronRight
                    className={`w-6 h-6 ${canScrollRight ? "text-gray-300 group-hover:text-white" : "text-gray-600"}`}
                  />
                </button>
              </div>
            </div>

            {/* Horizontal Scrolling Room Cards */}
            <div className="relative">
              {/* Mobile Navigation Arrows */}
              {canScrollLeft && (
                <button
                  onClick={scrollLeft}
                  className="lg:hidden absolute left-2 top-1/2 transform -translate-y-1/2 z-20 p-2 backdrop-blur-md bg-black/50 border border-white/20 rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
              )}

              {canScrollRight && (
                <button
                  onClick={scrollRight}
                  className="lg:hidden absolute right-2 top-1/2 transform -translate-y-1/2 z-20 p-2 backdrop-blur-md bg-black/50 border border-white/20 rounded-full hover:bg-black/70 transition-all duration-300"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              )}

              <div
                ref={scrollContainerRef}
                className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {filteredRooms.length > 0 ? filteredRooms.map((room, index) => (
                  <Link
                    key={room.id}
                    onClick={() => {
                      navigate("/home", {
                        state: { myRoomId: room.name }
                      })
                    }}
                    className={`
                      flex-shrink-0 w-80 backdrop-blur-md bg-gradient-to-br ${room.gradient} border border-white/20 rounded-3xl p-6 hover:scale-105 transition-all duration-500 hover:shadow-2xl hover:shadow-black/30 group relative overflow-hidden
                      ${animatedElements.includes(index + 5) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
                    `}
                    style={{ transitionDelay: `${(index + 5) * 100}ms` }}
                  >
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Card Content */}
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center text-2xl border border-white/20 group-hover:scale-110 transition-transform duration-300">
                            {room.avatar}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="text-xl font-bold text-white">{room.name}</h4>
                              {getRoleIcon(room.role)}
                            </div>
                            <p className="text-sm text-gray-300">{room.category}</p>
                          </div>
                        </div>
                        {room.active && (
                          <div className="w-3 h-3 bg-[#FACC15] rounded-full animate-pulse shadow-lg shadow-yellow-400/50"></div>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-gray-200 text-sm leading-relaxed mb-4">{room.description}</p>

                      {/* Last Message */}
                      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-3 mb-4">
                        <p className="text-sm text-gray-300 italic">"{room.lastMessage}"</p>
                        <p className="text-xs text-gray-400 mt-1">{room.lastActivity}</p>
                      </div>

                      {/* Stats and Join Button */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-300">{room.members}</span>
                          </div>
                          {room.online > 0 && (
                            <div className="flex items-center space-x-1">
                              <div className="w-2 h-2 bg-[#E50914] rounded-full animate-pulse"></div>
                              <span className="text-sm text-[#E50914] font-semibold">{room.online} new</span>
                            </div>
                          )}
                        </div>
                        <Link onClick={() => handleMyRoomsJoin(room.name)} className="flex items-center space-x-2 bg-gradient-to-r from-[#E50914] to-rose-600 text-white px-4 py-2 rounded-xl hover:from-rose-600 hover:to-[#F43F5E] transition-all duration-300 hover:scale-105 shadow-lg group-hover:shadow-red-500/30 cursor-pointer ">
                          <Play className="w-4 h-4" />
                          <span className="font-semibold">Join</span>
                        </Link>
                      </div>
                    </div>
                  </Link>
                )) : (
                  <div className="w-full text-center text-gray-400 py-12">
                    {isLoading ? (
                      <p>Loading rooms...</p>
                    ) : (
                      //  add that button for joining local room
                      <Link to="/home" className="text-[#E50914] hover:underline">
                        <p>No rooms found. <span className="font-semibold">Join your city's chat
                          room now!</span></p>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="px-6 lg:px-8 pb-16">
          <div
            className={`transition-all duration-700 delay-700 ${animatedElements.includes(16) ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              }`}
          >
            <h3 className="text-2xl lg:text-3xl font-bold text-gray-100 text-center mb-8 flex items-center justify-center space-x-3">
              <Star className="w-6 lg:w-8 h-6 lg:h-8 text-[#FACC15]" />
              <span>Premium Features</span>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Shield,
                  title: "Military-Grade Security",
                  desc: "End-to-end encryption with zero-knowledge architecture",
                  color: "text-green-400",
                  bg: "from-green-500/20 to-emerald-500/20",
                },
                {
                  icon: Zap,
                  title: "Lightning Performance",
                  desc: "Sub-100ms message delivery with global CDN",
                  color: "text-yellow-400",
                  bg: "from-yellow-500/20 to-orange-500/20",
                },
                {
                  icon: Palette,
                  title: "Glassmorphism UI",
                  desc: "Beautiful, modern interface with smooth animations",
                  color: "text-purple-400",
                  bg: "from-purple-500/20 to-pink-500/20",
                },
                {
                  icon: TrendingUp,
                  title: "Smart Analytics",
                  desc: "Real-time insights and engagement metrics",
                  color: "text-blue-400",
                  bg: "from-blue-500/20 to-cyan-500/20",
                },
              ].map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={feature.title}
                    className={`backdrop-blur-md bg-gradient-to-br ${feature.bg} border border-white/10 rounded-2xl p-6 hover:scale-105 transition-all duration-300 group text-center`}
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20 group-hover:scale-110 transition-transform duration-300">
                      <Icon className={`w-8 h-8 ${feature.color}`} />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{feature.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
