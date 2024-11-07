import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Update with server URL
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  const joinChat = (user1Id, user2Id) => {
    socket.emit("joinChat", { user1Id, user2Id });
  };

  const sendMessage = (chatId, senderId, message) => {
    socket.emit("sendMessage", { chatId, senderId, message });
  };

  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (newChat) => {
        setMessages(newChat.messages); // Update messages for the active chat
      });
    }
  }, [socket]);

  return <ChatContext.Provider value={{ joinChat, sendMessage, messages }}>{children}</ChatContext.Provider>;
};
