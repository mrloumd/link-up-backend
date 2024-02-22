import express from "express";
const userRouter = express.Router();
import {
  registerUser,
  loginUser,
  getMe,
} from "../controllers/userController.js";
import { protect } from "../middlewares/authMiddleware.js";

// import { protect }  from "../middleware/authMiddleware"

userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
// get the users informantion
userRouter.get("/me/", protect, getMe);

export default userRouter;
