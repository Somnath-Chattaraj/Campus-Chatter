import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
