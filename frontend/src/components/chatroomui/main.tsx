import React from "react";
import { useState } from "react";

function createroom(){
  let [user1, setuser1] = useState("");
  let [user2, setuser2] = useState("");
  return (
    <div>
      <input type="text" 
      value={user1}
      onChange={e=>setuser1(e.target.value)}
      />
      <input type="text" 
      value={user2}
      onChange={e=>setuser2(e.target.value)}
      />
    </div>
  )
}

function Mainbuttons(){
  const createroom = ()=>{
    console.log("creating the rooms");
  };
  const joinroom = ()=>{
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

export default Mainbuttons;