import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  pic: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  phone: { type: String, default: "000000000" },
  // address: { type: Object, default: { line1: "", line2: "" } },
  address: { type: String },
  gender: { type: String, default: "Not Selected" },
  dob: { type: String, default: "Not Selected" },
  password: { type: String, required: true },
});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
