import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import empRouter from "./routes/empRoute.js";

const app = express();
dotenv.config();
const PORT = 5000 || process.env.PORT;
const DATABASE_URI = process.env.CONNECTION_URI;

// console.log(DATABASE_URI)

app.use(express.json({ limit: "30mb", entended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/api/user",userRouter)
app.use("/api/admin",adminRouter)
app.use("/api/emp",empRouter)

app.get("/", (req, res) => {
  res.send("Server is working");
});

// app.listen(PORT, () => console.log(`Server started on PORT: ${PORT}`));



mongoose
  .connect(DATABASE_URI)
  .then(() =>
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    })
  )
  .catch((err) => {
    console.log(err.message);
  });