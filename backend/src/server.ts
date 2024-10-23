import WebSocket, { Server } from 'ws';
import { PrismaClient } from '@prisma/client';
import sendMail from './mail/sendMail';

const prisma = new PrismaClient();
const wss = new Server({ port: 8080 });
let clientCount = 0;

const clientRoomMap = new Map<WebSocket, Set<number>>(); // WebSocket -> Set of room IDs

wss.on('connection', (ws) => {
  const clientId = ++clientCount; // Increment and get the client ID
  console.log(`Client${clientId} connected`);
  const user = [];

  clientRoomMap.set(ws, new Set());

  ws.on('message', async (message) => {
    const { type, data } = JSON.parse(message.toString()); // data will contain roomId, userId, targetUserId, and message
    // type will contain 'createRoom', 'joinRoom', 'sendMessage'
    const roomId = data.roomId;

    
    switch (type) {
      case 'createRoom':
        try {
          // Create a new chat room
          const newRoom = await prisma.chatRoom.create({
            data: {
              users: {
                connect: [{ user_id: data.userId }, { user_id: data.targetUserId }]
              }
            }
          });

          // Update client-room mapping for new room
          // @ts-ignore: clientRoomMap is a Map<WebSocket, Set<number>>
          clientRoomMap.get(ws)?.add(newRoom.id);
          ws.send(JSON.stringify({ type: 'roomCreated', data: { roomId: newRoom.id } }));
        } catch (error) {
          ws.send(JSON.stringify({ type: 'error', data: { message: 'Failed to create or join chat room' } }));
        }
        break;

      case 'joinRoom':
        try {
          await prisma.chatRoom.update({
            where: { id: data.roomId },
            data: {
              users: {
                connect: [{ user_id: data.userId }]
              }
            }
          });

          // Update client-room mapping for the joined room
          const rooms = clientRoomMap.get(ws);
          rooms?.add(data.roomId);
          ws.send(JSON.stringify({ type: 'roomJoined', data: { roomId: data.roomId } }));

          // Notify other clients in the room about the new join
          wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN && client !== ws) {
              const clientRooms = clientRoomMap.get(client);
              if (clientRooms?.has(data.roomId)) {
                client.send(JSON.stringify({ type: 'newClientJoined', data: { roomId: data.roomId, message: `Client${clientId} joined` } }));
              }
            }
          });
        } catch (error) {
          ws.send(JSON.stringify({ type: 'error', data: { message: 'Failed to join chat room' } }));
        }
        break;

        case 'sendMessage':
  try {
    const chatRoom = await prisma.chatRoom.findUnique({
      where: { id: roomId },
      include: {
        users: {
          select: { user_id: true, username: true, email: true } // Ensure to fetch email
        }
      }
    });

    if (!chatRoom) {
      ws.send(JSON.stringify({ type: 'error', data: { message: 'Chat room not found' } }));
      return;
    }

    const newMessage = await prisma.message.create({
      data: {
        content: data.message,
        sender: { connect: { user_id: data.userId } },
        chatRoom: { connect: { id: data.roomId } },
      }
    });

    // Broadcast the message to all clients in the room
    wss.clients.forEach(client => {
      const rooms = clientRoomMap.get(client);
      if (client.readyState === WebSocket.OPEN && rooms?.has(data.roomId)) {
        client.send(JSON.stringify({ type: 'newMessage', data: { roomId: data.roomId, message: newMessage } }));
      }
    });

    // Send email to disconnected users
    chatRoom.users.forEach(user => {
      const isUserConnected = [...wss.clients].some(
        client => clientRoomMap.get(client)?.has(data.roomId) && client.readyState === WebSocket.OPEN && user.user_id === data.userId
      );

      // Send email only to disconnected users and exclude the sender
      if (!isUserConnected && user.user_id !== data.userId) {
        const htmlContent = `
          <html>
            <head>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  background-color: #f4f4f4;
                  margin: 0;
                  padding: 20px;
                }
                .container {
                  max-width: 600px;
                  margin: auto;
                  background: #ffffff;
                  border-radius: 8px;
                  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  padding: 20px;
                }
                h1 {
                  color: #333;
                }
                p {
                  font-size: 16px;
                  line-height: 1.5;
                  color: #555;
                }
                a {
                  color: #007BFF;
                  text-decoration: none;
                  font-weight: bold;
                }
                .footer {
                  margin-top: 20px;
                  font-size: 12px;
                  color: #888;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>New Message in Chat Room ${data.roomId}</h1>
                <p>You've received a new message in chat room <strong>${data.roomId}</strong>.</p>
                <p>Click the link below and enter the room id to view the message:</p>
                <p><a href="https://www.campusify.site/room/joinroom">Join Room</a></p>
                <p class="footer">Thank you for using our service!</p>
              </div>
            </body>
          </html>
        `;

        console.log('Sending email to', user.email);
        sendMail(htmlContent, user.email, "Message notification");
      }
    });
  } catch (error) {
    ws.send(JSON.stringify({ type: 'error', data: { message: 'Failed to send message' } }));
  }
  break;
      default:
        ws.send(JSON.stringify({ type: 'error', data: { message: 'Invalid message type' } }));
        break;
    }
    
  });

  ws.on('close', () => {
    console.log(`Client${clientId} disconnected`);

    // Retrieve the rooms the client was part of
    const rooms = clientRoomMap.get(ws);
    if (rooms) {
      rooms.forEach(roomId => {
        // Broadcast the disconnect message to all clients in the room
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN && client !== ws) {
            const clientRooms = clientRoomMap.get(client);
            if (clientRooms?.has(roomId)) {
              client.send(JSON.stringify({ type: 'clientDisconnected', data: { roomId, message: `Client${clientId} disconnected` } }));
            }
          }
        });
      });
    }

    // Remove client from all rooms
    clientRoomMap.delete(ws);
  });
});

export default wss;
