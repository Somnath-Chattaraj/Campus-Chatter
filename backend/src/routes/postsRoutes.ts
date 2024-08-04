import express from "express";
import {
  getCommunities,
  createPost,
  fetchPosts,
} from "../controllers/postController";
import checkAuth from "../middleware/checkAuth";

const postsRoutes = express.Router();

postsRoutes.get("/communities", checkAuth, getCommunities);
postsRoutes.post("/create", checkAuth, createPost);
postsRoutes.get("/fetch", checkAuth, fetchPosts);

export default postsRoutes;
