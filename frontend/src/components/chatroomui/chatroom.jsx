import React, { useEffect, useRef, useState } from "react";
import useWebSocket from "react-use-websocket";
import { ReadyState } from "react-use-websocket";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useUser } from "../../hook/useUser";
import { WEBSOCKET_URL } from "../../config";
import {useToast} from "@chakra-ui/react";

const Chatroom = () => {
  const userId = localStorage.getItem("userId");
  const roomId = localStorage.getItem("roomId");
  const [allMsg, setAllMsg] = useState([]);
  const [prevMsg, setPrevMsg] = useState([]);
  const [myMsg, setMyMsg] = useState("");
  const messageEndRef = useRef(null);
  const [userLookup, setUserLookup] = useState({});
  const { loadingUser, userDeatils } = useUser();

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    WEBSOCKET_URL
  );
  const toast = useToast();

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get(`/api/chat/history/${roomId}`, {
          withCredentials: true,
        });
        setPrevMsg(response.data);

        const roomDetails = await axios.get(`/api/chat/rooms/${roomId}`, {
          withCredentials: true,
        });
        const users = roomDetails.data.users;

        const lookup = users.reduce((acc, user) => {
          acc[user.user_id] = user.username;
          return acc;
        }, {});
        setUserLookup(lookup);

        sendJsonMessage({
          type: "joinRoom",
          data: { userId, roomId },
        });
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };

    fetchChatHistory();
  }, [roomId, userId, sendJsonMessage]);

  // Handle incoming messages from WebSocket
  useEffect(() => {
    if (lastJsonMessage !== null) {
      if (lastJsonMessage.type === "error") {
        alert("Room not connected...");
      } else if (
        lastJsonMessage.type === "newMessage" &&
        lastJsonMessage.data.roomId === roomId
      ) {
        const data = lastJsonMessage.data.message;

        // Only add message if it is from another user (to prevent duplicates)
        if (data.senderId !== userId) {
          setAllMsg((prev) => [
            ...prev,
            {
              senderId: data.senderId,
              message: data.content,
              at: data.timestamp,
            },
          ]);
        }
      }
    }
  }, [lastJsonMessage, roomId, userId]);

  // Auto-scroll to the bottom when messages update
  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [allMsg]);

  useEffect(() => {
    if (readyState === ReadyState.CLOSED) {
      toast({
        title: "Connection Lost",
        description: "WebSocket connection has been closed. Please refresh the page.",
        status: "error",
        duration: null,
        isClosable: true,
      });
      // alert("WebSocket connection has been closed. Please refresh the page.");
    }
  }, [readyState, toast]);

  if (loadingUser) {
    return <div>Loading...</div>;
  }

  const submit = () => {
    const messageData = {
      type: "sendMessage",
      data: { roomId, userId, message: myMsg },
    };
    sendJsonMessage(messageData);

    // Add message to local state immediately without waiting for WebSocket confirmation
    setAllMsg((prev) => [
      ...prev,
      {
        senderId: userId,
        message: myMsg,
        at: new Date().toISOString(),
      },
    ]);
    setMyMsg("");
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date);
  };

  const constatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const combinedMessages = [...prevMsg, ...allMsg].sort(
    (a, b) => new Date(a.at) - new Date(b.at)
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 to-black p-4 text-white">
      <div className="max-w-4xl mx-auto w-full flex-grow flex flex-col bg-slate-950/90 rounded-3xl shadow-2xl p-6 space-y-6 transition-all">
        <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
          <h4 className="text-emerald-300 text-lg font-bold px-4">
            Connection Status:{" "}
            <span
              className={`font-semibold ${
                constatus === "Closed" ? "text-red-400 animate-pulse" : ""
              }`}
            >
              {constatus}
            </span>
          </h4>
          <div className="text-gray-300 text-sm">
            Room ID: <span className="font-semibold">{roomId || "null"}</span>
          </div>
        </div>

        <div className="flex-grow overflow-y-auto p-4 bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-xl shadow-inner space-y-6 scrollbar-thin scrollbar-thumb-gray-700">
          {combinedMessages.length ? (
            combinedMessages.map((data, index) => (
              <div
                key={index}
                className={`flex ${
                  data.senderId === userId ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`relative p-5 rounded-2xl shadow-lg transition-transform duration-300 transform ${
                    data.senderId === userId
                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600"
                      : "bg-gradient-to-r from-gray-700 to-gray-800"
                  } max-w-sm hover:scale-105 border border-gray-600`}
                >
                  <div
                    className={`absolute top-1 right-1 px-2 py-1 rounded-full text-xs font-medium tracking-wider ${
                      data.senderId === userId
                        ? "bg-emerald-700 text-emerald-100"
                        : "bg-gray-600 text-gray-200"
                    }`}
                  >
                    {data.senderId === userId ? "You" : userLookup[data.senderId] || data.senderId}
                  </div>

                  <div className="text-lg mt-4 font-bold text-white mb-2">
                    {data.message}
                  </div>

                  <div className="text-sm text-slate-300 italic">
                    Sent at: {formatDate(data.at)}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-center">No messages yet</div>
          )}
          <div ref={messageEndRef}></div>
        </div>

        <div className="mt-4 flex space-x-3 items-center">
          <input
            type="text"
            placeholder="Type your message..."
            value={myMsg}
            onChange={(e) => setMyMsg(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className="flex-1 p-3 rounded-full bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-all"
          />
          <button
            onClick={submit}
            className="bg-emerald-500 text-white p-3 rounded-full shadow-lg font-semibold hover:bg-emerald-400 transition-colors active:scale-95"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
