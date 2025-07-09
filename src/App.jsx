
import './App.css'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { useEffect } from 'react'

//pages
import Home from './pages/Home'
import AuthPage from './pages/AuthPage'
import { Toaster } from 'react-hot-toast'
import Rooms from './pages/Rooms'
import ProtectedRoute from './components/ProtectedRoute'
import VideoChat from './pages/VideoChat'

import { getToken, onMessage } from 'firebase/messaging';
import { messaging } from './FireBase';
import { SaveFCMToken } from './services/user.svc'


function App() {


  const vapidKey = import.meta.env.VITE_vapidKey;

  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'denied') {
        console.error('Notification permission denied');
        return;
      }
      if (permission === 'granted') {
        getToken(messaging, { vapidKey }).then(async (token) => {
          try {
            await SaveFCMToken(token);
          } catch (error) {
            console.error('Error saving FCM token:', error);
          }
        }).catch((error) => {
          console.error('Error getting token:', error);
        });
      }
    });

    onMessage(messaging, (payload) => {
      console.log('Foreground message:', payload);
    });
  }, []);



  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: 'text-sm',
          style: {
            background: '#1a1a1a',
            color: '#fff',
            borderRadius: '8px',
            padding: '10px',
          },
          success: {
            duration: 3000,
            style: {
              background: '#4caf50',
            },
          },
          error: {
            duration: 3000,
            style: {
              background: '#f44336',

            },
          },
          loading: {
            duration: 3000,
            style: {
              background: '#2196f3',
            },
          },
        }}
      />

      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />
          {/* Add more routes as needed */}
          <Route path="/home" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/rooms" element={
            <ProtectedRoute>
              <Rooms />
            </ProtectedRoute>
          } />

          <Route path="/videochat" element={<VideoChat />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
