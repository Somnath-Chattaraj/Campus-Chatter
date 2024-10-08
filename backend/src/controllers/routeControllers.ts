import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

const searchRoom = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const userId = req.user.user_id;
    const rooms = await prisma.chatRoom.findMany({
        where: {
            users: {
                some: {user_id: userId}
            }
        },
        select: {
            id: true,
            users: {
                select: {
                    user_id: true,
                    username: true
                }
            }
        }
    });
    res.status(200).json(rooms);
});

export {searchRoom};