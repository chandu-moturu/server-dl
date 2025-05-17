import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import appointmentModel from "../models/appointmentModel.js";
import empModel from "../models/empModel.js";

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// to get appointments List
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, appointments });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancelled: true,
    });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    console.log(error);
    req.json({ success: false, message: error.message });
  }
};

const addEmp = async (req, res) => {
  console.log(req.body)
  try {
    const {
      name,
      email,
      password,
      speciality,
      experience,
      about,
      fees,
      address,
      pic
    } = req.body;
    


    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      console.log( name, email, password, speciality, experience,about,fees,address,pic)
      return res.json({ success: false, message: "Missing Details" });
      
    }

    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    const existingUser = await empModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already in use" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUrl = "google.com";

    const empData = {
      name,
      email,
      pic,
      password: hashedPassword,
      speciality,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
    };

    const newEmp = new empModel(empData);
    await newEmp.save();

    res.json({ success: true, message: "Employee Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




const allEmps = async (req, res) => {
  try {
    const emps = await empModel.find({}).select("-password");
    res.json({ success: true, emps });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const deleteEmployee = async (req, res) => {
  try {
    const { empId } = req.body;

    const deletedEmp = await empModel.findByIdAndDelete(empId);

    if (!deletedEmp) {
      return res.json({ success: false, message: "Employee not found" });
    }

    res.json({ success: true, message: "Employee deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const createAppointment = async (req, res) => {
  try {
    const { empId, userData, slotTime, slotDate } = req.body;
    
    console.log(req.body)

    if (!empId || !slotTime || !slotDate) {
      return res.json({ success: false, message: "Missing details" });
    }

    
    const employee = await empModel.findById(empId);

    if (!employee) {
      return res.json({ success: false, message: "Employee not found" });
    }

  
    // const user = await userModel.findById(userId);
    // if (!user) {
    //   return res.json({ success: false, message: "User not found" });
    // }

    // Check if the appointment slot is already booked
    const existingAppointment = await appointmentModel.findOne({
      empId,
      slotDate,
      "slotTime.start": slotTime.start,
    });
    if (existingAppointment) {
      return res.json({ success: false, message: "Slot is already booked" });
    }

    // Create the new appointment
    const newAppointment = new appointmentModel({
      empId,
      userData,
      slotTime,
      slotDate,
      status: "Booked",
      createdAt: Date.now(),
    });

    await newAppointment.save();

    res.json({
      success: true,
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const deleteAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const deletedAppointment = await appointmentModel.findByIdAndDelete(
      appointmentId
    );

    if (!deletedAppointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment deleted successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const editAppointment = async (req, res) => {
  try {
    const { appointmentId, slotTime, ...updateFields } = req.body;

    if (!appointmentId) {
      return res.json({
        success: false,
        message: "Appointment ID is required",
      });
    }

    // If slotTime is a string, convert it to a range
    if (typeof slotTime === "string") {
      const [hour, minute] = slotTime.split(":").map(Number);
      const start = slotTime;
      const endDate = new Date();
      endDate.setHours(hour, minute + 60);
      const end = endDate.toTimeString().slice(0, 5);
      updateFields.slotTime = { start, end };
    } else if (slotTime?.start && slotTime?.end) {
      updateFields.slotTime = slotTime;
    }

    const updatedAppointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      updateFields,
      { new: true }
    );

    if (!updatedAppointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    res.json({ success: true, message: "Appointment updated successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



const adminDashboard = async (req, res) => {
  try {
    const emps = await empModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashboardData = {
      emps: emps.length,
      appointments: appointments.length,
      customers: users.length,
      latestAppointments: appointments.reverse(),
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export {
  loginAdmin,
  appointmentsAdmin,
  appointmentCancel,
  addEmp,
  allEmps,
  adminDashboard,
  createAppointment,
  deleteAppointment,
  editAppointment,
  deleteEmployee
};
