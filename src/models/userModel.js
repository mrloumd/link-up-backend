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
    email: {
      type: String,
      required: [true, "Please add a email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },

  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);
