import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: false },
  empId: { type: String, required: true },
  slotDate: { type: String, required: true }, // e.g., "5_5_2025"
  slotTime: {
    start: { type: String, required: true }, // e.g., "10:00"
    end: { type: String, required: true }, // e.g., "11:00"
  },
  userData: { type: Object, required: false },
  empData: { type: Object, required: false },
  amount: { type: Number, required: false },
  date: { type: Number, required: false },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);
export default appointmentModel;
