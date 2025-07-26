import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../socket";
import { useAuth } from "../context/AuthContext";

import Sidebar from "../Components/Sidebar";
import ChatHeader from "../Components/ChatHeader";
import MessageList from "../Components/MessageList";
import MessageInput from "../Components/MessageInput";

const ChatPage = ({ currentUserId, selectedUserId, setSelectedUserId }) => {
  const { token } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Socket connection status
  useEffect(() => {
    setSocketConnected(socket.connected);
    
    socket.on("connect", () => {
      console.log("✅ Socket connected in ChatPage");
      setSocketConnected(true);
    });
    
    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected in ChatPage");
      setSocketConnected(false);
    });
  }, []);

  // Join room + receive messages
  useEffect(() => {
    if (!currentUserId) return;
    console.log("🔌 Joining room for user:", currentUserId);
    socket.emit("join", currentUserId);

    socket.on("receive_message", (data) => {
      console.log("📨 Received message:", data);
      console.log("📨 Current messages before update:", messages);
      
      setMessages((prev) => {
        console.log("📨 Previous messages:", prev);
        
        // Remove optimistic message if it exists and replace with real message
        const filteredMessages = prev.filter(msg => 
          !(msg.isOptimistic && msg.message === data.message && msg.senderId === data.senderId)
        );
        
        const newMessages = [...filteredMessages, data];
        console.log("📨 New messages array:", newMessages);
        return newMessages;
      });
    });

    socket.on("user_typing", (data) => {
      if (data.senderId === selectedUserId) {
        setIsTyping(true);
        setTypingUser(users.find(u => u.id === data.senderId)?.name || "Someone");
      }
    });

    socket.on("user_stopped_typing", (data) => {
      if (data.senderId === selectedUserId) {
        setIsTyping(false);
        setTypingUser("");
      }
    });

    socket.on("user_online", (data) => {
      setOnlineUsers(prev => [...prev, data.userId]);
    });

    socket.on("user_offline", (data) => {
      setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    });

    return () => {
      socket.off("receive_message");
      socket.off("user_typing");
      socket.off("user_stopped_typing");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [currentUserId, selectedUserId, users]);

  // Fetch messages from DB
  useEffect(() => {
    if (!selectedUserId || !token) return;

    const fetchMessages = async () => {
      try {
        console.log("Fetching messages for user:", selectedUserId);
        const res = await axios.get(`/api/messages/${selectedUserId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched messages response:", res.data);
        console.log("Messages array:", res.data.messages);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error loading messages:", err);
        setMessages([]);
      }
    };

    fetchMessages();
  }, [selectedUserId, token]);

  // Fetch user list
  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Fetched users:", res.data.users);
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    fetchUsers();
  }, [token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text, file = null) => {
    const messageData = {
      senderId: currentUserId,
      receiverId: selectedUserId,
      message: text,
      file: file ? { name: file.name, type: file.type, size: file.size } : null,
    };

    console.log("📤 Sending message:", messageData);
    console.log("📤 Socket connected:", socket.connected);
    
    if (socket.connected) {
      socket.emit("send_message", messageData);
      
      // Add message immediately for sender (optimistic update)
      const optimisticMessage = {
        id: Date.now(), // temporary ID
        senderId: currentUserId,
        receiverId: selectedUserId,
        message: text,
        file: file ? { name: file.name, type: file.type, size: file.size } : null,
        timestamp: new Date().toISOString(),
        isOptimistic: true, // flag to identify optimistic updates
        seen: false
      };
      
      setMessages((prev) => [...prev, optimisticMessage]);
    } else {
      console.error("❌ Socket not connected!");
    }
  };

  // Mark messages as seen when user opens chat
  useEffect(() => {
    if (selectedUserId && messages.length > 0) {
      const unreadMessages = messages.filter(
        msg => msg.senderId === selectedUserId && !msg.seen && msg.senderId !== currentUserId
      );
      
      unreadMessages.forEach(msg => {
        socket.emit("message_read", {
          messageId: msg.id,
          senderId: msg.senderId,
          receiverId: currentUserId,
        });
      });
    }
  }, [selectedUserId, messages, currentUserId]);

  const handleUserSelect = (userId) => {
    console.log("User selected:", userId);
    setSelectedUserId(userId);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        users={users}
        currentUserId={currentUserId}
        selectedUserId={selectedUserId}
        onSelectUser={handleUserSelect}
        onlineUsers={onlineUsers}
      />

      <div className="w-3/4 flex flex-col">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 p-2">
          <ChatHeader selectedUserId={selectedUserId} users={users} />
          <div className={`px-2 py-1 rounded text-xs ${socketConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {socketConnected ? '🟢 Connected' : '🔴 Disconnected'}
          </div>
        </div>

        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSend={sendMessage}
          selectedUserId={selectedUserId}
          currentUserId={currentUserId}
          isTyping={isTyping}
          typingUser={typingUser}
        />
      </div>
    </div>
  );
};

export default ChatPage;
