import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import { errorHandler } from "./middlewares/errorMiddleware";
import userRouter from "./routes/userRoutes";
import postRouter from "./routes/postRoutes";
import connectDB from "./config/db";
import cors from "cors";

//** access variable in dotenv file */
dotenv.config();
const port = process.env.PORT || 5000;

//** db run fucntion */
connectDB();

const app = express();

app.use(cors());
//** middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//*******************************************
// * Function to serve all static files
// *  inside public directory.
// ******************************************
app.use(express.static("src"));
app.use("uploads", express.static("uploads"));

//** Routes */
app.use("/api/users", userRouter);
app.use("/api/post", postRouter);

//** error Handler */
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
