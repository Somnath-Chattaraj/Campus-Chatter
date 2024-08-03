import { createBrowserRouter, Navigate } from "react-router-dom";
import { Mainbuttons ,Createroom,Joinroom} from "../chatroomui/main";
import Chatroom from "../chatroomui/chatroom";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { chatRoomApi } from "../contexts/chatRoomApi";
import { useState } from "react";
const Test = () =>{
  const [userId, setUserId] = useState("");
  const [roomId,setRoomId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");
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
        element:  <Chatroom/> ,
      }
    ]
  }
]);
export default Mainrouter;