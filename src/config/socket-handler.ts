import Message from "../models/Message";
import User from "../models/User";
import ChatRoom from "../models/ChatRoom";

const socketHandler = (io: any) => {
  
  const userSockets = new Map<string, string>();

  io.on("connection", (socket: any) => {
    console.log("User connected:", socket.id);

    socket.on("join", (userId: string) => {
      userSockets.set(userId, socket.id);
      console.log(`User ${userId} joined with socket ${socket.id}`);
    });

    // Send message
    socket.on("sendMessage", async (data: any) => {
      try {
        const { sender, receiver, content } = data;

        if (!sender || !receiver || !content) {
          socket.emit("error", { message: "Missing required fields" });
          return;
        }

        // Find the receiver user by email
        const receiverUser = await User.findOne({ email: receiver }).lean();
        if (!receiverUser) {
          socket.emit("error", { message: "Receiver not found" });
          return;
        }

        // Find or create chat room
        const chatRoom = await ChatRoom.findOne({
          isGroup: false,
          users: {
            $all: [sender, receiverUser._id],
            $size: 2,
          },
        });

        if (!chatRoom) {
          socket.emit("error", { message: "Chat room not found" });
          return;
        }

        // Create the message
        const message = await Message.create({
          sender,
          chatRoom: chatRoom._id,
          content,
          isRead: false
        });

        // Update chat room's latest message
        await ChatRoom.findByIdAndUpdate(chatRoom._id, {
          latestMessage: message._id
        });

        // Populate message with sender and receiver info
        const populatedMessage = await Message.findById(message._id)
          .populate('sender', '_id email firstName lastName')
          .lean();

        const senderUser = populatedMessage?.sender as any;
        const senderName = `${senderUser.firstName} ${senderUser.lastName}`;
        const receiverName = `${receiverUser.firstName} ${receiverUser.lastName}`;

        const formattedMessage = {
          _id: populatedMessage?._id,
          sender: {
            _id: senderUser._id,
            email: senderUser.email,
            name: senderName,
          },
          receiver: {
            _id: receiverUser._id,
            email: receiverUser.email,
            name: receiverName,
          },
          content: populatedMessage?.content,
          isRead: populatedMessage?.isRead,
          createdAt: populatedMessage?.createdAt,
        };

        // Emit to receiver if they're online
        const receiverSocketId = userSockets.get(receiverUser._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", formattedMessage);
        }

        // Emit back to sender for confirmation
        socket.emit("messageSent", formattedMessage);
      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      // Remove user from socket mappings
      for (const [userId, socketId] of userSockets.entries()) {
        if (socketId === socket.id) {
          userSockets.delete(userId);
          console.log(`User ${userId} disconnected`);
          break;
        }
      }
      console.log("User disconnected:", socket.id);
    });
  });
};

export default socketHandler;