import { useState, useEffect, useRef } from "react"
import { SkipBackIcon as Skip, Users, Mic, MicOff, Video, VideoOff } from "lucide-react"
import { Button } from "../components/Button"
import { useLocation, useNavigate } from "react-router-dom"
import { useSocket } from "../socketContext"

export default function VideoChat() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const navigate = useNavigate()
  const socket = useSocket()

  const peer = useRef(null);
  const localStream = useRef(null);
  const remoteVideo = useRef(null);
  const localVideo = useRef(null);


  const createPeer = async (initiator = false) => {
    peer.current = new RTCPeerConnection();
    localStream.current.getTracks().forEach((track) => {
      peer.current.addTrack(track, localStream.current);
    })

    peer.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit('ice-candidate', event.candidate);
      }
    }

    peer.current.ontrack = (event) => {
      remoteVideo.current.srcObject = event.stream[0];
    }

    if (initiator) {
      const offer = await peer.current.createOffer();
      await peer.current.setLocalDescription(offer);
      socket.current.emit('offer', offer);
    }
  };

  const startVideo = async () => {
    localStream.current = await navigator.mediaDevices.getUserMedia({ video: !isVideoOff, audio: !isMuted })
    localVideo.current.srcObject = localStream.current;
  }

  const cleanup = () => {
    if (!socket.current) return;
    if (peer.current) peer.current.close();
    if (localStream.current) localStream.current.getTracks().forEach((t) => t.stop());
    if (remoteVideo.current) remoteVideo.current.srcObject = null;
    if (localVideo.current) localVideo.current.srcObject = null;
    peer.current = null;
    localStream.current = null
  }

  useEffect(() => {

    if (!socket.current) {
      return;
    }

    socket.current.on('waitingForPartner', () => {
      setIsLoading(true);
      setIsConnected(false);
      setLoadingProgress(0);
    })

    socket.current.emit('joinQueue');


    socket.current.on('partnerFound', async () => {
      await startVideo();
      await createPeer(true);
      setIsConnected(true);
      setIsLoading(false);
    })

    socket.current.on('offer', async (offer) => {
      await startVideo();
      await createPeer(false);
      await peer.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peer.current.createAnswer();
      await peer.current.setLocalDescription(answer);
      socket.current.emit('answer', answer);
      setIsConnected(true);
      setIsLoading(false);
    })

    socket.current.on('answer', async (answer) => {
      await peer.current.setRemoteDescription(new RTCSessionDescription(answer));
    })

    socket.current.on('ice-candidate', async (candidate) => {
      if (peer.current) {
        await peer.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    })

    socket.current.on('partnerLeft', () => {
      cleanup();
      setIsConnected(false);
      setIsLoading(false);
      setLoadingProgress(0);
      socket.current.emit('joinQueue');
    })

    return () => {
      cleanup();
      socket.current.off('partnerFound');
      socket.current.off('offer');
      socket.current.off('answer');
      socket.current.off('ice-candidate');
      socket.current.off('partnerLeft');
    }

  }, [])





  // Skip to next person
  const skipPartner = () => {
    socket.current.emit('leave')
    cleanup();
    setIsConnected(false);
    setIsLoading(true);
    socket.current.emit('joinQueue');
  }

  useEffect(() => {
    let progressInterval;
    if (isLoading) {
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          const next = prev + Math.random() * 10;
          if (next >= 100) clearInterval(progressInterval);
          return next >= 100 ? 100 : next;
        });
      }, 300);
    }
    return () => clearInterval(progressInterval);
  }, [isLoading]);


  return (
    <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
      {/* Main Video Area - Two Windows Side by Side */}
      <div className="flex flex-col md:flex-row p-4 gap-4 h-[60vh] md:h-[70vh]">
        {/* User Video Window - Left Side */}
        <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden relative max-h-[22vh] md:max-h-[60vh]">
          <video ref={localVideo} className="w-full h-full object-cover local-video " autoPlay muted poster="/placeholder.svg?height=400&width=300">
            <source src="/placeholder-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full text-sm font-medium">You</div>
          {isVideoOff && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        {/* Partner Video Window - Right Side */}
        <div className="flex-1 bg-gray-900 rounded-lg overflow-hidden relative max-h-[22vh] md:max-h-[60vh]">
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-red-950/40 via-gray-900 to-black">
              <div className="text-center max-w-xs">
                {/* Professional Loading Animation */}
                <div className="relative w-24 h-24 mx-auto mb-8">
                  {/* Outer Ring */}
                  <div className="absolute inset-0 border-4 border-gray-700 rounded-full"></div>
                  {/* Progress Ring */}
                  <div
                    className="absolute inset-0 border-4 border-red-600 rounded-full border-t-transparent transition-all duration-300 ease-out"
                    style={{
                      transform: `rotate(${(loadingProgress / 100) * 360}deg)`,
                    }}
                  ></div>
                  {/* Inner Pulse */}
                  <div className="absolute inset-3 bg-red-600/20 rounded-full animate-pulse"></div>
                  {/* Center Dot */}
                  <div className="absolute inset-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full"></div>
                </div>

                {/* Loading Text */}
                <div className="space-y-3">
                  <div className="text-lg font-semibold text-white">Connecting...</div>
                  <div className="text-red-400 text-sm">Finding your perfect match</div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300 ease-out"
                      style={{ width: `${Math.min(loadingProgress, 100)}%` }}
                    ></div>
                  </div>

                  {/* Loading Percentage */}
                  <div className="text-xs text-gray-400">{Math.round(Math.min(loadingProgress, 100))}% Complete</div>
                </div>
              </div>
            </div>
          ) : isConnected ? (
            <div className="relative w-full h-full">
              <video
                ref={remoteVideo}
                className="w-full h-full object-cover remote-video "
                autoPlay
                muted
                poster="/placeholder.svg?height=400&width=300"
              >
                <source src="/placeholder-video.mp4" type="video/mp4" />
              </video>
              <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-full text-sm font-medium">
                Partner
              </div>
              <div className="absolute top-4 right-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-gray-400">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <div className="text-lg">No connection</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Control Panel - Below Videos */}
      <div className="p-8 bg-gray-900/50 backdrop-blur-sm">
        {/* Main Action Buttons */}
        <div className="flex justify-center space-x-6 mb-6">
          <Button
            onClick={skipPartner}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-full font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <Skip className="w-6 h-6 mr-3" />
            {isLoading ? "Finding..." : "Skip"}
          </Button>

          <Button
            onClick={() => {
              cleanup();
              setIsConnected(false);
              navigate('/rooms');
            }}
            variant="outline"
            className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-4 rounded-full font-semibold shadow-lg transform transition-all duration-200 hover:scale-105 bg-transparent text-lg"
          >
            <Users className="w-6 h-6 mr-3" />
            Rooms
          </Button>
        </div>

        {/* Media Controls */}
        <div className="flex justify-center space-x-4 mb-4">
          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsMuted(!isMuted)}
            className={`rounded-full p-4 ${isMuted ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
          >
            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
          </Button>

          <Button
            variant="ghost"
            size="lg"
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`rounded-full p-4 ${isVideoOff ? "bg-red-600 text-white hover:bg-red-700" : "bg-gray-700 text-white hover:bg-gray-600"
              }`}
          >
            {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
          </Button>
        </div>

        {/* Connection Status */}
        <div className="text-center text-sm">
          {isLoading ? (
            <span className="text-yellow-400">🔍 Searching for connections...</span>
          ) : isConnected ? (
            <span className="text-green-400">🟢 Connected - Enjoy your chat!</span>
          ) : (
            <span className="text-gray-400">⚪ Disconnected</span>
          )}
        </div>
      </div>
    </div>
  )
}
