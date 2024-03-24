import mongoose, { Schema, Document } from "mongoose";

//** Define the interface for the Post document */
export interface PostDocument extends Document {
  description: string;
  uploads: {
    _id: Schema.Types.ObjectId;
    file_name: string;
    file_path: string;
  }[];
  likes: number;
  comments: number;
  shares: number;
  privacy: { value: string; label: string };
  archives: boolean;
  user_id: Schema.Types.ObjectId;
}

//** Define the post schema */
const postSchema = new Schema<PostDocument>(
  {
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    uploads: {
      type: [
        {
          _id: {
            type: Schema.Types.ObjectId,
          },
          file_name: {
            type: String,
          },
          file_path: {
            type: String,
          },
        },
      ],
      default: [],
    },
    likes: {
      type: Number,
      default: 0,
    },
    comments: {
      type: Number,
      default: 0,
    },
    shares: {
      type: Number,
      default: 0,
    },
    privacy: {
      type: {
        value: {
          type: String,
          default: "public",
        },
        label: {
          type: String,
          default: "Public",
        },
      },
      default: {},
    },
    archives: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const PostModel = mongoose.model<PostDocument>("Post", postSchema);
export default PostModel;
