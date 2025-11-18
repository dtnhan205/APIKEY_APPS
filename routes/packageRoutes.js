import express from "express";
import { protect } from "../middleware/auth.js";
import { createPackage, getPackages, updatePackage, deletePackage } from "../controllers/packageController.js";

const router = express.Router();
router.use(protect);

router.post("/create", createPackage);
router.get("/list", getPackages);
router.put("/:id", updatePackage);
router.delete("/:id", deletePackage);

export default router;