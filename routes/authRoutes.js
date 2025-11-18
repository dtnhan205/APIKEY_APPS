import express from "express";
import { login, registerAdmin } from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();
router.post("/register",protect, registerAdmin);
router.post("/login", login);

export default router;