import mongoose from "mongoose";

const empSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    pic: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    speciality: { type: String, required: true },
    // degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    address: { type: Object, required: true },
    // address: { type: String, required: true },
    date: { type: Number, required: true },
  },
  { minimize: false }
);


const empModel =
  mongoose.models.emp || mongoose.model("emp", empSchema);

export default empModel;
