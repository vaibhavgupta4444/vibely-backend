import { AuthenticatedRequest } from "../../interfaces/auth-request";
import User from "../../models/User";
import { NotFoundError, UnauthorizedError } from "../../utils/https-error";
import { createToken } from "./generate-token";
import { Response } from "express";

export const refreshToken = async(req: AuthenticatedRequest, res: Response) => {
   const userId = req.user?._id;

   if(!userId){
    throw UnauthorizedError("Unauthorized Access");
   }

   const user = await User.findById(userId).lean();

   if(!user){
    throw NotFoundError("User not found");
   }

   const { token } = await createToken(user._id);

   return res.status(200).json({
    success: true,
    data: {token}
   });
}