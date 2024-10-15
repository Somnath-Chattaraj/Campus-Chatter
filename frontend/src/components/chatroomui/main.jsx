import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { chatRoomApi } from "../contexts/chatRoomApi";
import axios from "axios";
import { useUser } from "../../hook/useUser";
import Loader from "../loading";
import { InfinitySpin } from "react-loader-spinner";
import { WEBSOCKET_URL } from "../../config";
import { Flex } from "@chakra-ui/react";

function Createroom() {
  //@ts-ignore
  const {
    userId,
    setUserId,
    targetUserId,
    setTargetUserId,
    roomId,
    setRoomId,
  } = useContext(chatRoomApi);
  const [users, setUsers] = useState([]);
  const { loadingUser, userDetails } = useUser();
  useEffect(() => {
    const user = axios.get("/api/user/all", {
      withCredentials: true,
    });
    setUsers(user);
  }, []);
  const [tempRoomId, setTempRoomId] = useState("");
  const navigate = useNavigate();
  const submit = () => {
    const socket = new WebSocket(WEBSOCKET_URL);
    // Connection opened
    socket.addEventListener("open", (event) => {
      socket.send(
        JSON.stringify({
          type: "createRoom",
          data: {
            userId: userId,
            targetUserId: targetUserId,
          },
        })
      );
    });

    // Listen for messages
    socket.addEventListener("message", (event) => {
      console.log("Message from server ", event.data);
      const data = JSON.parse(event.data);
      if (data.type == "roomJoined") {
        setTempRoomId(data.data.roomId);
      }
    });
  };
  return (
    <div>
      {/* <input
        type="text"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="userid1"
      />
      <input
        type="text"
        value={targetUserId}
        onChange={(e) => setTargetUserId(e.target.value)}
        placeholder="userid2"
      />
      <button onClick={submit}>creatroom</button>
      <div>
        {tempRoomId ? (
          <div>
            new room id : <b>{tempRoomId}</b>
          </div>
        ) : (
          ""
        )}
      </div> */}
      Choose from below users to create a Room
      <div>
        {users.map((user) => {
          return <div>{user}</div>;
        })}
      </div>
    </div>
  );
}

function Joinroom() {
  //@ts-ignore
  const { roomId, setRoomId, userId, setUserId } = useContext(chatRoomApi);
  const navigate = useNavigate();
  const submit = () => {
    navigate("/room/chatting");
  };
  return (
    <div>
      <div>
        roomid:
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="room Id"
        />
      </div>
      <div>
        userid:
        <input
          type="text"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="user id"
        />
      </div>
      <button onClick={submit}>Joinroom</button>
    </div>
  );
}

function Mainbuttons() {
  const navigate = useNavigate();
  const { loadingUser, userDetails } = useUser();

  const createroom = () => {
    console.log("creating the rooms");
    navigate("/room/createroom");
    console.log("here");
  };
  const joinroom = () => {
    navigate("/room/joinroom");
    console.log("joining the rooms");
  };
  if (loadingUser) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <InfinitySpin />
      </Flex>
    );
  }
  if (!loadingUser && !userDetails) {
    console.log(userDetails);
    return <Navigate to="/login" />;
  }
  return (
    <div className="min-h-screen flex flex-col mt-6 items-center justify-center bg-gray-900">
      <div className="space-x-4">
        <button
          onClick={createroom}
          className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Chat to new Users
        </button>
        <button
          onClick={joinroom}
          className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          Join Room
        </button>
      </div>
      <Outlet />
    </div>
  );
}

export { Mainbuttons, Createroom, Joinroom };
