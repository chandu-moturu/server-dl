import express from "express";
import { registerUser, loginUser,bookAppointment,listAppointment, cancelAppointment, updateProfile, getProfile } from "../controllers/userController.js";
import authUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post(
  "/update-profile",
//   upload.single("image"),
  authUser,
  updateProfile
);

userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.get("/get-profile",authUser,getProfile);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

export default userRouter;
