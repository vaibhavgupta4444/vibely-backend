import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/https-error";
import { AuthenticatedRequest } from "../interfaces/auth-request";
import mongoose from "mongoose";

const authUser = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Get token from Authorization header (Bearer token format)
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw UnauthorizedError('Access denied. No valid token provided.');
        }

        const token = authHeader.substring(7);
        

        if (!token) {
            throw UnauthorizedError('Access denied. No token provided.');
        }

        // Verify JWT_SECRET exists
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            throw new Error('JWT_SECRET is not configured');
        }

        // Verify and decode token
        const decoded = jwt.verify(token, jwtSecret) as { id: mongoose.Types.ObjectId };
        // Attach user info to request object
        req.user = {
            _id: decoded.id
        };

        next();
    } catch (error: any) {
        if (error.name === 'JsonWebTokenError') {
            throw UnauthorizedError('Invalid token.');
        } else if (error.name === 'TokenExpiredError') {
            throw UnauthorizedError('Token has expired.');
        } else {
            throw error;
        }
    }
};

export default authUser;