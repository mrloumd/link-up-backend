import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";

//access variable in dotenv file
dotenv.config();
const port = process.env.PORT || 5000;

//db run fucntion
connectDB();

const app = express();

app.use(cors());
// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use("/api/users", userRouter);

// error Handler
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
