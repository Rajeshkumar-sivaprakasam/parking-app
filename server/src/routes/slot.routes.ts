import express from "express";
import { getSlots, updateSlotStatus } from "../controllers/slot.controller";
import { protect, authorize } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", protect, getSlots);
router.put("/:id/status", protect, authorize("admin"), updateSlotStatus); // Only admin can update status manually

export default router;
