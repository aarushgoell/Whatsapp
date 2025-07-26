import React from "react";

const MessageList = ({ messages, currentUserId, messagesEndRef }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Ensure messages is an array
  const messageArray = messages || [];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      <div className="space-y-4">
        {messageArray.map((message, index) => {
          const isOwnMessage = message.senderId === currentUserId;
          
          return (
            <div
              key={message.id || index}
              className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isOwnMessage
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                {/* Message text */}
                {message.message && (
                  <div className="text-sm">{message.message}</div>
                )}
                
                {/* File attachment */}
                {message.file && (
                  <div className="mt-2 p-2 bg-gray-100 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">📎</span>
                      <div>
                        <div className="text-sm font-medium">{message.file.name}</div>
                        <div className="text-xs text-gray-500">
                          {message.file.type} • {(message.file.size / 1024).toFixed(1)}KB
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Message footer with time and read status */}
                <div className="flex items-center justify-between mt-1">
                  <div
                    className={`text-xs ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </div>
                  
                  {/* Read receipt for own messages */}
                  {isOwnMessage && (
                    <div className="text-xs text-blue-100">
                      {message.seen ? "✓✓" : "✓"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {messageArray.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList; 