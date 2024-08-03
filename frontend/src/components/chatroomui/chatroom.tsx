import React from "react";
import { chatRoomApi } from "../contexts/chatRoomApi";
import { useContext,useEffect, useState } from "react";
import useWebSocket from "react-use-websocket"
import { ReadyState } from "react-use-websocket";
import { Navigate } from "react-router-dom";
const Chatroom = ()=>{
  const { roomId,userId } = useContext(chatRoomApi);
  const [allMsg, setAllMsg] = useState([]);
  const [myMsg,setMyMsg] = useState("");
  //making the connections
  const { sendJsonMessage, lastMessage, lastJsonMessage, readyState } = useWebSocket('ws://localhost:8080')
  //initial query to join the room
  useEffect(() => {
    console.log(roomId);
    const tosend = {
      type: "joinRoom",
      data: {
        userId: userId,
        roomId: roomId,
      }
    }
    sendJsonMessage(tosend);
    return ()=>{

    }
  },[]);
  //checking on last message
  useEffect(() => {
    if (lastJsonMessage != null) {
      if (lastJsonMessage.type == "error") {
        alert("Room not connected...")
      }
      if (lastJsonMessage.type == "newMessage") {
        if(lastJsonMessage.data.roomId == roomId)
        {
          const data = lastJsonMessage.data.message;
          setAllMsg(prev => {
            return prev.concat(
              {
                senderId: data.senderId,
                message: data.content,
                at:data.timestamp,
              }
            );
          })
        }
      }
    }
  }, [lastJsonMessage])

  const constatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  const submit = ()=>{
    const tosend = {
    type:"sendMessage",
    data : {
        roomId:roomId,
        userId:userId,
        message:myMsg
    }}
    sendJsonMessage(tosend,true);
    setAllMsg(prev => {
      return prev.concat(
        {
          senderId: "you",
          message: tosend.data.message,
          at: Date().toString(),
        }
      );})
  }
  
  return (
    <div>
      <div>
        <h4>
          connection status {constatus}
          <div>
            room id : {roomId? roomId : "null"}
          </div>
        </h4>
      </div>
      <div>
        lastMessage:{JSON.stringify(lastJsonMessage)}
      </div>
      <div>
        <h1>Messages:</h1>
        {allMsg.length? allMsg.map((data,index)=>{
          return (
            <div id={index.toString()}>
              <div>senderId : <b>{data.senderId}</b></div>
              <div>massage: <b>{data.message}</b></div>
              <div>at : {data.at}</div>
            </div>
          )
        }):"no message"}
      </div>
      <div>
        <input type="text" placeholder="chat" value={myMsg} onChange={e=>setMyMsg(e.target.value)}/>
        <button onClick={submit}>send</button>
      </div>
    </div>
  )
}
export default Chatroom;