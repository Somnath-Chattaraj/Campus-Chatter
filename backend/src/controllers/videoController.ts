import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import axios from "axios";
import prisma from "../lib/prisma";

export const createRoom = asyncHandler(async (req: Request, res: Response) => {
  //@ts-ignore
  const username = req.user.username;
  const video = await prisma.video.findUnique({
    where: {
      video_id: username,
    },
  });
  if (video) {
    res.status(205).json({ message: "Room already exists" });
    return;
  }
  const response = await axios.post(
    "https://api.daily.co/v1/rooms",
    {
      properties: { enable_chat: true, enable_screenshare: true },
      name: username,
    },
    { headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` } }
  );
  if (!response.data) {
    res.status(400);
    throw new Error("Invalid data");
  }
  const url = response.data.url;
  const video_id = response.data.name;
  //@ts-ignore
  const user_id = req.user.user_id;
  await prisma.video.create({
    data: {
      video_id,
      url,
      user_id,
    },
  });
  res.status(201).json(response.data);
});

export const deleteRoom = asyncHandler(async (req: Request, res: Response) => {
  const { video_id } = req.body;
  if (!video_id) {
    res.status(400);
    throw new Error("Invalid data");
  }
  const video = await prisma.video.findUnique({
    where: {
      video_id,
    },
    select: {
      user_id: true,
    },
  });
  //@ts-ignore
  const user_id = req.user.user_id;
  if (video?.user_id !== user_id) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  await axios.delete(`https://api.daily.co/v1/rooms/${video_id}`, {
    headers: { Authorization: `Bearer ${process.env.DAILY_API_KEY}` },
  });
  await prisma.video.delete({
    where: {
      video_id,
    },
  });
  res.status(200).json({ message: "Room deleted" });
});
