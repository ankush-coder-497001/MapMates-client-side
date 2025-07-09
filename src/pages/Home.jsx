import { useState, useRef, useEffect, useCallback, use } from "react"
import TopBar from "../components/TopBar"
import Sidebar from "../components/Sidebar"
import ChatPanel from "../components/ChatPanel"
import InputPanel from "../components/InputPanel"
import Footer from "../components/Footer"
import MobileActions from "../components/MobileActions"
import { getLocationName, getSmartLocation } from '../services/location.svc'
import { chatHistory, getMemberList, GetUserProfile, SaveLocation, UpdateUserProfile } from "../services/user.svc"
import toast from 'react-hot-toast'
import Loader from "../components/Loader"
import ProfileModal from "../components/ProfileModel"
import { useLocation, useNavigate } from "react-router-dom"
import { useSocket } from "../socketContext"
export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);
  const messagesEndRef = useRef(null)
  const user = JSON.parse(localStorage.getItem("chat_user")) || {}
  const token = localStorage.getItem("chat_token") || null
  const socket = useSocket(token);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [coordinates, setCoordinates] = useState({ lat: null, lng: null })
  const [location, setLocation] = useState('')
  const [locationError, setLocationError] = useState('')
  const [isCity, setIsCity] = useState(false);
  const [userProfile, setUserProfile] = useState({});
  const navigate = useNavigate();
  const [Typing, setTyping] = useState({})
  // Cursor for pagination
  const [chatCursor, setChatCursor] = useState(null);
  const [hasMoreChats, setHasMoreChats] = useState(true);

  const handleJoinRoom = useCallback((data) => {
    const { roomId, isCity, coordinates } = data;
    socket.current.emit('joinRoom', {
      isCity,
      coordinates,
      roomId
    })
  }, [])
  const handleGetLocation = async () => {
    if (coordinates.lat && coordinates.lng) {
      return;
    }
    setLoading(true);
    setLocationError('');
    try {
      const { latitude, longitude } = await getSmartLocation();
      setCoordinates({ lat: latitude, lng: longitude });
      const { name, isCityName } = await getLocationName(latitude, longitude);
      setLocation(name);
      setIsCity(isCityName);
      const payload = isCityName
        ? {
          city: name,
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        }
        : {
          city: 'Rural Area',
          location: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
        }

      await SaveLocation(payload);
      handleJoinRoom({
        roomId: name,
        isCity: isCityName,
        coordinates: [longitude, latitude],
      })

      // fetchChatHistory(name);
    } catch (error) {
      let errorMessage = 'Unable to get your location. ';

      switch (error.code) {
        case 1:
          errorMessage += 'Please allow location access in your browser settings.';
          break;
        case 2:
          errorMessage += 'Location service is unavailable at the moment.';
          break;
        case 3:
          errorMessage += 'Location request timed out.';
          break;
        default:
          errorMessage += error.message || 'Unknown error occurred.';
      }

      setLocationError(errorMessage);
      console.error('Location error:', error);
    } finally {
      setLoading(false);

    }
  };

  // Cursor for pagination

  const fetchChatHistory = async (roomId, options = {}) => {
    setLoading(true);
    try {
      // Use cursor-based pagination
      const res = await chatHistory(roomId, { before: options.before || chatCursor, limit: options.limit || 50 });
      const mappedChatHistory = res.messages.map((message) => ({
        id: message._id,
        sender: message.sender && message.sender.name || `${roomId}'s`,
        senderId: message.sender && message.sender._id || null,
        content: message.content || "room created have fun",
        time: new Date(message.createdAt).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", hour12: true }),
        isOwn: message.sender && message.sender._id === user.id,
        avatar: message.sender && message.sender.profilePic || "/placeholder.svg?height=40&width=40",
        isAnnouncement: message.isAnnouncement || message.sender ? false : true,
        announcementType: message.announcementType || message.sender ? null : "joined",
      }));
      if (options.append) {
        setMessages((prev) => [...mappedChatHistory, ...prev]);
      } else {
        setMessages(mappedChatHistory);
      }
      setHasMoreChats(res.hasMore);
      setChatCursor(res.nextCursor);
    } catch (error) {
      toast.error(`Error fetching chat history: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  }

  const fetchMemberList = async (roomId) => {
    try {
      const res = await getMemberList(roomId);
      setMemberList(res.members);
    } catch (error) {
      console.error('Error fetching member list:', error);
    }
  }

  const fetchUserProfile = async () => {
    try {
      const res = await GetUserProfile();
      setUserProfile(res.user);
    } catch (error) {
      console.error(error.message)
    }
  }

  const handleLeave = useCallback(() => {

    if (!socket?.current) {
      console.warn("🚫 socket.current is undefined!");
      toast.error("Socket not connected");
      return;
    }

    if (!selectedRoom) {
      console.warn("🚫 No room selected");
      toast.error("No room selected");
      return;
    }


    socket.current.emit('leaveRoom', { roomId: selectedRoom }, (response) => {
      console.log("📥 Received response from server:", response);

      if (response.error) {
        toast.error(`Error leaving room: ${response.error}`);
      } else {
        setSelectedRoom(null);
        setMessages([]);
        setMemberList([]);
        setOnlineCount(0);
        navigate("/rooms");
        toast.success("You have left the room");
      }
    });
  }, [socket, selectedRoom, navigate]);



  const handleUpdateProfile = async (updatedData) => {
    setLoading(true);
    try {
      const res = await UpdateUserProfile(updatedData);
      toast.success(res.message);
    } catch (error) {
      toast.error(error.message);
      console.error("Error updating profile:", error);
    } finally {
      setLoading(false);
      fetchUserProfile();
    }
  }

  const handleOnUserJoined = useCallback((data) => {
    const newMessage = {
      id: data.socketId, // Use socketId as a unique ID
      sender: data.userName,
      content: "joined the room",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isAnnouncement: true,
      announcementType: "joined",
    }
    setMessages((prev) => [...prev, newMessage])
  }, [])


  useEffect(() => {
    if (!socket.current) return;

    socket.current.on('roomInfo', (data) => {
      setSelectedRoom(data.roomId);
      setOnlineCount(data.online);
      fetchChatHistory(data.roomId);
      fetchMemberList(data.roomId);
      const userId = data.userId;
      //lets find the user in memberlist and update the status to online 
      setMemberList((prev) => {
        const updatedMembers = prev.map(member => {
          if (member._id === userId) {
            return { ...member, isOnline: true };
          }
          return member;
        });
        return updatedMembers;
      });
    })

    socket.current.on('userJoined', handleOnUserJoined)

    socket.current.on('roomJoined', () => {
      toast.success(`Welcome to the room!`);
    })

    socket.current.on('userOffline', (data) => {
      console.log("User Offline:", data);
      setOnlineCount(data.online);
      setMemberList((prev) => {
        return prev.map(member => {
          if (member._id === data.userId) {
            return { ...member, isOnline: false };
          }
          return member;
        });
      });
    })

    socket.current.on('message', (message) => {
      console.log("New Message:", message);
      const newMessage = {
        id: message._id, // Ensure unique ID
        sender: message.sender.name || "Unknown",
        senderId: message.sender._id || null,
        content: message.content,
        time: new Date(message.createdAt).toLocaleTimeString('en-US', { hour: "2-digit", minute: "2-digit", hour12Hour: true }),
        isOwn: message.sender._id === user.id,
        avatar: message.avatar || user.profilePic || "/placeholder.svg?height=40&width=40",
        isAnnouncement: message.isAnnouncement || false,
        announcementType: message.announcementType || null,
      }
      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    })

    socket.current.on('newMember', (member) => {
      setMemberList((prev) => [...prev, member]);
    })

    socket.current.on('UserTyping', (data) => {
      const refinedName = data.username.length > 10 ? `${data.username.slice(0, 10)}...` : data.username;
      setTyping({
        status: data.status,
        text: `${refinedName} is typing...`
      })
    })

    return () => {
      if (socket.current) {
        socket.current.off('roomInfo');
        socket.current.off('userJoined', handleOnUserJoined);
        socket.current.off('roomJoined');
        socket.current.off('userOffline');
        socket.current.off('message');
        socket.current.off('newMember');
        socket.current.off('UserTyping');
      }
    }

  }, [socket, userProfile])



  useEffect(() => {
    fetchUserProfile()
    handleGetLocation();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }



  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (content, tag = null) => {
    socket.current.emit('newMessage', {
      content,
      roomId: selectedRoom,
      tag,
    }, (response) => {
      if (response.error) {
        toast.error(`Error sending message: ${response.error}`);
      } else {
        console.log("Message sent successfully:", response);
      }
    })
  }


  return (
    <>
      {loading && <Loader message="Wait...." />}
      <div className="min-h-screen bg-[#0F0F0F] relative overflow-hidden">
        {/* Elegant background pattern */}
        <div
          className={`absolute inset-0 bg-[url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23F3F4F6' fillOpacity='0.02'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")] opacity-50`}
        ></div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F0F0F] via-gray-900/50 to-[#0F0F0F] opacity-80"></div>

        {/* Main Layout */}
        <div className="relative z-10 flex flex-col h-screen">
          <TopBar Typing={Typing} roomName={selectedRoom} onlineCount={onlineCount} members={memberList} onMenuClick={() => setIsSidebarOpen(true)} />

          <div className="flex flex-1 overflow-hidden min-h-0">

            <Sidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              user={userProfile}
              memberList={memberList}
              onProfileModel={() => setIsProfileOpen(true)}
            />

            <div className="flex-1 flex flex-col min-h-0 min-w-0">
              <ChatPanel
                messages={messages}
                messagesEndRef={messagesEndRef}
                hasMore={hasMoreChats}
                fetchMoreMessages={() => fetchChatHistory(selectedRoom, { append: true })}
                chatCursor={chatCursor}
                loading={loading}
              />
              <InputPanel onSendMessage={addMessage} roomId={selectedRoom} user={userProfile} memberList={memberList} />
            </div>
          </div>

          <Footer />

          <ProfileModal
            isOpen={isProfileOpen}
            onClose={() => setIsProfileOpen(false)}
            userProfile={userProfile}
            onUpdateProfile={handleUpdateProfile}
          />

        </div>

        {/* Mobile Actions */}
        <MobileActions
          onOpenSidebar={() => setIsSidebarOpen(true)}
          onOpenProfile={() => setIsProfileOpen(true)}
          onLeave={() => handleLeave()}
          user={userProfile}
          socket={socket}
        />
      </div>
    </>

  )
}
