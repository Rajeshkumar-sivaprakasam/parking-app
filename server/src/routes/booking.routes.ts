import express from "express";
import {
  getBookings,
  createBooking,
  cancelBooking,
  extendBooking,
} from "../controllers/booking.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect); // Protect all booking routes

router.get("/", getBookings);
router.post("/", createBooking);
router.post("/:id/cancel", cancelBooking);
router.post("/:id/extend", extendBooking);

export default router;
