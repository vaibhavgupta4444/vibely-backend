import { Response } from "express";
import { AuthenticatedRequest } from "../../interfaces/auth-request";
import { NotFoundError, UnauthorizedError, BadRequestError } from "../../utils/https-error";
import User from "../../models/User";
import ChatRoom from "../../models/ChatRoom";

export const friendRequest = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const userId = req.user?._id;
  const receiverEmail: string = req.body.receiverEmail;

  if (!userId) {
    throw UnauthorizedError("Unauthorized access");
  }

  const sender = await User.findById(userId).lean();
  if (!sender || !sender.isVerified) {
    throw NotFoundError("User not found or not verified");
  }


  const receiver = await User.findOne({ email: receiverEmail }).lean();
 
  if (!receiver || !receiver.isVerified) {
    throw NotFoundError(
      "User with this EmailId either does not exist or is not verified"
    );
  }

  if (receiver._id.toString() === userId.toString()) {
    throw BadRequestError("You cannot start a chat with yourself");
  }

  const existingChatRoom = await ChatRoom.findOne({
    isGroup: false,
    users: {
      $all: [userId, receiver._id],
      $size: 2,
    },
  });

  if (existingChatRoom) {
    return res.status(200).json({
      success: true,
      message: "Chat room already exists",
      chatRoomId: existingChatRoom._id,
    });
  }


  const newChatRoom = await ChatRoom.create({
    isGroup: false,
    users: [userId, receiver._id],
  });

  return res.status(201).json({
    success: true,
    message: "Chat room created successfully",
    chatRoomId: newChatRoom._id,
  });
};
