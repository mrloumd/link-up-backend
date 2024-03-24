import { Request, Response, NextFunction } from "express";
import jwt, { Secret, JwtPayload } from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel";
import { HttpStatusCode } from "../utils/HttpStatusCode";
import { response } from "../api/responseHelper";

//** Define a custom interface to extend the Request type */
interface CustomRequest extends Request {
  user?: any; // Define the user property
}

const protect = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      try {
        //** Get token 1 index */
        token = req.headers.authorization.split(" ")[1];

        //** Verify token */
        let decoded: JwtPayload | string; // Define decoded as union type
        decoded = jwt.verify(token, process.env.JWT_SECRET as Secret); // Assert decoded as JwtPayload

        //** Check if decoded is a JwtPayload */
        if (typeof decoded !== "string") {
          //**  Get user from the token */
          req.user = await User.findById(decoded.id).select("-password");
        } else {
          //** Handle the case where decoded is a string (e.g., token is invalid) */
          throw new Error("Invalid token");
        }

        next();
      } catch (error) {
        console.log(error);
        response(
          res,
          HttpStatusCode.UNAUTHORIZED,
          "Not authorized",
          ["Not authorized"],
          null
        );
      }
    }

    if (!token) {
      response(
        res,
        HttpStatusCode.UNAUTHORIZED,
        "Not authorized, no token",
        ["Not authorized, no token"],
        null
      );
    }
  }
);

export { protect };
