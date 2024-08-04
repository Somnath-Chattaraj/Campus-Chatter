import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:3000/api";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
