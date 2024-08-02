import React, { useEffect } from "react";
import {useNavigate} from "react-router-dom"
import { useContext } from "react";
import { chatRoomApi } from "../contexts/chatRoomApi";

function Createroom(){
  //@ts-ignore
  const {user1,setUser1,user2,setUser2,roomId,setRoomId} = useContext(chatRoomApi);
  const submit = ()=>{
    console.log(user1,"\n",user2)
  }
  return (
    <div>
      <input type="text" 
      value={user1}
      onChange={e=>setUser1(e.target.value)}
      placeholder="userid1"
      />
      <input type="text" 
      value={user2}
      onChange={e=>setUser2(e.target.value)}
      placeholder="userid2"
      />
      <button onClick={submit}>creatroom</button>
    </div>
  )
}

function Joinroom(){
  //@ts-ignore
  const {roomId,setRoomId,user1,setUser1} = useContext(chatRoomApi);
  const submit = ()=>{
  }
  return (
    <div>
      <input type="text" 
      value={roomId}
      onChange={e=>setRoomId(e.target.value)}
      placeholder="room Id"
      />
      <input type="text" 
      value={user1}
      onChange={e=>setUser1(e.target.value)}
      placeholder="user id"
      />
      <button onClick={submit}>creatroom</button>
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