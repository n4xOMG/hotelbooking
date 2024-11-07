const { Server } = require("socket.io");
const Chat = require("../models/Chat");

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("joinChat", async (user1Id, user2Id) => {
      try {
        // Look for an existing chat between the two users
        let chat = await Chat.findOne({
          participants: { $all: [user1Id, user2Id] },
        });

        if (!chat) {
          chat = new Chat({ participants: [user1Id, user2Id], messages: [] });
          await chat.save();
        }

        // Join the chat room with the chat ID
        socket.join(chat._id.toString());
        console.log(`User joined chat room: ${chat._id}`);
      } catch (error) {
        console.error("Error joining chat:", error);
      }
    });

    // Handle sending a new message
    socket.on("sendMessage", async (data) => {
      const { chatId, senderId, message } = data;
      const newMessage = {
        sender: senderId,
        message,
        timestamp: new Date(),
      };

      try {
        // Update the chat in the database
        const chat = await Chat.findByIdAndUpdate(chatId, { $push: { messages: newMessage } }, { new: true })
          .populate("participants", "firstname lastname username")
          .populate("messages.sender", "firstname lastname username");

        // Emit the new message to all users in the room
        io.to(chatId).emit("receiveMessage", chat);
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
