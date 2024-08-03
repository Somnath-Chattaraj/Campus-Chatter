import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


export const getChatHistory = async (req: Request, res: Response) => {
  const { roomId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: { chatRoomId: roomId },
      include: {
        sender: {
          select: { user_id: true, name: true }
        }
      },
      orderBy: { timestamp: 'asc' }
    });

    res.json(messages);
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
            name: true
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
          select: { user_id: true, name: true }
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
