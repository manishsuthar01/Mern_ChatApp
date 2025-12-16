# 💬 Chat App (Full Stack MERN)

A real-time full‑stack chat application built using **React, Node.js, Express, MongoDB, Socket.IO, and Zustand**. This project focuses on real‑world concepts like authentication, real‑time messaging, global state management, and production‑ready frontend + backend integration.

---

## 🚀 Features

* 🔐 User Authentication (Signup / Login)
* 💬 Real‑time Messaging using Socket.IO
* 👥 One‑to‑One Chat Support
* 🟢 Online / Offline User Status
* 🌐 Global State Management with Zustand
* 📦 MongoDB for Data Persistence
* ⚡ Modern React Frontend (Vite)
* 📁 Production‑ready build with Express serving frontend

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Zustand (Global State)
* CSS / Modern UI

### Backend

* Node.js
* Express.js
* MongoDB + Mongoose
* Socket.IO
* JWT Authentication

---

## 📂 Project Structure

```
ChatAPP/
│
├── back_end/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── socket/
│
├── frontend/
│   ├── src/
│   ├── dist/          # Production build
│   ├── vite.config.js
│   └── package.json
│
├── .env
├── package.json
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add:

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 🧑‍💻 Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/manishsuhtar01/chat_app.git
cd ChatAPP
```

---

### 2️⃣ Install Backend Dependencies

```bash
npm install
```

---

### 3️⃣ Install Frontend Dependencies

```bash
cd frontend
npm install
```

---

### 4️⃣ Build Frontend for Production

```bash
npm run build
```

This will create the `frontend/dist` folder.

---

### 5️⃣ Start the Server

```bash
npm start
```

Server will run at:

```
http://localhost:5000
```

---

## 🔄 Development Mode (Frontend Only)

```bash
cd frontend
npm run dev
```

---

## 📌 Important Notes

* Frontend is served statically by Express in production
* Build frontend **once**, start backend **multiple times**

---

## 📸 Screenshots
<img width="1662" height="914" alt="Screenshot 2025-12-16 154025" src="https://github.com/user-attachments/assets/6991b7f0-ad40-4306-93ce-5650d3d7b4ab" />

---


## 🎯 Learning Outcomes

* Real‑time communication with WebSockets
* Handling global state with Zustand
* Production‑level Express + React integration
* Debugging real deployment issues
* Proper project structure and Git workflow

---

## 🧠 Future Improvements

* Group chats
* Message seen status
* Typing indicators
* File sharing
* Notifications

---

## 👨‍💻 Author

**Manish Suthar**
B.Tech CSE | Frontend & Full‑Stack Developer

---

## ⭐ Support

If you like this project, give it a ⭐ on GitHub!
