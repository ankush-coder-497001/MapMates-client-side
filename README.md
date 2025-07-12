# 🌍 MapMates — Real-Time Location-Based Community Chatrooms

MapMates is a **Progressive Web App (PWA)** that automatically connects users to chatrooms based on their **city or nearby location**. It creates hyperlocal communication spaces powered by geolocation, where users can chat, repost, react with emojis, tag users, and stay updated with local alerts like **#help**, **#emergency**, and **#news**.

Live Site: [https://mapmates-io.netlify.app](https://mapmates-io.netlify.app)

---

## 🚀 Features

- 📍 **Smart Geo-Rooms**  
  Automatically joins users to their city-based chatroom. If no exact city room exists, the app finds nearby rooms within a 25km radius — or creates a new one.

- 🧑‍🤝‍🧑 **Live Members Display**  
  Shows online members in each city room.

- 👤 **User Profiles**  
  Customizable profiles with name, bio, and more.

- 🔁 **Repost System**  
  Re-share content inside rooms to bring more attention to posts.

- 🏷️ **Tagging System**  
  Tag users with @username and categorize messages with special tags like `#help`, `#news`, `#emergency`.

- 😄 **Emoji Reactions**  
  React to messages with emojis for quick feedback.

- 📲 **PWA Support**  
  Install the app on any device — with offline support.

- 🔔 **Push Notifications**  
  Stay updated with new messages and alerts even when you're not on the app.

- 🌐 **Real-time Messaging**  
  Built using **Socket.io** for instant communication.

---

## 🧑‍💻 Tech Stack

| Frontend    | Backend           | Realtime | Features       |
|-------------|------------------|----------|----------------|
| React + Vite | Node.js + Express | Socket.io | PWA, Geolocation, Push Notifications |

> This repository contains only the **client-side (frontend)** of the application.  
> Backend: [MapMates-server-side](https://github.com/ankush-coder-497001/MapMates-server-side)

---

## 📦 Installation

### 1. Clone the repository
git clone https://github.com/ankush-coder-497001/MapMates-client-side.git
cd MapMates-client-side/client
### 2. Install dependencies
npm install
### 3. Set environment variables
Create a .env file inside /client folder:

### env

VITE_SERVER_URL=https://your-server-url.com
VITE_FIREBASE_API_KEY=your_firebase_key
