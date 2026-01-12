import Message from "../models/Message";

const socketHandler = (io: any) => {
  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    // Send message
    socket.on("sendMessage", async (data: any) => {
      try {
        const { sender, receiver, content, chatRoom } = data;

        if (!sender || !receiver || !content) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        const message = await Message.create({
          sender,
          chatRoom,
          content,
          isRead: false
        });

        const populatedMessage = await message.populate(["sender", "chatRoom"]);

        // Emit to receiver
        io.to(receiver).emit("receiveMessage", populatedMessage);
        // Emit back to sender for confirmation
        socket.emit("messageSent", populatedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;