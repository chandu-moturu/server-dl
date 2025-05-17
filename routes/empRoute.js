import express from "express";
import { appointmentComplete, appointmentsEmp, changeAvailablity, empDashboard, empList, empProfile, loginEmp, updateEmpProfile } from "../controllers/empController.js";
import { appointmentCancel } from "../controllers/adminController.js";
import authEmp from '../middlewares/authEmp.js'

const empRouter = express.Router();

empRouter.post("/login", loginEmp);
empRouter.get("/appointments",authEmp,appointmentsEmp)
empRouter.get("/list",empList)
empRouter.get("/dashboard",authEmp,empDashboard)
empRouter.get("/profile",authEmp,empProfile)
empRouter.post("/change-availability", authEmp, changeAvailablity)


empRouter.post("/cancel-appointment", authEmp, appointmentCancel)
empRouter.post("/complete-appointment",authEmp,appointmentComplete)
empRouter.post("/update-profile",authEmp,updateEmpProfile)


export default empRouter;