import { chatRoomApi } from "../contexts/chatRoomApi";
import { useContext,useEffect, useState } from "react";
import useWebSocket from "react-use-websocket"
import { ReadyState } from "react-use-websocket";
const Chatting = ()=>{
  const { roomId,setRoomId, userId, targetUserId } = useContext(chatRoomApi);
  const { sendJsonMessage, lastMessage, lastJsonMessage, readyState } = useWebSocket('ws://localhost:8080')
  const [allMsg, setAllMsg] = useState(["no messages yet"]);
  const [curMsg,setCurMsg] = useState("");
  const test = {
    type: "createRoom",
    data: {
      userId: userId,
      targetUserId: targetUserId
    }
  }
  useEffect(() => {
    sendJsonMessage(test);
  },[]);
  useEffect(()=>{
    if(lastJsonMessage != null){
      if (lastJsonMessage.type == "roomJoined") {
        setRoomId(lastJsonMessage.data.roomId);
        console.log(lastJsonMessage.data.roomId);
      }
      else {
        setAllMsg(prev => {
          return prev.concat(lastJsonMessage);
        })
      }
    }
  },[lastJsonMessage])

  const constatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];
  const submit = ()=>{
    const tosend = {
      type: "sendMessage",
      data :{
        roomid:roomId,
        userId:userId,
        message:curMsg
      }
    }
    console.log(tosend)
    sendJsonMessage(tosend);
  }
  
  return (
    <div>
      <div>
        connection status {constatus}
      </div>
      <div>
      </div>
      <div>
        room id : {roomId? roomId : "nothing to show"}
      </div>
      <div>
        {/* msgs : {allMsg.length?allMsg.map((val,index)=>{
          return <span id={index}>{val}</span>
        }):"test"} */}
        {JSON.stringify(lastJsonMessage)}
      </div>
      <div>
        <input type="text" placeholder="chat" value={curMsg} onChange={e=>setCurMsg(e.target.value)}/>
        <button onClick={submit}>sumbit</button>
      </div>
    </div>
  )
}
export default Chatting;