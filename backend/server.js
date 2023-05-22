import path from "path";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import { errorHandler, notFound } from "./middlewares/error.js";
import userRouter from "./routes/user.js";

const port = process.env.PORT || 5000;

///db connection
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use("/api/users", userRouter);

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend/dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("server is ready");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`server is running on port ${port}`));
