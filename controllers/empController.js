import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import empModel from "../models/empModel.js";
import appointmentModel from "../models/appointmentModel.js";


const loginEmp = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await empModel.findOne({ email });
    console.log(email,password)

    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1hr",
      });
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentsEmp = async (req, res) => {
  try{
    const {empId} = req.body
    const appointments = await appointmentModel.find({empId})

    res.json({success: true, appointments})
  }catch (error) {
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

const appointmentCancel = async(req, res) =>{
  try{
    const {empId, appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.empId === empId){
      await appointmentModel.findByIdAndUpdate(appointmentId, {cancelled: true})
      return res.json({success: false, message:'Appointment Cancelled'})
    } 
    res.json({success:false, message:'Unable to cancel appointment'})
  } catch (error){
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

const empList = async (req, res) => {
  try{ 
    const emps = await empModel.find({}).select(['-password','-email'])
    res.json({success: true, emps})

  }catch (error){
    console.log(error)
    res.json({success: false, message:error.message})
  }
}
const changeAvailablity = async (req, res) => {
  try {
    const { empId } = req.body;
    const empData = await empModel.findById(empId);

    if (!empData) {
      return res.json({ success: false, message: "Employee not found" });
    }

    await empModel.findByIdAndUpdate(empId, { available: !empData.available });
    res.json({ success: true, message: "Availability changed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const appointmentComplete = async (req,res) =>{
  try{
    const {empId, appointmentId} = req.body

    const appointmentData = await appointmentModel.findById(appointmentId)
    if(appointmentData && appointmentData.empId === empId){
      await appointmentModel.findByIdAndUpdate(appointmentId, {isCompleted:true})
      return res.json({success: true, message: 'Appointment Cancelled'})
    } 
    res.json({success:false, message: 'Appointment Cancelled'})

  }catch (error){
    console.log(error)
    res.json({success: false, message: error.message})
  }
}

const empDashboard = async (req,res) => {
  try{
    const {empId} = req.body
    const appointments = await appointmentModel.find({empId})

    let earnings = 0

    appointments.map((item)=>{
      if(item.isCompleted || item.payment){
        earnings += item.amount
      }
    })
    let customers = []

    appointments.map((item)=>{
      if(!customers.includes(item.userId)){
        customers.push(item.userId)
      }
    })

    const dashData = {
      earnings,
      appointments: appointments.length,
      customers: customers.length,
      latestAppointments: appointments.reverse()
    }

    res.json({ success: true, dashData})
  } catch(error){
    console.log(error)
    res.json({success: false, message: error.message})
  }
}


const empProfile = async (req, res) =>{
  try{
    const {empId} = req.body
    const profileData = await empModel.findById(empId).select('-password')

    res.json({success: true, profileData})
  } catch (error){
    console.log(error)
    res.json({success: false, message: error.message})
  }
}


const updateEmpProfile = async(req,res) =>{
  try{
    const {empId, fees, address, available} =req.body

    await empModel.findByIdAndUpdate(empId, {fees, address, available})

  }catch (error) {
    console.log(error)
    res.json({success:false,message:error.message})
  }
}







export {
  loginEmp,
  appointmentsEmp,
  appointmentCancel,
  empList,
  changeAvailablity,
  appointmentComplete,
  empDashboard,
  empProfile,
  updateEmpProfile,
};