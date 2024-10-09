import express from "express";
import { searchRoom } from "../controllers/routeControllers";
import checkAuth from "../middleware/checkAuth";

const roomRouter = express.Router();

roomRouter.get("/", checkAuth,searchRoom);

export default roomRouter;