import asyncHandler from "express-async-handler";
import otp from "otp-generator";
import prisma from "../lib/prisma";
import sendMail from "../mail/sendMail";
import bcrypt from "bcrypt";

export const otpGenerator = asyncHandler(async (req: any, res: any) => {
  const { email } = req.body;

  const otpCode = otp.generate(6, {
    upperCaseAlphabets: false,
    specialChars: false,
  });
  try {
    const user = await prisma.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (!user.emailVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }
    const response = await prisma.otp.create({
      data: {
        otp: otpCode,
        user: {
          connect: {
            email,
          },
        },
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });
    const htmlContent = `<h1>Your OTP is ${otpCode}</h1>`;
    await sendMail(htmlContent, email);
    res
      .status(200)
      .json({ message: "OTP generated successfully and email sent" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in generating OTP" });
  }
});

export const verifyOtp = asyncHandler(async (req: any, res: any) => {
  const { otp, email } = req.body;

  try {
    const otpData = await prisma.otp.findFirst({
      where: {
        otp: otp,

        user: {
          email,
        },
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (otpData === null) {
      return res.status(404).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
    // await prisma.otp.delete({
    //   where: {
    //     id: otpData.id,
    //   },
    // });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in verifying OTP" });
  }
});

export const changePassword = asyncHandler(async (req: any, res: any) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 8);
  try {
    const response = await prisma.user.update({
      where: {
        email,
      },
      data: {
        password: hashedPassword,
      },
    });
    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error in changing password" });
  }
});
