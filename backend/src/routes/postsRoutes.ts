import express from "express";
import {
  getCommunities,
  createPost,
  fetchPosts,
  likePost,
} from "../controllers/postController";
import checkAuth from "../middleware/checkAuth";

const postsRoutes = express.Router();

postsRoutes.get("/communities", checkAuth, getCommunities);
postsRoutes.post("/create", checkAuth, createPost);
postsRoutes.post("/fetch", checkAuth, fetchPosts);
postsRoutes.post("/like", checkAuth, likePost);

export default postsRoutes;
