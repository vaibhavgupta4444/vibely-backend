import nodemailer from "nodemailer";
import path from "path";
import ejs from 'ejs';

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


export const sendOtp = async (userEmail: string, otp: string) => {
  try {
    
    const templatePath = path.join(__dirname, 'templates', 'otpTemplate.ejs');

   
    const html = await ejs.renderFile(templatePath, { otp });

    const info = await transporter.sendMail({
      from: `"Vibely Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `${otp} is your Vibely verification code`,
      text: `Your OTP verification code is: ${otp}`, // Plain-text fallback
      html: html,
    });

    console.log("OTP Sent:", info.messageId);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email.");
  }
};

export const sendResetPassLink = async (userEmail: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${token}`;
  const templatePath = path.join(__dirname, 'templates', 'forgot-password.ejs');

  try {
  
    const html = await ejs.renderFile(templatePath, {
        resetUrl: resetUrl 
    });

    await transporter.sendMail({
      from: `"Vibely Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Reset Your Password",
      html: html, 
    });
    
  } catch (error) {
    console.error("Error rendering email template:", error);
    throw new Error("Email could not be sent");
  }
};
