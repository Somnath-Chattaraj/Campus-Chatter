import { createBrowserRouter } from "react-router-dom";
import { Mainbuttons, Joinroom, Createroom } from "../chatroomui/main";

import Chatroom from "../chatroomui/chatroom";
import { Outlet } from "react-router-dom";
import { chatRoomApi } from "../contexts/chatRoomApi";
import { useState } from "react";
import Posts from "../../components/Posts";

import Register from "../Register";
import SinglePost from "../../components/SinglePost";
import LoginPage from "../Login";
import AddDetails from "../AddDetails";
import Navbar from "../MainNavbar";
import Loader from "../loading";
import AddUsername from "../AddUsername";
import { Createroom1 } from "../chatroomui/createRoom1";
import { JoinRoom1 } from "../chatroomui/joinRoom1";
import { Header } from "../homePage/HomePage";

const Test = () => {
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [targetUserId, setTargetUserId] = useState("");

  return (
    <chatRoomApi.Provider
      value={{
        userId,
        setUserId,
        targetUserId,
        setTargetUserId,
        roomId,
        setRoomId,
      }}
    >
      <Outlet />
    </chatRoomApi.Provider>
  );
};

const Mainrouter = createBrowserRouter([
  {path : '/homepage',
  element : <Header />
  }, {

    path: "/",
    element: <Navbar />,
    children: [
      
      {
        path: "posts",
        element: <Posts />,
      },
      {
        path: "posts/:id",
        element: <SinglePost />,
      },
      {
        path: "/addDetails/:id",
        element: <AddDetails />,
      },
      {
        path: "/addusername/:id",
        element: <AddUsername />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "signup",
        element: <Register />,
      },
      {
        path: "room",
        element: <Mainbuttons />,
        // index: true, was causing error
        children: [
          {
            path: "createroom",
            element: <Createroom1 />
          },
          {
            path: "joinroom",
            element: <JoinRoom1 />,
          },
          {
            path: "chatting",
            element: <Chatroom />,
          },
        ],
      },
    ],
  },
]);

export default Mainrouter;
