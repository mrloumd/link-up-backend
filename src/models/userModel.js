import mongoose from "mongoose";
const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please add your firstname"],
    },
    lastName: {
      type: String,
      required: [true, "Please add your lastname"],
    },
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
    age: {
      type: Number,
      default: null,
    },
    birthday: {
      type: Date,
      default: null,
      // required: [true, "Please add your birthday"],
    },
    gender: {
      type: String,
      default: null,
      // required: [true, "Please add your gender"],
    },
    country: {
      type: {
        value: {
          type: String,
          default: "ph",
        },
        label: {
          type: String,
          default: "Philippines",
        },
      },
      default: {},
    },
    language: {
      type: {
        value: {
          type: String,
          default: "english",
        },
        label: {
          type: String,
          default: "English",
        },
      },
      default: {},
    },
    following: {
      type: Number,
      default: 0,
    },
    followers: {
      type: Number,
      default: 0,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    change_password: {
      type: Object,
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
