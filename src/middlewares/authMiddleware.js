import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { HttpStatusCode } from "../utils/HttpStatusCode.js";
import { sendResponse } from "../api/responseHelper.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token 1 index
      token = req.headers.authorization.split(" ")[1];

      //Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      //Get user from the token
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.log(error);
      sendResponse(
        res,
        HttpStatusCode.UNAUTHORIZED,
        "Not auhtorized",
        ["Not auhtorized"],
        null
      );
    }
  }

  if (!token) {
    sendResponse(
      res,
      HttpStatusCode.UNAUTHORIZED,
      "Not authorized, no token",
      ["Not authorized, no token"],
      null
    );
  }
});

export { protect };
