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

const postsRoutes = express.Router();

postsRoutes.get("/communities", checkAuth, getCommunities);
postsRoutes.post("/create", checkAuth, createPost);
postsRoutes.post("/fetch", checkAuth, fetchPosts);
postsRoutes.post("/like", checkAuth, likePost);
postsRoutes.get("/fetch/:id", checkAuth, fetchSinglePost);
postsRoutes.post("/comment", checkAuth, createComment);
postsRoutes.post("/liked", checkAuth, postLiked);
postsRoutes.post("/unlike", checkAuth, unlikePost);
postsRoutes.post("/search", checkAuth, searchPosts);
postsRoutes.get("/allcommunities", checkAuth, getAllCommunities);
postsRoutes.post("/deletecomment", checkAuth, deleteComment);
postsRoutes.post("/deletepost", checkAuth, deletePost);

export default postsRoutes;
