import express from "express";
import {
  getVehicles,
  addVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicle.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect); // Protect all vehicle routes

router.get("/", getVehicles);
router.post("/", addVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
