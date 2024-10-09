import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../hook/useUser';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';

const JoinRoom1 = () => {
  const { loading, userDetails } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  const [room_id, setRoomId] = useState('');
  const [updateArray, setUpdateArray] = useState([]);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const response = await axios.get('/api/room', {
          withCredentials: true,
        });
        console.log(response.data);
        setUpdateArray(response.data); // Assuming the response is structured correctly
      } catch (error) {
        console.error('Error fetching chat rooms:', error);
      }
    };

    fetchChatRooms();
  }, []); // Adding dependency array to avoid infinite re-rendering

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );
  }

  if (!userDetails || !Array.isArray(userDetails.chatRooms)) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        No chat rooms available.
      </div>
    );
  }

  function handleClick(roomId) {
    localStorage.removeItem('roomId');
    localStorage.removeItem('userId');
    localStorage.setItem('userId', userDetails.user_id);
    localStorage.setItem('roomId', roomId);
    toast({
      title: 'Room Joined Successfully.',
      description: 'You are being redirected to the chatroom.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    navigate('/room/chatting');
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center">
  <div className="bg-gray-300 shadow-lg rounded-lg p-8 w-full max-w-md">
    <h1 className='text-3xl font-bold my-3 text-black text-center'>Hey {userDetails.username}</h1>
    <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
      Your Chat Rooms
    </h2>
    <div className="space-y-4">
      {updateArray.length > 0 ? (
        updateArray.map((room) => (
          <div
            key={room.roomId}
            onClick={() => handleClick(room.roomId)}
            className="cursor-pointer bg-blue-500 text-white p-3 rounded-lg text-center hover:bg-blue-600 transition duration-200"
          >
            <div className="text-sm text-gray-200">
              {room.usernames.length > 0 ? (
                room.usernames.map((username, index) => (
                  <div key={index} className="flex items-center justify-center space-x-2">

                    <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-full text-white font-bold">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <span className='text-2xl font-bold'>{username}</span>
                  </div>
                ))
              ) : (
                <div>No other users in this room</div>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-gray-600">
          No chat rooms found. Create one to join.
        </div>
      )}
    </div>
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Join Another Room
      </h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={room_id}
        onChange={(e) => setRoomId(e.target.value)}
        className="w-full border border-gray-300 text-black rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => handleClick(room_id)}
        className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition duration-200"
      >
        Join Room
      </button>
    </div>
  </div>
</div>

  );
};

export { JoinRoom1 };
