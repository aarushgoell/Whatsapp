import React, { useEffect, useRef, useState } from "react";
import socket from "../socket";

const MessageInput = ({ newMessage, setNewMessage, onSend, selectedUserId, currentUserId, isTyping, typingUser }) => {
  const typingTimeoutRef = useRef(null);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("🔄 Submit triggered:", { newMessage, selectedUserId, currentUserId });
    if ((newMessage.trim() || selectedFile) && selectedUserId) {
      console.log("✅ Calling onSend with:", newMessage.trim());
      onSend(newMessage.trim(), selectedFile);
      setNewMessage("");
      setSelectedFile(null);
      // Stop typing indicator
      socket.emit("typing_stop", {
        senderId: currentUserId,
        receiverId: selectedUserId,
      });
    } else {
      console.log("❌ Submit blocked:", { hasMessage: !!newMessage.trim(), selectedUserId });
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);
    
    // Start typing indicator
    if (selectedUserId && e.target.value.trim()) {
      socket.emit("typing_start", {
        senderId: currentUserId,
        receiverId: selectedUserId,
      });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set timeout to stop typing indicator after 2 seconds
    typingTimeoutRef.current = setTimeout(() => {
      if (selectedUserId) {
        socket.emit("typing_stop", {
          senderId: currentUserId,
          receiverId: selectedUserId,
        });
      }
    }, 2000);
  };

  if (!selectedUserId) {
    return (
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="text-center text-gray-500">
          <p>Select a user to start messaging</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        {/* File attachment preview */}
        {selectedFile && (
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">📎 {selectedFile.name}</span>
            <button
              type="button"
              onClick={removeFile}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              ✕
            </button>
          </div>
        )}
        
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={!selectedUserId}
          />
          
          {/* File attachment button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            disabled={!selectedUserId}
          >
            📎
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          
          <button
            type="submit"
            disabled={(!newMessage.trim() && !selectedFile) || !selectedUserId}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
      
      {isTyping && typingUser && (
        <div className="text-sm text-gray-500 mt-2 italic">
          {typingUser} is typing...
        </div>
      )}
      
      {/* Debug info */}
      <div className="text-xs text-gray-400 mt-1">
        Socket: {socket.connected ? '🟢 Connected' : '🔴 Disconnected'} | 
        Selected User: {selectedUserId || 'None'}
      </div>
    </div>
  );
};

export default MessageInput; 