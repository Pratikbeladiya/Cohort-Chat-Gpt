# 🤖 AI Chatbot — Generative AI Web Application

A full-stack **Generative AI Chatbot** built with modern web technologies.

This project combines **AI-powered conversations, user authentication, real-time communication, MongoDB, Socket.IO, and vector database-based long-term memory** into a complete web application.

The application allows users to register/login, create chats, communicate with the AI in real time, and maintain long-term conversational memory using vector embeddings.

---

## 🚀 Features

### 🔐 Authentication

- User Registration
- User Login
- User Logout
- JWT-based authentication
- Protected routes
- Authentication middleware
- Secure user identification through `req.user`

### 💬 Chat System

- Create a new chat
- User-specific chats
- Chat history
- Chat input interface
- AI-generated responses
- Real-time message communication
- Socket.IO integration

### 🤖 Generative AI

- AI integrated into the web application
- User messages are processed by the AI
- AI-generated responses are returned to the user
- Conversational interaction through the chat interface

### 🧠 Long-Term AI Memory

The application uses a **vector database** to store and retrieve relevant conversation memories.

This allows the AI application to:

- Store important conversational information
- Convert information into vector embeddings
- Store embeddings in a vector database
- Retrieve semantically relevant memories
- Provide retrieved memories as context to the AI
- Maintain useful information across conversations

### ⚡ Real-Time Communication

Implemented **Socket.IO** for real-time communication between the client and server.

The Socket.IO connection is used to support:

- Real-time chat communication
- Sending messages
- Receiving AI responses
- Persistent socket connection
- Event-based communication

### 🗄️ Database

MongoDB is used as the primary application database.

The server connects to MongoDB and manages application data such as:

- Users
- Chats
- Messages
- Authentication-related information

### 🎨 User Interface

The client provides a modern chatbot interface including:

- Login page
- Registration page
- Chat interface
- Chat input
- Create chat functionality
- Logout functionality
- User-specific chat experience

---

# 🏗️ Project Architecture

The project is divided into two major parts:

```text
AI-CHATBOT/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
├── server/
│   ├── controllers/
│   ├── middleware/
│   ├── model/
│   ├── routes/
│   ├── services/
│   ├── app.js
│   ├── server.js
│   ├── db.js
│   └── package.json
│
├── .gitignore
└── README.md