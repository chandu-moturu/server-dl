import express from "express";
import {
  loginAdmin,
  addEmp,
  appointmentCancel,
  appointmentsAdmin,
  adminDashboard,
  allEmps,
  deleteEmployee,
  deleteAppointment,
  editAppointment,
  createAppointment, 
} from "../controllers/adminController.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailablity } from "../controllers/empController.js";

const adminRouter = express.Router();

adminRouter.post("/login", loginAdmin);
adminRouter.post("/add-emp", authAdmin, addEmp);

adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);


adminRouter.post("/create-appointment", authAdmin, createAppointment); 

adminRouter.get("/all-emps", authAdmin, allEmps);
adminRouter.post("/change-availability", authAdmin, changeAvailablity);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

adminRouter.post("/delete-employee", authAdmin, deleteEmployee);
adminRouter.delete("/delete-appointment", authAdmin, deleteAppointment);
adminRouter.put("/edit-appointment", authAdmin, editAppointment);

export default adminRouter;
