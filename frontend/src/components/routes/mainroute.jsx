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
import EditDetails from "../EditDetails";

import Loader from "../loading";
import AddUsername from "../AddUsername";
import { Createroom1 } from "../chatroomui/createRoom1";
import { JoinRoom1 } from "../chatroomui/joinRoom1";
import { Header } from "../homePage/HomePage";
import Navbar from "../MainNavbar";
import Logout from "../Logout";
import ForgetPassword from "../forgotPassword/ForgetPassword";
import NotFound from "../NotFound";

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
  { path: "/homepage", element: <Header /> },
  {
    path: "/",
    element: <Navbar btnName="sign up" display={true} navigateUrl="/signup" />,
    children: [
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "forgetPassword",
        element: <ForgetPassword />,
      },
    ],
  },
  {
    path: "/",
    element: <Navbar btnName="Sign up" display={true} navigateUrl="/signup" />,
    children: [
      {
        path: "logout",
        element: <Logout />,
      },
    ],
  },
  {
    path: "/",
    element: <Navbar btnName="Login" display={true} navigateUrl="/login" />,
    children: [
      {
        path: "signup",
        element: <Register />,
      },
    ],
  },
  {
    path: "/",
    element: <Navbar btnName="Logout" navigateUrl="/logout" display={true} />,
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
        path: "/edit",
        element: <EditDetails />,
      },
      {
        path: "room",
        element: <Mainbuttons />,
        children: [
          {
            path: "createroom",
            element: <Createroom1 />,
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
  {
    path: "*", // Catch-all route for undefined paths
    element: <NotFound />, // Render the NotFound component
  },
]);

export default Mainrouter;
