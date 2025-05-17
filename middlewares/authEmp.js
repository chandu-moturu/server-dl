import jwt from "jsonwebtoken";

const authEmp = async (req, res, next) => {
  const etoken =
    req.headers.authorization 
    // console.log(req.headers.authorization)
    // console.log(etoken)
  if (!etoken) {
    return res.json({ success: false, message: "Not Authorized Login Again" });
  }

  try {
    const token_decode = jwt.verify(etoken, process.env.JWT_SECRET);
    req.body.empId = token_decode.id;
    console.log("Success")
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authEmp;
