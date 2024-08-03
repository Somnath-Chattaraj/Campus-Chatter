import { createBrowserRouter, Navigate } from "react-router-dom";
import { Mainbuttons ,Createroom,Joinroom} from "../chatroomui/main";
import Chatroom from "../chatroomui/chatroom";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { chatRoomApi } from "../contexts/chatRoomApi";
import { useState } from "react";
import Header from "../Header";
import Discover from "../Discover";
import Services from "../Services";
import Explore from "../Explore";
import Testimonials from "../Testimonials";
import Footer from "../Footer";
import "../../styles.css"
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
const Header2 = ()=>{
  const navigate = useNavigate();
  return(
    <div>
      <Header />
      <Discover />
      <Services />
      <Explore />
      <Testimonials />
      <Footer />
    </div>
  )
}
const Mainrouter = createBrowserRouter([
  {
    path :"/",
    element:<Header2/>,
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