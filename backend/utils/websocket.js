const { Server } = require("socket.io");
const Chat = require("../models/Chat");
const User = require("../models/User");
const getOrCreateChat = async (user1Id, user2Id) => {
  try {
    let chat = await Chat.findOne({
      participants: { $all: [user1Id, user2Id] },
    });

    if (!chat) {
      chat = new Chat({ participants: [user1Id, user2Id], messages: [] });
      await chat.save();
    }

    return chat;
  } catch (error) {
    console.error("Error finding or creating chat:", error);
    throw new Error("Could not get or create chat");
  }
};

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    socket.on("joinChat", async (user1Id, user2Id, callback) => {
      try {
        const chat = await getOrCreateChat(user1Id, user2Id);

        socket.join(chat._id.toString());
        console.log(`User ${socket.id} joined chat room: ${chat._id}`);

        callback({ chat });
      } catch (error) {
        console.error("Error joining chat:", error);
        callback({ error: "Error joining chat" });
      }
    });

    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.id} left chat room: ${chatId}`);
    });

    socket.on("sendMessage", async (data) => {
      const { chatId, senderId, message } = data;

      // Validate senderId
      const sender = await User.findById(senderId);
      if (!sender) {
        console.error("Sender not found");
        return;
      }

      // Validate chat existence and participation
      const chat = await Chat.findById(chatId);
      if (!chat) {
        console.error("Chat not found");
        return;
      }

      if (!chat.participants.includes(senderId)) {
        console.error("Sender is not a participant of the chat");
        return;
      }

      const newMessage = {
        sender: senderId,
        message,
        timestamp: new Date(),
      };

      try {
        const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage } }, { new: true })
          .populate("participants", "firstname lastname username")
          .populate("messages.sender", "firstname lastname username");

        io.to(chatId).emit("receiveMessage", updatedChat);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });

  return io;
}

module.exports = initWebSocket;
