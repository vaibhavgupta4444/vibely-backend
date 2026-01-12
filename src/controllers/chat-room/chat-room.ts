import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/auth-request";
import ChatRoom from "../../models/ChatRoom";
import Message from "../../models/Message";

export const getChatRooms = async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized Access" });

    const chatRooms = await ChatRoom.find({ participants: userId }).populate('participants', 'firstName lastName email');

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