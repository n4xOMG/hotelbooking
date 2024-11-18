import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [currentChatId, setCurrentChatId] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000"); // Update with your server URL

    newSocket.on("connect", () => {
      setIsConnected(true);
      console.log("Socket connected");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      console.log("Socket disconnected");
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  const joinChat = useCallback(
    (user1Id, user2Id) => {
      return new Promise((resolve, reject) => {
        if (!socket || !socket.connected) {
          console.error("Socket not connected");
          reject("Socket not connected");
          return;
        }

        // Leave previous chat room if any
        if (currentChatId) {
          socket.emit("leaveChat", currentChatId);
          console.log(`Left chat room: ${currentChatId}`);
        }

        socket.emit("joinChat", user1Id, user2Id, (response) => {
          if (response.error) {
            reject(response.error);
          } else {
            setMessages(response.chat.messages);
            setCurrentChatId(response.chat._id);
            console.log(`Joined chat room: ${response.chat._id}`);
            resolve(response.chat);
          }
        });
      });
    },
    [socket, currentChatId]
  );

  const sendMessage = useCallback(
    (chatId, senderId, message, images = []) => {
      console.log("Sending message:", { chatId, senderId, message, images });
      if (!socket || !socket.connected) {
        console.error("Socket not connected");
        return;
      }
      socket.emit("sendMessage", { chatId, senderId, message, images });
    },
    [socket]
  );

  useEffect(() => {
    if (socket) {
      const handleReceiveMessage = (newChat) => {
        if (newChat && newChat.messages) {
          setMessages(newChat.messages);
        } else {
          console.error("Received invalid chat data:", newChat);
        }
      };

      socket.on("receiveMessage", handleReceiveMessage);

      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }
  }, [socket]);

  return <ChatContext.Provider value={{ joinChat, sendMessage, messages, isConnected }}>{children}</ChatContext.Provider>;
};
