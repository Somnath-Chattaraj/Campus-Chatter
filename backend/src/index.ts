import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRoutes from "./routes/userRoutes";

import moderationRouter from "./routes/mRuote";
import chatRoutes from "./routes/chatRoutes";

import reviewRoutes from "./routes/reviewRoutes";
import ratingRoutes from "./routes/ratingRoute";
import postsRoutes from "./routes/postsRoutes";
import roomRouter from "./routes/roomRoutes";

// import { getCommunities } from "./controllers/postController";

const app = express();
app.use(express.json());
const corsOptions = {
  origin: [
    "http://localhost:3001",
    "https://app-statuscode1.wedevelopers.online",
    "http://localhost:5173",
  ],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

app.use("/api/user", userRoutes);
//actual path (/api/admin/reviews/approve)
// body :-> {"content":"....."}
app.use("/api/admin", moderationRouter);

app.use("/api/review", reviewRoutes);
app.use("/api/rating", ratingRoutes);
app.use("/api/chat", chatRoutes); // Use the chat routes
app.use("/api/post", postsRoutes);
app.use('/api/room', roomRouter);
// app.get("/api/post/communities", getCommunities);
app.get('/api/logout', (req: Request, res: Response) => {
  res.clearCookie('Authorization').json({ message: 'Logged out successfully' });
});


app.get("/", (req: Request, res: Response) => {
  res.send("Backend is running");
});

app.listen(process.env.PORT, () => {
  console.log(`Server is listening on port ${process.env.PORT}`);
});
