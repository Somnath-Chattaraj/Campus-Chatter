import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hook/useUser';

const Createroom1 = () => {
    const [users, setUsers] = useState([]);
    const { loading, userDetails } = useUser();
    const [socket, setSocket] = useState(null); // Manage the socket connection
    const [currentRoomId, setCurrentRoomId] = useState(null); // Store the room ID if created

    
    useEffect(() => {
        // Clear previous room and user IDs from localStorage
        localStorage.removeItem("roomId");
        localStorage.removeItem("userId");

        // Fetch users
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/user/all', {
                    withCredentials: true,
                });
                setUsers(response.data); // Set users state to the data received
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();

        // Create WebSocket connection
        const newSocket = new WebSocket("ws://localhost:8080");
        setSocket(newSocket);

        // WebSocket message listener
        newSocket.addEventListener("message", (event) => {
            const data = JSON.parse(event.data);
            console.log("Message from server:", data);

            switch (data.type) {
                case 'roomCreated':
                    console.log("Room Created:", data.data.roomId);
                    setCurrentRoomId(data.data.roomId); // Store room ID
                    // Clear old values and set new ones
                    localStorage.setItem("roomId", data.data.roomId);
                    localStorage.setItem("userId", userDetails.user_id);
                    break;
                case 'roomJoined':
                    console.log("Joined Room:", data.data.roomId);
                    setCurrentRoomId(data.data.roomId); // Store room ID if joined
                    // Clear old values and set new ones
                    localStorage.setItem("roomId", data.data.roomId);
                    localStorage.setItem("userId", userDetails.user_id);
                    break;
                case 'newMessage':
                    console.log("New Message:", data.data.message);
                    // Handle new message (can store messages in state and display them)
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

        // Clean up WebSocket connection on component unmount
        return () => {
            newSocket.close();
        };
    }, [userDetails?.user_id]); // Dependency array ensures WebSocket connection is only created when userDetails is available

    // Handle room creation
    const handleChange = (targetUserId) => {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket is not connected.");
            return;
        }

        socket.send(
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

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <h2>Choose from below users to create a Room</h2>
            <div>
                {users.map((user) => {
                    // Prevent the current user from being selectable
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
                    {/* Further code to display room info or chat */}
                </div>
            )}
        </div>
    );
};

export { Createroom1 };
