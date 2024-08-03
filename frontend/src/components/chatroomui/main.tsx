import React, { useEffect } from "react";
import {useNavigate} from "react-router-dom"
import { useContext } from "react";
import { chatRoomApi } from "../contexts/chatRoomApi";

function Createroom(){
  //@ts-ignore
  const {userId,setUserId,targetUserId,setTargetUserId,roomId,setRoomId} = useContext(chatRoomApi);
  const navigate = useNavigate();
  const submit = ()=>{
    navigate("/room/chatting");
  }
  return (
    <div>
      <input type="text" 
      value={userId}
      onChange={e=>setUserId(e.target.value)}
      placeholder="userid1"
      />
      <input type="text" 
      value={targetUserId}
      onChange={e=>setTargetUserId(e.target.value)}
      placeholder="userid2"
      />
      <button onClick={submit}>creatroom</button>
    </div>
  )
}

function Joinroom(){
  //@ts-ignore
  const {roomId,setRoomId,userId,setUserId} = useContext(chatRoomApi);
  const navigate = useNavigate ();
  const submit = ()=>{
    navigate("/room/chatting");
  }
  return (
    <div>
      <div>
        roomid:
      <input type="text" 
      value={roomId}
      onChange={e=>setRoomId(e.target.value)}
      placeholder="room Id"
      />
      </div>
      <div>
        userid:
      <input type="text" 
      value={userId}
      onChange={e=>setUserId(e.target.value)}
      placeholder="user id"
      />
      </div>
      <button onClick={submit}>Joinroom</button>
    </div>
  )
}

function Mainbuttons(){
  const navigate = useNavigate();
  const createroom = ()=>{
    console.log("creating the rooms");
    navigate("/room/createroom");
    console.log("here")
  };
  const joinroom = ()=>{
    navigate("/room/joinroom")
    console.log("joining the rooms");
  };
  return (
    <div>
      <button  onClick={createroom}>
        createroom
      </button>
      <button  onClick={joinroom}>
        joinroom
      </button>
    </div>
  )
}

export  {Mainbuttons,Createroom,Joinroom};