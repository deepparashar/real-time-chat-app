import { createContext, useEffect, useState } from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [authUser, setAuthUser] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [socket, setSocket] = useState(null);

  // Helper function for error toast (similar pattern as before)
  const handleError = (error) => {
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong!";
    toast.error(msg);
  };

  // Check if user is authenticated and setup socket
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("Token not found in localStorage");
        return;
      }

      const { data } = await axios.get("/api/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setAuthUser(data.user);
        connectSocket(data.user);
      } else {
        toast.error(data.message || "Authentication failed");
      }
    } catch (error) {
      console.error("Auth Error:", error.response?.data || error.message);
      // Only toast if there's a real server error message
      if (error.response?.data?.message) handleError(error);
    }
  };

  // Login user & connect socket
  const login = async (state, credentials) => {
    try {
      const { data } = await axios.post(`/api/auth/${state}`, credentials);
      if (data.success) {
        setAuthUser(data.userData);
        connectSocket(data.userData);
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        setToken(data.token);
        localStorage.setItem("token", data.token);
        toast.success(data.message);
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (error.response?.data?.message) handleError(error);
    }
  };

  // Logout & disconnect socket
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    axios.defaults.headers.common["Authorization"] = null;
    toast.success("Logged out successfully");
    if (socket) socket.disconnect();
  };

  // Update user profile
  const updateProfile = async (body) => {
    try {
      const { data } = await axios.put("/api/auth/update-profile", body);
      if (data.success) {
        setAuthUser(data.user);
        toast.success("Profile updated successfully");
      } else {
        toast.error(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      if (error.response?.data?.message) handleError(error);
    }
  };

  // Setup socket connection and listeners
  const connectSocket = (userData) => {
    if (!userData || socket?.connected) return;

    const newSocket = io(backendUrl, {
      query: {
        userId: userData._id,
      },
    });

    newSocket.connect();
    setSocket(newSocket);

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });
  };

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    checkAuth();
  }, []);

  const value = {
    axios,
    socket,
    setSocket,
    logout,
    login,
    authUser,
    connectSocket,
    updateProfile,
    setAuthUser,
    onlineUsers,
    setOnlineUsers,
    checkAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
