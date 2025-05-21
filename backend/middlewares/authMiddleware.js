import User from "../models/User.js";
import jwt from 'jsonwebtoken'

export async function protectRoute (req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "JWT token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    req.user = user; // Not `res.user`
    next();

  } catch (error) {
    console.log(error);
    return res.status(401).json({ success: false, message: error.message });
  }
}
