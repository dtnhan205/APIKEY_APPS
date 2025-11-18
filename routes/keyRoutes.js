import express from "express";
import { protect } from "../middleware/auth.js";
import { createKey, activateKey, getAllKeys, resetKey, deleteKey } from "../controllers/keyController.js";

const router = express.Router();

router.post("/create", protect, createKey);
router.post("/activate", activateKey);           
router.get("/list", protect, getAllKeys);
router.post("/:id/reset", protect, resetKey);
router.delete("/:id", protect, deleteKey);

export default router;