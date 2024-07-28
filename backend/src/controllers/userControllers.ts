import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import axios from "axios";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 8);
    if(!email || !name || !password) {
        res.status(400).json({ message: "Please provide all fields" });
        return;
    }
    const userExists = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if(userExists) {
        res.status(409).json({ message: "User already exists" });
        return;
    }

    const response = await axios.post(
        'https://api.apyhub.com/validate/email/academic',
        { email },
        {
          headers: {
            'apy-token': process.env.APY_TOKEN, // Read token from environment variables
            'Content-Type': 'application/json'
          }
        }
      );
    let isCollegeEmail = response.data.data;

    const user = await prisma.user.create({
        data: {
        email,
        password: hashedPassword,
        name,
        collegeEmailVerified: isCollegeEmail,
        emailVerified:true,
        },
    });
    res.status(201).json(user);
});

export { registerUser };
