import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

// @ts-ignore
const getCommunities = asyncHandler(async (req: Request, res: Response) => {
  // @ts-ignore
  const user_id = req.user.user_id;
  // const user_id = "clzfffeey0000e6hx5j16b96c";
  const communities = await prisma.userCourse.findMany({
    where: {
      user_id: user_id,
    },
    select: {
      college_id: true,
      College: {
        select: {
          name: true,
        },
      },
    },
    distinct: ["college_id"],
  });
  // @ts-ignore
  const communityIds = communities.map((community) => community.college_id);
  // @ts-ignore
  if (communityIds.length === 0) {
    return res.status(200).json({ communityIds: [] });
  }
  let college = [];
  for (let i = 0; i < communityIds.length; i++) {
    college[i] = await prisma.college.findUnique({
      where: {
        college_id: communityIds[i],
      },
      select: {
        college_id: true,
        name: true,
      },
    });
  }
  return res.status(200).json({ college });
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
      college_id: collegeId,
    },
  });

  return res.status(201).json({ post });
});

// @ts-ignore
const fetchPosts = asyncHandler(async (req: Request, res: Response) => {
  const { page } = req.body;
  const pageNumber = page;

  const postsPerPage = 3;
  const offset = (pageNumber - 1) * postsPerPage;

  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      post_id: true,
      title: true,
      content: true,
      likes: true,
      College: {
        select: {
          name: true,
        },
      },
    },
    take: postsPerPage,
    skip: offset,
  });

  const totalPosts = await prisma.post.count();
  const isOver = offset + postsPerPage >= totalPosts;

  return res.status(200).json({ posts, isOver });
});

// @ts-ignore
const likePost = asyncHandler(async (req: Request, res: Response) => {
  const { postId } = req.body;
  // @ts-ignore
  const post = await prisma.post.findUnique({
    where: { post_id: postId },
    select: {
      likes: true,
    },
  });

  if (!post) {
    return res.status(404).json({ message: "Post not found" });
  }

  const likes = post.likes + 1;

  const updatedPost = await prisma.post.update({
    where: { post_id: postId },
    data: {
      likes,
    },
  });

  return res.status(200).json({ updatedPost });
});

export { getCommunities, createPost, fetchPosts, likePost };
