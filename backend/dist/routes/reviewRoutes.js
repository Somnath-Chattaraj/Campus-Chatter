"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewControllers_1 = require("../controllers/reviewControllers");
const checkAuth_1 = __importDefault(require("../middleware/checkAuth"));
const reviewRoute = express_1.default.Router();
reviewRoute.post("/", checkAuth_1.default, reviewControllers_1.postReview);
reviewRoute.get("/", reviewControllers_1.filterReviews);
reviewRoute.get("/bulk", reviewControllers_1.getBulkReviews);
reviewRoute.delete("/delete/:reviewId", checkAuth_1.default, reviewControllers_1.deleteReview);
reviewRoute.put("/edit/:reviewId", checkAuth_1.default, reviewControllers_1.editReview);
reviewRoute.get("/get/:reviewId", reviewControllers_1.getFullReview);
exports.default = reviewRoute;
