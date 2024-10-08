"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
require("dotenv/config");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const mRuote_1 = __importDefault(require("./routes/mRuote"));
const chatRoutes_1 = __importDefault(require("./routes/chatRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const ratingRoute_1 = __importDefault(require("./routes/ratingRoute"));
const postsRoutes_1 = __importDefault(require("./routes/postsRoutes"));
const roomRoutes_1 = __importDefault(require("./routes/roomRoutes"));
// import { getCommunities } from "./controllers/postController";
const app = (0, express_1.default)();
app.use(express_1.default.json());
const corsOptions = {
    origin: [
        "http://localhost:3001",
        "https://app-statuscode1.wedevelopers.online",
        "http://localhost:5173",
    ],
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use("/api/user", userRoutes_1.default);
//actual path (/api/admin/reviews/approve)
// body :-> {"content":"....."}
app.use("/api/admin", mRuote_1.default);
app.use("/api/review", reviewRoutes_1.default);
app.use("/api/rating", ratingRoute_1.default);
app.use("/api/chat", chatRoutes_1.default); // Use the chat routes
app.use("/api/post", postsRoutes_1.default);
app.use('/api/room', roomRoutes_1.default);
// app.get("/api/post/communities", getCommunities);
app.get("/", (req, res) => {
    res.send("Backend is running");
});
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});
