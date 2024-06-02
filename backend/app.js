import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./routes/user-routes.js";
import blogRouter from "./routes/blog-router.js";

const app = express();
dotenv.config();

app.use(express.json());
app.use("/api/user", router);
app.use("/api/blog", blogRouter);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected to the fuckin DB!!");
  })
  .catch((err) => {
    console.log(err);
  });

app.listen(process.env.PORT, () => {
  console.log("Server is fuckin Started");
});
