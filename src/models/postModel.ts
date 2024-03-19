import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;
const userSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    uploads: {
      type: {
        _id: {
          type: ObjectId,
        },
        file_name: {
          type: String,
        },
        file_path: {
          type: String,
        },
      },
      default: null,
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
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
