import express from "express";
const postRouter = express.Router();
import {
  getPost,
  setPost,
  deletePost,
  updatePost,
} from "../controllers/postController";
import { protect } from "../middlewares/authMiddleware";

//** @routes "/api/post/" */
postRouter.route("/").get(protect, getPost).post(protect, setPost);
postRouter.route("/:id").delete(protect, deletePost).put(protect, updatePost);

export default postRouter;
