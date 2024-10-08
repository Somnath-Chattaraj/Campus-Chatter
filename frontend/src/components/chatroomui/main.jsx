import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { chatRoomApi } from "../contexts/chatRoomApi";
import axios from "axios";

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
  const [users,setUsers] = useState([]);
    useEffect(() => {
        const user = axios.get('/user/me', {
            withCredentials: true,
        })
        setUsers(user);
    }, []);
  const [tempRoomId, setTempRoomId] = useState("");
  const navigate = useNavigate();
  const submit = () => {
    const socket = new WebSocket("ws://localhost:8080");
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
                return (
                    <div>
                        {user}
                    </div>
                )
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
  const createroom = () => {
    console.log("creating the rooms");
    navigate("/room/createroom");
    console.log("here");
  };
  const joinroom = () => {
    navigate("/room/joinroom");
    console.log("joining the rooms");
  };
  return (
    <div>
      <button onClick={createroom}>createroom</button>
      <button onClick={joinroom}>joinroom</button>
      <Outlet />
    </div>
  );
}

export { Mainbuttons, Createroom, Joinroom };
