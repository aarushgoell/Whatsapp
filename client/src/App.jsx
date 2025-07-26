// import "./App.css";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ChatPage from "./Pages/ChatPage";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { useState } from "react";

function App() {
  const auth = useAuth();
  const user = auth?.user;
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/chat" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/chat"
          element={
            user ? (
              <ChatPage 
                currentUserId={user.id} 
                selectedUserId={selectedUserId}
                setSelectedUserId={setSelectedUserId}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
