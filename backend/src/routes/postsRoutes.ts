import express from "express";
import {
  getCommunities,
  createPost,
  fetchPosts,
  likePost,
  fetchSinglePost,
  createComment,
  postLiked,
  unlikePost,
  searchPosts,
  getAllCommunities,
  deleteComment,
  deletePost,
} from "../controllers/postController";
import checkAuth from "../middleware/checkAuth";
import rateLimiter from "../middleware/rateLimit";

const postsRoutes = express.Router();

postsRoutes.get("/communities", checkAuth, rateLimiter, getCommunities);
postsRoutes.post("/create", checkAuth, rateLimiter, createPost);
postsRoutes.post("/fetch", checkAuth, rateLimiter, fetchPosts);
postsRoutes.post("/like", checkAuth, rateLimiter, likePost);
postsRoutes.get("/fetch/:id", checkAuth, rateLimiter, fetchSinglePost);
postsRoutes.post("/comment", checkAuth, rateLimiter, createComment);
postsRoutes.post("/liked", checkAuth, rateLimiter, postLiked);
postsRoutes.post("/unlike", checkAuth, rateLimiter, unlikePost);
postsRoutes.post("/search", checkAuth, rateLimiter, searchPosts);
postsRoutes.get("/allcommunities", checkAuth, rateLimiter, getAllCommunities);
postsRoutes.post("/deletecomment", checkAuth, rateLimiter, deleteComment);
postsRoutes.post("/deletepost", checkAuth, rateLimiter, deletePost);

export default postsRoutes;
