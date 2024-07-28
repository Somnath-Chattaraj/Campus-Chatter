import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
const transporter = nodemailer.createTransport({
  // @ts-ignore
  host: process.env.BREVO_HOST,
  port: process.env.BREVO_PORT,
  secure: false, // Use `true` for port 465, `false` for all other ports
  auth: {
    user: process.env.BREVO_USER,
    pass: process.env.BREVO_PASSWORD,
  },
});

const sendMail = asyncHandler(async (email, url) => {
  await transporter.sendMail({
    from: '"Review" <verify@review.com>',
    // @ts-ignore
    to: email,
    subject: "URL/OTP for verification",
    text: "Single use URL/OTP",
    // @ts-ignore
    html: url,
  });
});

export default sendMail;
