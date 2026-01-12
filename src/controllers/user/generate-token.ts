import mongoose from "mongoose";
import { HttpError } from "../../utils/https-error";
import jwt from "jsonwebtoken"

export const createToken = (id: mongoose.Types.ObjectId) => {
    const secret = process.env.JWT_SECRET;
    if(!secret){
        throw new HttpError(404, 'JWT secret not defined')
    }

    const token = jwt.sign({id}, secret, {expiresIn: '7d'});
    const refreshToken = jwt.sign({id}, secret, {expiresIn: '30d'});

    return { token, refreshToken}
}