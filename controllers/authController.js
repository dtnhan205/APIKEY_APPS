import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({ username, password: hashed, role: "admin" });
    res.status(201).json({ message: "Tạo admin thành công", username: user.username });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    res.json({ success: true, token, user: { username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
};