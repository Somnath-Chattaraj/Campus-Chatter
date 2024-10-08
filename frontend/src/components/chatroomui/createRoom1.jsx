import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hook/useUser';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const Createroom1 = () => {
    const [users, setUsers] = useState([]);
    const { loading, userDetails } = useUser();
    const [socket, setSocket] = useState(null); 
    const [currentRoomId, setCurrentRoomId] = useState(null); 
    const navigate = useNavigate();
    const toast = useToast();
    useEffect(() => {

        localStorage.removeItem("roomId");
        localStorage.removeItem("userId");


        const fetchUsers = async () => {
            try {
                const response = await axios.get('/user/all', {
                    withCredentials: true,
                });
                setUsers(response.data); 
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();


        const newSocket = new WebSocket("ws://localhost:8080");
        setSocket(newSocket);


        newSocket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            console.log("Message from server:", data);

            switch (data.type) {
                case 'roomCreated':
                    console.log("Room Created:", data.data.roomId);
                    setCurrentRoomId(data.data.roomId); 

                    localStorage.setItem("roomId", data.data.roomId);
                    localStorage.setItem("userId", userDetails.user_id);
                    break;
                case 'roomJoined':
                    console.log("Joined Room:", data.data.roomId);
                    setCurrentRoomId(data.data.roomId); 

                    localStorage.setItem("roomId", data.data.roomId);
                    localStorage.setItem("userId", userDetails.user_id);
                    break;
                case 'newMessage':
                    console.log("New Message:", data.data.message);

                    break;
                case 'newClientJoined':
                    console.log(data.data.message);
                    break;
                case 'clientDisconnected':
                    console.log(data.data.message);
                    break;
                default:
                    console.error("Unknown message type:", data.type);
            }
        });


        return () => {
            newSocket.close();
        };
    }, [userDetails?.user_id]); 


    const handleChange = async (targetUserId) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected.");
            return;
        }

        await socket.send(
            JSON.stringify({
                type: "createRoom",
                data: {
                    userId: userDetails.user_id,
                    targetUserId,
                },
            })
        );
        console.log("Room creation request sent to server.");
    };
    if (currentRoomId) {
        toast({
            title: "Room Creation Successful.",
            description: "You are being redirected to chatroom.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
        navigate('/room/chatting');
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Choose from below users to create a Room</h2>
            <div>
                {users.map((user) => {

                    if (user.user_id === userDetails.user_id) return null;

                    return (
                        <div
                            key={user.user_id}
                            onClick={() => handleChange(user.user_id)}
                            className="cursor-pointer hover:bg-gray-200 p-2"
                        >
                            {user.user_id}
                        </div>
                    );
                })}
            </div>
            {currentRoomId && (
                <div>
                    <h3>Room created with ID: {currentRoomId}</h3>

                </div>
                
            )}
        </div>
    );
};

export { Createroom1 };
