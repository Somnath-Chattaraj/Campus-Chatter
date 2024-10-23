import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getCachedData, setCachedData } from '../lib/redis';

const prisma = new PrismaClient();


export const getChatHistory = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const cacheKey = `search:${roomId}`;
  const cachedResults = await getCachedData(cacheKey);
  if (cachedResults) {
    return res.status(200).json(JSON.parse(cachedResults));
  }
    const messages = await prisma.message.findMany({
      where: { chatRoomId: roomId },
      include: {
        sender: {
          select: { user_id: true, username: true }
        }
      },
      orderBy: { timestamp: 'asc' }
    });
    const messageFormat = messages.map((message : any) => ({
      senderId: message.sender.user_id,
      message: message.content,
      at: message.timestamp,
    }));
    await setCachedData(cacheKey, JSON.stringify(messageFormat), 3600);
    res.json(messageFormat);
    
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
};

export const listChatRooms = async (req: Request, res: Response) => {

  // @ts-ignore
  const userId = req.body;

  try {
    const chatRooms = await prisma.chatRoom.findMany({
      where: {
        users: {
          some: { user_id: userId }
        }
      },
      select: {
        id: true, // roomId
        users: {
          select: {
            user_id: true,
            username: true
          }
        }
      }
    });

    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat rooms' });
  }
};

export const getChatRoomDetails = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        users: {
          select: { user_id: true, username: true }
        }
      }
    });

    if (chatRoom) {
      res.json(chatRoom);
    } else {
      res.status(404).json({ error: 'Chat room not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve chat room details' });
  }
};
