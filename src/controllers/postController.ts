import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import Post, { PostDocument } from "../models/postModel";
import { response } from "../api/responseHelper";
import { HttpStatusCode } from "../utils/HttpStatusCode";

//** Define a custom interface to extend the Request type */
interface CustomRequest extends Request {
  user?: any; // Define the user property
}

// @desc    Get Post
// @route   GET /api/post
// @access  Private
const getPost = asyncHandler(async (req, res: Response) => {
  try {
    //get post of login user
    // const posts = await Post.find({ user: req.user.id });

    //get all users post
    const posts = await Post.find();

    if (posts) {
      response(res, HttpStatusCode.CREATED, "success", [], { posts });
    } else {
      response(res, HttpStatusCode.BAD_REQUEST, "", ["Error"], null);
    }
    // postman request
    // res.status(200).json({ message: "Get post" });
  } catch (error) {
    console.error(error);
    response(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

// @desc    Set post
// @route   SET /api/post
// @access  Private
const setPost = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    if (!req.body.description) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Please add all fields",
        ["Please add all fields"],
        null
      );
    }

    const post = await Post.create({
      description: req.body.description,
      user_id: req.user.id,
    });

    // console.log("posts", post);

    // postman request
    // res.status(200).json({ message: "Set post" });
    if (post) {
      response(res, HttpStatusCode.CREATED, "success", [], { post });
    } else {
      response(res, HttpStatusCode.BAD_REQUEST, "", ["Error"], null);
    }
  } catch (error) {
    console.error(error);
    response(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

// @desc    Delete post
// @route   DEL/api/post/:id
// @access  Private
const deletePost = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const post: PostDocument | null = await Post.findById(req.params.id);

    if (!post) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Post not found",
        ["Post not found"],
        null
      );
    }

    // Check for user
    if (!req.user) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "User not found",
        ["User not found"],
        null
      );
    }

    // Make sure the logged in user matches the post user
    if (post.user_id.toString() !== req.user.id) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "User not authorized",
        ["User not authorized"],
        null
      );
    }

    await post.deleteOne();

    // postman request
    //res.status(200).json({ id: req.params.id });
    if (post) {
      response(res, HttpStatusCode.CREATED, "success", [], { post });
    } else {
      response(res, HttpStatusCode.BAD_REQUEST, "", ["Error"], null);
    }
  } catch (error) {
    console.error(error);
    response(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }

  // postman request
  // res.status(200).json({ message: `Delete post post ${req.params.id}` });
});

// @desc    Update post
// @route   PUT /api/post/:id
// @access  Private
const updatePost = asyncHandler(async (req: CustomRequest, res: Response) => {
  try {
    const post: PostDocument | null = await Post.findById(req.params.id);

    if (!post) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "Post not found",
        ["Post not found"],
        null
      );
    }

    // Check for user
    if (!req.user) {
      return response(
        res,
        HttpStatusCode.BAD_REQUEST,
        "User not found",
        ["User not found"],
        null
      );
    }

    // Make sure the logged in user matches the post user_id
    if (post.user_id.toString() !== req.user.id) {
      res.status(401);
      throw new Error("User not authorized");
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // postman request
    // res.status(200).json({ message: `Update post post ${req.params.id}` });
    if (updatedPost) {
      response(res, HttpStatusCode.CREATED, "success", [], { updatedPost });
    } else {
      response(res, HttpStatusCode.BAD_REQUEST, "", ["Error"], null);
    }
  } catch (error) {
    console.error(error);
    response(res, HttpStatusCode.SERVER_ERROR, "", ["Error"], null);
  }
});

export { getPost, setPost, deletePost, updatePost };
