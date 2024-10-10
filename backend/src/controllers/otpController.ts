import asyncHandler from "express-async-handler";
import otp from "otp-generator";
import prisma from "../lib/prisma";
import sendMail from "../mail/sendMail";

export const otpGenerator = asyncHandler(async (req: any, res: any) => {

    const otpCode = otp.generate(6, { upperCaseAlphabets: false, specialChars: false });
    try {

        const response = await prisma.otp.create({
            data: {
                otp: otpCode,
                user: {
                    connect: {
                        user_id: req.user.user_id,
                    },
                },
                expiresAt: new Date(Date.now() + 10 * 60 * 1000), 
            },
        });

        
        const email = await prisma.user.findUnique({
            where: {
                user_id: req.user.user_id, 
            },
            select: {
                email: true,
            },
        });

        if (!email) {
            return res.status(404).json({ message: "User not found" });
        }

        await sendMail(email.email, otpCode);  
        res.status(200).json({ message: "OTP generated successfully and email sent" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in generating OTP" });
    }
});


export const verifyOtp = asyncHandler(async (req: any, res: any) => {
    const { otp } = req.body;
    try {
        const otpData = await prisma.otp.findFirst({
            where: {
                otp: otp,
                // @ts-ignore
                user_id: req.user.user_id,
                expiresAt: {
                    gte: new Date(),
                },
            },
        });

        if (!otpData) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        await prisma.otp.delete({
            where: {
                id: otpData.id,
            },
        });

        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error in verifying OTP" });
    }
});

