import React from "react";

const Sidebar = ({ users, currentUserId, selectedUserId, onSelectUser, onlineUsers }) => {
  return (
    <div className="w-1/4 bg-gray-100 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
      </div>
      
      <div className="overflow-y-auto h-full">
        {users.map((user) => (
          <div
            key={user.id}
            onClick={() => {
              console.log("Sidebar: User clicked:", user.id, user.name);
              onSelectUser(user.id);
            }}
            className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedUserId === user.id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                {onlineUsers?.includes(user.id) && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        ))}
        
        {users.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No users available
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar; 