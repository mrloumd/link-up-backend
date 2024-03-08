import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { sendResponse } from "../api/responseHelper.js";
import { HttpStatusCode } from "../utils/HttpStatusCode.js";

//Generate a Token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc Register new user
// @route POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    if (!firstName || !lastName || !username || !email || !password) {
      return sendResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Please add all fields",
        ["Please add all fields"],
        null
      );
    }

    //Check if users exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return sendResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "User already exists",
        ["User already exists"],
        null
      );
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const query = {
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    };

    //Create user
    const user = await User.create(query);

    if (user) {
      sendResponse(res, HttpStatusCode.CREATED, "User Register", [], { user });
    } else {
      sendResponse(res, HttpStatusCode.BAD_REQUEST, "", ["Error"], null);
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

// @desc Authenticate a user
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      sendResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Please add all fields",
        ["Please add all fields"],
        null
      );
    }

    // Login user
    // Check for user username
    const user = await User.findOne({ username });

    if (!user) {
      sendResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Username is not registered",
        ["Username not found"],
        null
      );
    } else if (user && (await bcrypt.compare(password, user.password))) {
      sendResponse(res, HttpStatusCode.OK, "Login successful", [], {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        token: generateToken(user._id),
      });
    } else {
      sendResponse(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Invalid password",
        ["Invalid password"],
        null
      );
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

// @desc Get user data
// @route GET /api/user/me
// @access Private
const getMe = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    console.log("USER", user);

    if (user) {
      sendResponse(res, HttpStatusCode.OK, "Success", [], { user });
    } else {
      sendResponse(res, HttpStatusCode.NOT_FOUND, "", ["Error"], null);
    }
  } catch (error) {
    console.error(error);
    sendResponse(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

export { registerUser, loginUser, getMe };
