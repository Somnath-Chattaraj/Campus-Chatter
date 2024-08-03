import { createBrowserRouter, Navigate } from "react-router-dom";
import { Mainbuttons ,Createroom,Joinroom} from "./components/chatroomui/main";
import Chatting from "./components/chatroomui/chatting";
import Joiningchat from "./components/chatroomui/joiningchat";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { chatRoomApi } from "./components/contexts/chatRoomApi";
import { useState } from "react";
const Test = () =>{
  const [userId, setUserId] = useState("clzcjoajo0000uwdjfgu4a0c9");
  const [roomId,setRoomId] = useState("f022be45-53d9-4fab-aea6-3e8b215a2cda");
  const [targetUserId, setTargetUserId] = useState("clzcjp30d0001uwdjgrx2sn5m");
  return (
    <>
    <chatRoomApi.Provider value={{userId,setUserId,targetUserId,setTargetUserId,roomId,setRoomId}}>
    <Outlet></Outlet>
    </chatRoomApi.Provider>
    </>
  )
}
const Header = ()=>{
  const navigate = useNavigate();
  return(
    <div>
      <h1>Welcome to you application</h1>
      <button onClick={()=>{
        navigate("/room");
      }}>room</button>
    </div>
  )
}
const Mainrouter = createBrowserRouter([
  {
    path :"/",
    element:<Header/>,
  },
  {
    path: "/room",
    element : <Test/>,
    children:[
      {
        path: "/room",
        element:  <Mainbuttons/> ,
        index:true,
      },
      {
        path: "/room/createroom",
        element:  <Createroom/> ,
      },
      {
        path: "/room/joinroom",
        element:  <Joinroom/> ,
      },
      {
        path: "/room/chatting",
        element:  <Joiningchat/> ,
      }
    ]
  }
]);
export default Mainrouter;