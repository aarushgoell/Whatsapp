import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import socket from "../socket";

import Sidebar from "../components/Sidebar";
import ChatHeader from "../components/ChatHeader";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

const ChatPage = ({ currentUserId, selectedUserId, setSelectedUserId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [users, setUsers] = useState([]);
  const messagesEndRef = useRef(null);

  // Join room + receive messages
  useEffect(() => {
    if (!currentUserId) return;
    socket.emit("join", currentUserId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId]);

  // Fetch messages from DB
  useEffect(() => {
    if (!selectedUserId) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${selectedUserId}`, {
          headers: {
            Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiZW1haWwiOiJyYWp1QGV4YW1wbGUuY29tIiwiaWF0IjoxNzUzNDQ4NzYzLCJleHAiOjE3NTM1MzUxNjN9.FSvLFHW3vYlBXofI-qPCRaOjbbjCMDZx9OHyLy5ezjg`,
          },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error("Error loading messages:", err);
      }
    };

    fetchMessages();
  }, [selectedUserId]);

  // Fetch user list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/users", {
          headers: {
            Authorization: `Bearer eyJhbGciOi...`,
          },
        });
        setUsers(res.data.users);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text) => {
    const messageData = {
      senderId: currentUserId,
      receiverId: selectedUserId,
      message: text,
    };

    socket.emit("send_message", messageData);
    setMessages((prev) => [...prev, messageData]);
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        users={users}
        currentUserId={currentUserId}
        selectedUserId={selectedUserId}
        onSelectUser={setSelectedUserId}
      />

      <div className="w-3/4 flex flex-col">
        <ChatHeader selectedUserId={selectedUserId} />

        <MessageList
          messages={messages}
          currentUserId={currentUserId}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSend={sendMessage}
        />
      </div>
    </div>
  );
};

export default ChatPage;
