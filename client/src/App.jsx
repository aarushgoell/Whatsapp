// import "./App.css";
import { Navigate, Route, Router, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ChatPage from "./Pages/ChatPage";

function App() {
  const { user } = useAuth();

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
              <ChatPage currentUserId={user.id} />
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
