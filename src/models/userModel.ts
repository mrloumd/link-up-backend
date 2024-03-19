import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the User document
interface UserDocument extends Document {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  age: number | null;
  birthday: Date | null;
  gender: string | null;
  country: { value: string; label: string };
  language: { value: string; label: string };
  upload: {
    _id: Schema.Types.ObjectId;
    file_name: string;
    file_path: string;
  } | null;
  following: number;
  followers: number;
  verified: boolean;
  change_password:
    | { password: Schema.Types.ObjectId; updated_at: Date }[]
    | null;
}

// Define the user schema
const userSchema = new Schema<UserDocument>(
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
      required: [true, "Please add an email"],
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
    upload: {
      type: {
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
      default: null,
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
      type: [
        {
          password: {
            type: Schema.Types.ObjectId,
          },
          updated_at: {
            type: Date,
          },
        },
      ],
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Define and export the User model
const UserModel = mongoose.model<UserDocument>("User", userSchema);
export default UserModel;
