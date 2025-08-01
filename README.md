# Real-Time Chat Application

A modern, full-stack real-time chat application built with React, Node.js, Socket.io, and MySQL. Features include real-time messaging, typing indicators, file attachments, online status, and read receipts.

## 🚀 Features

### Core Features
- ✅ **Real-time Messaging** - Instant message delivery using WebSockets
- ✅ **User Authentication** - JWT-based login and registration system
- ✅ **User Management** - User list with selection and profile display
- ✅ **Message History** - Persistent message storage in MySQL database

### Real-Time Features
- ✅ **Typing Indicators** - Shows when someone is typing
- ✅ **Online/Offline Status** - Green dot indicators on user avatars
- ✅ **Message Read Receipts** - ✓ for sent, ✓✓ for read messages
- ✅ **Real-time User Presence** - Updates when users connect/disconnect

### Advanced Features
- ✅ **File Attachments** - Support for images, PDFs, documents, and text files
- ✅ **Message Timestamps** - Shows when messages were sent
- ✅ **Responsive Design** - Works on desktop and mobile devices
- ✅ **Modern UI** - Clean, professional interface with TailwindCSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API calls
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional communication
- **MySQL** - Relational database
- **JWT** - JSON Web Token authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
chat-app/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── Components/     # Reusable UI components
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatHeader.jsx
│   │   │   ├── MessageList.jsx
│   │   │   └── MessageInput.jsx
│   │   ├── Pages/         # Page components
│   │   │   ├── ChatPage.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── context/       # React context
│   │   │   └── AuthContext.jsx
│   │   └── socket.js      # Socket.io client configuration
│   └── package.json
├── server/                 # Backend Node.js application
│   ├── controllers/       # Business logic
│   │   └── authController.js
│   ├── middleware/        # Express middleware
│   │   └── authMiddleware.js
│   ├── models/           # Database models
│   │   ├── db.js
│   │   ├── userModel.js
│   │   └── messageModel.js
│   ├── routes/           # API routes
│   │   ├── auth.js
│   │   ├── user.js
│   │   └── message.js
│   ├── server.js         # Main server file
│   └── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MySQL database
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone <repository-url>
cd chat-app
```

### 2. Database Setup
Create a MySQL database and update the `.env` file in the server directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=chat_app
PORT=5000
JWT_SECRET=your-secret-key-change-this-in-production
```

### 3. Install Dependencies

#### Backend
```bash
cd server
npm install
```

#### Frontend
```bash
cd client
npm install
```

### 4. Start the Application

#### Start Backend Server
```bash
cd server
npm start
# or
node server.js
```

#### Start Frontend Development Server
```bash
cd client
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📖 Usage Guide

### Authentication
1. **Register** - Create a new account with name, email, and password
2. **Login** - Sign in with your email and password
3. **Auto-login** - JWT tokens are stored locally for persistent sessions

### Chatting
1. **Select User** - Click on a user from the sidebar to start chatting
2. **Send Messages** - Type your message and press Enter or click Send
3. **File Attachments** - Click the 📎 button to attach files
4. **Real-time Features** - See typing indicators, online status, and read receipts

### Features in Action
- **Typing Indicator**: Start typing to see "X is typing..." in other windows
- **Online Status**: Green dots show who's currently online
- **Read Receipts**: Messages show ✓ when sent, ✓✓ when read
- **File Sharing**: Attach and share files with other users

## 🔧 API Endpoints

### Authentication
- `POST /api/signup` - User registration
- `POST /api/login` - User login

### Users
- `GET /api/users` - Get all users (except current user)

### Messages
- `GET /api/messages/:userId` - Get messages between current user and specified user
- `POST /api/messages` - Send a new message

### Socket Events
- `join` - Join user's personal room
- `send_message` - Send a message
- `receive_message` - Receive a message
- `typing_start` - User started typing
- `typing_stop` - User stopped typing
- `message_read` - Mark message as read
- `user_online` - User came online
- `user_offline` - User went offline

## 🎨 UI Components

### Sidebar
- User list with avatars
- Online status indicators
- User selection functionality

### Chat Header
- Selected user information
- User avatar and details

### Message List
- Message bubbles with timestamps
- File attachment display
- Read receipt indicators

### Message Input
- Text input with typing indicators
- File attachment button
- Send button with validation

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for password security
- **CORS Configuration** - Cross-origin resource sharing setup
- **Input Validation** - Server-side validation for all inputs
- **SQL Injection Protection** - Parameterized queries

## 🚀 Deployment

### Backend Deployment
1. Set up environment variables
2. Configure database connection
3. Deploy to your preferred hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service

## 🐛 Troubleshooting

### Common Issues

1. **Socket Connection Failed**
   - Check if backend server is running on port 5000
   - Verify CORS configuration
   - Check browser console for connection errors

2. **Database Connection Error**
   - Verify MySQL is running
   - Check database credentials in `.env` file
   - Ensure database and tables exist

3. **Messages Not Appearing**
   - Check socket connection status
   - Verify user authentication
   - Check browser console for errors

### Debug Mode
Enable detailed logging by checking browser console and server logs for debugging information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Socket.io for real-time communication
- TailwindCSS for styling
- React team for the amazing framework
- MySQL for reliable data storage

---

**Happy Chatting! 🎉**
