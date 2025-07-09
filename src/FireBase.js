// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyBa8KvOUlyiE91Odt7l9b-aVeFOEr99abM",
  authDomain: "citycycle-fbdff.firebaseapp.com",
  projectId: "citycycle-fbdff",
  storageBucket: "citycycle-fbdff.firebasestorage.app",
  messagingSenderId: "793510424913",
  appId: "1:793510424913:web:4450ec870e7a05b8e86370",
  measurementId: "G-0NFVZC9ZVB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const messaging = getMessaging(app);

export { auth, provider, messaging };