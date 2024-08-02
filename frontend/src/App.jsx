import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { chatRoomApi } from "./components/contexts/chatRoomApi";
import { RouterProvider } from "react-router-dom";
import Mainrouter from "./mainroute.jsx"

const App = ()=>{
  const [user1,setUser1] = useState("");
  const [user2,setUser2] = useState("");
  const [roomId,setRoomId] = useState("");
  return (
    <>
    <RouterProvider
    router = {Mainrouter}
    />
    </>
  )
}

export default App;