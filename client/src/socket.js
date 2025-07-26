// client/src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ['websocket', 'polling']
}); // backend URL

// Add connection status logging
socket.on("connect", () => {
  console.log("✅ Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("❌ Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("❌ Socket connection error:", error);
});

export default socket;
