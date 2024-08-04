import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

const getCommunities = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const user_id = req.user.user_id;
});

// @ts-ignore
const createPost = asyncHandler(async (req: Request, res: Response, next) => {
  const { title, content, collegeId } = req.body;
  // @ts-ignore
  const user_id = req.user.user_id;

  if (!title || !content || !collegeId) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  const user = await prisma.user.findUnique({
    where: { user_id },
  });

  if (!user) {
    return res.status(404).json({ message: "User not recognized" });
  }

  const post = await prisma.post.create({
    // @ts-ignore
    data: {
      title,
      content,
      user_id,
    },
  });

  return res.status(201).json({ post });
});
