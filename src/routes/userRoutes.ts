import express from "express";
const userRouter = express.Router();
import { registerUser, loginUser, getMe } from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

//** @routes "/api/users/" */
userRouter.post("/", registerUser);
userRouter.post("/login", loginUser);
userRouter.get("/me/", protect, getMe);

export default userRouter;
