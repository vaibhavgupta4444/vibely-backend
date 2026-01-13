import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/auth-request";
import ChatRoom from "../../models/ChatRoom";
import Message from "../../models/Message";

export const getChatRooms = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized Access" });

    const chatRooms = await ChatRoom.find({ users: userId }).populate('users', 'firstName lastName email');

    const chatRoomsWithLatest = await Promise.all(
      chatRooms.map(async (room) => {
        const latestMsg = await Message.findOne({ chatRoom: room._id })
            .sort({ createdAt: -1 })
            .populate<{ sender: { firstName: string; lastName: string } }>('sender', 'firstName lastName')
            .lean();
      
        const receivers = (room.users as any[])
          .filter((p) => p._id.toString() !== userId)
          .map((p) => ({
            firstName: p.firstName,
            lastName: p.lastName,
            email: p.email,
          }));

        const latestMessage = latestMsg
          ? {
              sender: `${latestMsg.sender.firstName} ${latestMsg.sender.lastName}`,
              content: latestMsg.content,
              isRead: latestMsg.isRead,
              updatedAt: latestMsg.updatedAt,
            }
          : {
              sender: "",
              content: "",
              isRead: true,
              updatedAt: new Date(),
            };

        return {
          id: room._id,
          receivers,
          latestMessage,
        };
      })
    );

    res.json({ chatRooms: chatRoomsWithLatest });
}

export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    const { chatRoomId } = req.params;

    if (!userId) return res.status(401).json({ message: "Unauthorized Access" });

    // Verify user is part of the chat room
    const chatRoom = await ChatRoom.findById(chatRoomId);
    if (!chatRoom) {
        return res.status(404).json({ message: "Chat room not found" });
    }

    const isUserInRoom = chatRoom.users.some(
        (user) => user.toString() === userId.toString()
    );

    if (!isUserInRoom) {
        return res.status(403).json({ message: "Access denied" });
    }

    // Get all messages for this chat room
    const messages = await Message.find({ chatRoom: chatRoomId })
        .populate('sender', '_id email firstName lastName')
        .sort({ createdAt: 1 })
        .lean();

    // Format messages
    const formattedMessages = messages.map((msg) => ({
        _id: msg._id,
        sender: {
            _id: (msg.sender as any)._id,
            email: (msg.sender as any).email,
            name: (msg.sender as any).lastName
                    ? `${(msg.sender as any).firstName} ${(msg.sender as any).lastName}`
                    : (msg.sender as any).firstName

        },
        receiver: {
            _id: chatRoom.users.find((u) => u.toString() !== (msg.sender as any)._id.toString()),
            email: "",
            name: (msg.sender as any).lastName
                    ? `${(msg.sender as any).firstName} ${(msg.sender as any).lastName}`
                    : (msg.sender as any).firstName
        },
        content: msg.content,
        isRead: msg.isRead,
        createdAt: msg.createdAt,
    }));

    res.json({ messages: formattedMessages });
}