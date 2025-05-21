import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";
import { createContext, useState, useContext, useEffect } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessage] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { axios, socket } = useContext(AuthContext);

  // Helper function for error toast
  const handleError = (error) => {
    // Prioritize server error messages
    const msg =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong!";
    toast.error(msg);
  };

  //Function to get all user for sidebar
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");

      if (data.success) {
        setUsers(data.filteredUsers);
        setUnseenMessages(data.unseenMessages);
      } else {
        toast.error(data.message || "Failed to fetch users");
      }
    } catch (error) {
      console.error("GetUsers error:", error);
      // Only show toast if it's a real API error
      if (error.response?.data?.message) handleError(error);
    }
  };

  //function to get messages for selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessage(data.messages);
      } else {
        toast.error(data.message || "Failed to fetch messages");
      }
    } catch (error) {
      console.error("GetMessages error:", error);
      if (error.response?.data?.message) handleError(error);
    }
  };

  //function to send message to selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
      if (data.success) {
        setMessage((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("SendMessage error:", error);
      if (error.response?.data?.message) handleError(error);
    }
  };

  //Function to subscribe to messages for selected user
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessage((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`).catch((err) => {
          console.error("Mark seen error:", err);
          // No toast for mark seen failure, silently fail
        });
      } else {
        setUnseenMessages((prevUnseenMsg) => ({
          ...prevUnseenMsg,
          [newMessage.senderId]: prevUnseenMsg[newMessage.senderId]
            ? prevUnseenMsg[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  //Function to unsubscribe from messages
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    message,
    users,
    selectedUser,
    getUsers,
    setMessage,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages,
    getMessages
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};
