import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import prisma from "../lib/prisma";

const searchRoom = asyncHandler(async (req: Request, res: Response) => {
    // @ts-ignore
    const user_id = req.user.user_id;
    const rooms = await prisma.chatRoom.findMany({
        
        select : {
            id : true,
            users: {
                select: {
                    user_id: true,
                    username: true
                }
            }
        }
    });
    const updateArray = rooms.map((room : any) => {
        const otherUsers = room.users.filter((user : any) => user.user_id != user_id);
        return {
          roomId: room.id,
          usernames: otherUsers.map((user : any) => user.username)
        };
      });
    

    res.status(200).json(
       updateArray
    );
});

export {searchRoom};