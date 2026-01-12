import { Router } from "express";
import authUser from "../middlewares/auth";
import asyncWrapper from "../utils/async-wrapper";
import { getChatRooms } from "../controllers/chat-room/chat-room";

const chatRouter = Router();

chatRouter.get('/', authUser, asyncWrapper(getChatRooms));

export default chatRouter;