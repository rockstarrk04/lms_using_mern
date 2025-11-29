// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  // ------------------------------
  // Load saved user from localStorage
  // ------------------------------
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  // ------------------------------
  // Load saved token
  // ------------------------------
  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  // -------------------------------------
  // Automatically attach token to fetch/axios
  // -------------------------------------
  useEffect(() => {
    if (token) {
      // If using axios, remove comment below:
      // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // If using fetch globally, add like:
      window.authToken = token;
    } else {
      // axios.defaults.headers.common["Authorization"] = null;
      window.authToken = null;
    }
  }, [token]);

  // ------------------------------
  // Login function
  // ------------------------------
  const login = (userData, tokenValue) => {
    setUser(userData);
    setToken(tokenValue);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", tokenValue);
  };

  // ------------------------------
  // Logout function
  // ------------------------------
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
