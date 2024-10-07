import { createBrowserRouter } from "react-router-dom";
import { Mainbuttons, Createroom, Joinroom } from "../chatroomui/main";
import Chatroom from "../chatroomui/chatroom";
import { Outlet } from "react-router-dom";
import { chatRoomApi } from "../contexts/chatRoomApi";
import { useState } from "react";
import Posts from "../../components/Posts";
import HomePage from "../../pages/HomePage";
import Register from "../Register";
import SinglePost from "../../components/SinglePost";
import LoginPage from "../Login";
import AddDetails from "../AddDetails";
import Navbar from "../MainNavbar";
import Loader from "../loading";

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
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/posts",
    element: <Posts />,
  },
  {
    path: "/posts/:id",
    element: <SinglePost />,
  },
  {
    path: "/addDetails/:id",
    element: <AddDetails />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <Register />,
  },
  {
    path: "/room",
    element: <Test />,
    children: [
      {
        element: <Navbar />,
        children: [
          {
            path: "homepage",
            element: <HomePage />,
          },
          {
            path: "posts",
            element: <Posts />,
          },
          {
            path: "posts/:id",
            element: <SinglePost />,
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
            index: true,
          },
          {
            path: "room/createroom",
            element: <Createroom />,
          },
          {
            path: "room/joinroom",
            element: <Joinroom />,
          },
          {
            path: "room/chatting",
            element: <Chatroom />,
          },
        ],
      },
    ],
  },
]);

export default Mainrouter;
