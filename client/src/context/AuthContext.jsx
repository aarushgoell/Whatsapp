import { createContext, useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";

const AuthContext = createContext({
  token: "",
  user: null,
  login: () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const userData = JSON.parse(atob(token.split(".")[1]));
        setUser({ id: userData.id, email: userData.email });
      } catch (error) {
        console.error("Error parsing token:", error);
        localStorage.removeItem("token");
        setToken("");
      }
    }
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
