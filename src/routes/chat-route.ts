import { Router } from "express";
import authUser from "../middlewares/auth";
import asyncWrapper from "../utils/async-wrapper";
import { getChatRooms, getMessages } from "../controllers/chat-room/chat-room";

const chatRouter = Router();

chatRouter.get('/', authUser, asyncWrapper(getChatRooms));
chatRouter.get('/:chatRoomId/messages', authUser, asyncWrapper(getMessages));

export default chatRouter;