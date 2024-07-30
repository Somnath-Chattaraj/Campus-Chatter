import express from "express";
import prisma from "../lib/prisma";
import {
  postReview,
  filterReviews,
  getFullReview,
  deleteReview,
  editReview,
} from "../controllers/reviewControllers";
import checkAuth from "../middleware/checkAuth";

const reviewRoute = express.Router();

reviewRoute.post("/", checkAuth, postReview);
reviewRoute.get("/", filterReviews);
reviewRoute.delete("/delete/:reviewId", checkAuth, deleteReview);
reviewRoute.put("/edit/:reviewId", checkAuth, editReview);
reviewRoute.get("/:reviewId", getFullReview);

export default reviewRoute;
