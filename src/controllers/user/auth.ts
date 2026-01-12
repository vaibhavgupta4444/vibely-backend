import { Request, Response } from "express";
import User from "../../models/User";
import { BadRequestError, ConflictError, HttpError, NotFoundError, UnauthorizedError, ValidationError } from "../../utils/https-error";
import bcrypt from "bcrypt"
import { sendOtp } from "../../utils/send-mail";
import { signinSchema } from "../../validators/signin-schema";
import { signupSchema } from "../../validators/signup-schema";
import { createToken } from "./generate-token";


export const signup = async(req: Request, res: Response) => {
    const { firstName, lastName, email, password } = signupSchema.parse(req.body);
  
    const isUserExists = await User.findOne({email}).lean();

    if(isUserExists && isUserExists.isVerified){
        throw ConflictError("This email id is already in use");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otp, 10);
    const otpExpires = Date.now() + 10 * 60 * 1000;

    if(!isUserExists){
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp: hashedOtp,
            otpExpires
        });

        await user.save();
    }

    await sendOtp(email, otp);

    return res.status(200).json({
        success: true,
        message: "OTP is sent to your emailId for verification"
    })
}

export const signin = async(req: Request, res: Response) => {
    const { email, password } = signinSchema.parse(req.body);

    if(!email || !password){
        throw BadRequestError("Please provide email and password");
    }

    const user = await User.findOne({email}).lean();

    if(!user){
        throw NotFoundError("User not exists");
    }

    if(!user.isVerified){
        throw BadRequestError("User is not verified");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if(!isMatch){
        throw new HttpError(401,"Invalid Password");
    }

    const {token, refreshToken} = await createToken(user._id);
    return res.status(200).json({
        success: true,
        message: "Login Success",
        data:{token, refreshToken}
    })
}

export const verify = async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw BadRequestError("Missing parameters");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw NotFoundError("User not found");
    }

    if (user.isVerified) {
        throw BadRequestError("User already verified");
    }

    if (
        !user.otp ||
        !user.otpExpires ||
        Date.now() > user.otpExpires.getTime()
    ) {
     
        throw BadRequestError("OTP expired, please request a new OTP");
    }

    const isOtpValid = await bcrypt.compare(
        otp.toString(),
        user.otp
    );

    if (!isOtpValid) {
        throw BadRequestError("Invalid OTP");
    }

  
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;

    await user.save();

    const { token, refreshToken } = await createToken(user._id);

    return res.json({
        success: true,
        message: "OTP verification successful",
        data: {
            token,
            refreshToken,
        },
    });
};