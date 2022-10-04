const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const app = express();
const port = process.env.PORT || 3000;

const authRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const AppError = require("./utils/appError");

dotenv.config();
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL, {})
  .then(console.log("connected to mongo..."))
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(cookieParser());
// console.log(userRouter);
app.use("/", authRouter);
app.use("/post/", postRouter);
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: err.status || "error",
    message: err.message || "something went wrong",
  });
});
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
