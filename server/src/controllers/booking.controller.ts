import mongoose from "mongoose";
import { Request, Response } from "express";
import Booking, { IBooking } from "../models/booking.model";
import ParkingSlot from "../models/slot.model";
import { sendResponse } from "../utils/response.utils";

// ... existing code ...
export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({ userId: (req as any).user.id })
      .populate("slotId")
      .populate("vehicleId")
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, bookings);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find({})
      .populate("slotId")
      .populate("vehicleId")
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    sendResponse(res, 200, true, bookings);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const createBooking = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const { slotId, vehicleId, startTime, duration, totalAmount } = req.body;
    const userId = (req as any).user.id;

    // Normalize time
    const start = new Date(startTime);
    // Ensure valid date
    if (isNaN(start.getTime())) {
      throw new Error("Invalid start time");
    }

    // Calculate end time
    const end = new Date(start.getTime() + duration * 60 * 60 * 1000);

    // 1. Check Slot Existence
    const slot = await ParkingSlot.findById(slotId).session(session);
    if (!slot) {
      await session.abortTransaction();
      return sendResponse(res, 404, false, null, "Slot not found");
    }

    // 2. Overlap Check (Anti-Double Booking)
    // Find any booking for this slot that overlaps with the requested range
    // Overlap condition: (StartA < EndB) && (EndA > StartB)
    const conflictingBooking = await Booking.findOne({
      slotId,
      status: { $ne: "cancelled" }, // Ignore cancelled bookings
      $or: [
        {
          startTime: { $lt: end },
          endTime: { $gt: start },
        },
      ],
    }).session(session);

    if (conflictingBooking) {
      await session.abortTransaction();
      return sendResponse(
        res,
        409, // Conflict
        false,
        null,
        "Slot is already booked for the selected time range."
      );
    }

    // 3. Create Booking
    const newBooking = new Booking({
      userId,
      slotId,
      vehicleId,
      startTime: start,
      endTime: end,
      totalAmount,
      status: "upcoming",
      paymentStatus: "paid", // Simplified for now
    });

    const savedBooking = await newBooking.save({ session });

    // Optional: If valid right now, update slot status?
    // We strictly rely on Bookings for availability now, but for legacy support:
    // await ParkingSlot.findByIdAndUpdate(slotId, { status: "occupied" }).session(session);

    await session.commitTransaction();
    sendResponse(res, 201, true, savedBooking);
  } catch (error) {
    // If transaction hasn't been committed, abort
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    // Handle 'Transaction numbers are only allowed...' error if no replica set
    const msg = (error as Error).message;
    if (msg.includes("Transaction numbers are only allowed")) {
      // Fallback or just report
      sendResponse(
        res,
        500,
        false,
        null,
        "Database transaction failed. Ensure MongoDB Replica Set is enabled."
      );
    } else {
      sendResponse(res, 400, false, null, msg);
    }
  } finally {
    session.endSession();
  }
};

export const cancelBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const booking = await Booking.findOne({ _id: id, userId });
    if (!booking) {
      return sendResponse(res, 404, false, null, "Booking not found");
    }

    if (booking.status === "cancelled" || booking.status === "completed") {
      return sendResponse(res, 400, false, null, "Booking cannot be cancelled");
    }

    // Logic for refund eligibility could go here

    booking.status = "cancelled";
    booking.paymentStatus = "refunded"; // Simplified
    await booking.save();

    // Free up the slot
    await ParkingSlot.findByIdAndUpdate(booking.slotId, {
      status: "available",
    });

    sendResponse(res, 200, true, booking, "Booking cancelled successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const extendBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { duration, additionalAmount } = req.body;
    const userId = (req as any).user.id;

    const booking = await Booking.findOne({ _id: id, userId });
    if (!booking) {
      return sendResponse(res, 404, false, null, "Booking not found");
    }

    if (booking.status !== "active") {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Only active bookings can be extended"
      );
    }

    const newEndTime = new Date(
      booking.endTime.getTime() + duration * 60 * 60 * 1000
    );

    booking.endTime = newEndTime;
    booking.totalAmount += additionalAmount;
    await booking.save();

    sendResponse(res, 200, true, booking, "Booking extended successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};
