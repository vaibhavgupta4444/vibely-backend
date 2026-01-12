import { Router } from "express";
import { signin, signup, verify } from "../controllers/user/auth";
import { refreshToken } from "../controllers/user/token";
import { changePassword, forgotPassword, generateResetToken } from "../controllers/user/password";
import asyncWrapper from "../utils/async-wrapper";
import authUser from "../middlewares/auth";
import { friendRequest } from "../controllers/user/friend-request";

const userRouter = Router();


userRouter.post("/signup", asyncWrapper(signup));
userRouter.post("/signin", asyncWrapper(signin));
userRouter.patch("/verify", asyncWrapper(verify));
userRouter.post('/reset-password', authUser, asyncWrapper(changePassword));
userRouter.post('/refresh-token', asyncWrapper(refreshToken));

// forgot password routes
userRouter.post('/forgot-password', asyncWrapper(generateResetToken));
userRouter.patch('/forgot-password/:token', asyncWrapper(forgotPassword));

// finding user
userRouter.post('/find', authUser, asyncWrapper(friendRequest));

export default userRouter;