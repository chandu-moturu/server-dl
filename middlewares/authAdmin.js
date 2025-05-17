import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    console.log("Request Headers:", req.headers);

    const atoken = req.headers.authorization; 
      // req.headers.authorization && req.headers.authorization.split(" ")[1];

    console.log("Token:", atoken);

    if (!atoken) {
      return res.json({
        success: false,
        message: "Not Authorized. Please log in again.",
      });
    }

    const token_decode = jwt.verify(atoken, process.env.JWT_SECRET);

    console.log("Decoded Token:", token_decode);

    if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
      return res.json({
        success: false,
        message: "Not Authorized. Invalid credentials.",
      });
    }

    next();
  } catch (error) {
    console.error("JWT Error:", error);
    if (error.name === "TokenExpiredError") {
      return res.json({
        success: false,
        message: "Token has expired. Please log in again.",
      });
    } else {
      return res.json({ success: false, message: error.message });
    }
  }
};

export default authAdmin;

