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
                const response = await axios.get('/user/all', { withCredentials: true });
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

    if (loading) return <div className="flex justify-center items-center h-screen text-xl text-gray-400">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center py-10">
            <div className="backdrop-blur-md bg-white/10 shadow-lg rounded-lg p-8 w-full max-w-3xl">
                <h2 className="text-2xl font-semibold text-gray-200 mb-6 text-center">Choose a User to Create a Room</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {users.map((user) => {
                        if (user.user_id === userDetails.user_id || user.username === null) return null;

                        return (
                            <div
                                key={user.user_id}
                                onClick={() => handleChange(user.user_id)}
                                className="flex items-center p-4 bg-white/20 rounded-lg shadow-md hover:bg-white/30 transition duration-200 cursor-pointer"
                            >
                                <div className="w-12 h-12 flex items-center justify-center bg-blue-500 text-white rounded-full text-lg font-bold mr-4">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="text-lg font-medium text-gray-200">{user.username}</div>
                            </div>
                        );
                    })}
                </div>
                {currentRoomId && (
                    <div className="mt-6 p-4 bg-green-900/30 text-green-400 rounded-lg">
                        <h3 className="text-lg font-semibold">Room created with ID: {currentRoomId}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export { Createroom1 };
