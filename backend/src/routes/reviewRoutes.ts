import express from "express";
import prisma from "../lib/prisma";
import {
  postReview,
  filterReviews,
  getFullReview,
  deleteReview,
  editReview,
  getBulkReviews,
} from "../controllers/reviewControllers";
import checkAuth from "../middleware/checkAuth";
import { checkModeration } from "../middleware/moderation";

const reviewRoute = express.Router();

reviewRoute.post("/", checkAuth, postReview);
reviewRoute.get("/", filterReviews);
reviewRoute.get("/bulk", getBulkReviews);
reviewRoute.delete("/delete/:reviewId", checkAuth, deleteReview);
reviewRoute.put("/edit/:reviewId", checkAuth, editReview);
reviewRoute.get("/get/:reviewId", getFullReview);

export default reviewRoute;
