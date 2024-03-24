import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User, { UserDocument } from "../models/userModel";
import { response } from "../api/responseHelper";
import { HttpStatusCode } from "../utils/HttpStatusCode";

//** Define a custom interface to extend the Request type */
interface CustomRequest extends Request {
  user?: any; // Define the user property
}

//** Generate a Token JWT */
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: "30d",
  });
};

//** @desc Register new user */
//** @route POST /api/user */
//** @access Public */
const registerUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Please add all fields",
        ["Please add all fields"],
        null
      );
    }

    //** Check if user exists */
    const userExists = await User.findOne({ email });

    if (userExists) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "User already exists",
        ["User already exists"],
        null
      );
    }

    //** Hash password */
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    };

    //** Create user */
    const user = await User.create(query);

    if (user) {
      response(res, HttpStatusCode.CREATED, "User Registered", [], { user });
    } else {
      response(res, HttpStatusCode.BAD_REQUEST, "", ["Error"], null);
    }
  } catch (error) {
    console.error(error);
    response(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

//** @desc Authenticate a user */
//** @route POST /api/user/login */
//** @access Public */
const loginUser = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Please add all fields",
        ["Please add all fields"],
        null
      );
    }

    //** Find user by username */
    const user = await User.findOne({ username });

    if (!user) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Username is not registered",
        ["Username not found"],
        null
      );
    }

    //** Check if passwords match */
    if (await bcrypt.compare(password, user.password)) {
      response(res, HttpStatusCode.OK, "Login successful", [], {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        token: generateToken(user.id),
      });
    } else {
      response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Invalid password",
        ["Invalid password"],
        null
      );
    }
  } catch (error) {
    console.error(error);
    response(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

//** @desc Get user data */
//** @route GET /api/user/me */
//** @access Private */
const getMe = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    if (!req.user) {
      return response(
        res,
        HttpStatusCode.UNAUTHORIZED,
        "Not authorized",
        ["Not authorized"],
        null
      );
    }

    const user = await User.findById(req.user.id);

    if (user) {
      response(res, HttpStatusCode.OK, "Success", [], { user });
    } else {
      response(res, HttpStatusCode.NOT_FOUND, "", ["Error"], null);
    }
  } catch (error) {
    console.error(error);
    response(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

export { registerUser, loginUser, getMe };
