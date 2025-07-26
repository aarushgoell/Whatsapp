import React from "react";

const ChatHeader = ({ selectedUserId, users }) => {
  const selectedUser = users?.find(user => user.id === selectedUserId);

  if (!selectedUser) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center">
          <h2 className="text-lg font-semibold text-gray-500">
            Select a user to start chatting
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white font-semibold">
            {selectedUser.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {selectedUser.name}
          </h2>
          <p className="text-sm text-gray-500">{selectedUser.email}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader; 