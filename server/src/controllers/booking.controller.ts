import { Request, Response } from "express";
import Booking, { IBooking } from "../models/booking.model";
import ParkingSlot from "../models/slot.model";
import { sendResponse } from "../utils/response.utils";

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

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { slotId, vehicleId, startTime, duration, totalAmount } = req.body;
    const userId = (req as any).user.id;

    // Check slot availability
    const slot = await ParkingSlot.findById(slotId);
    if (!slot) {
      return sendResponse(res, 404, false, null, "Slot not found");
    }
    if (slot.status !== "available") {
      return sendResponse(res, 400, false, null, "Slot is not available");
    }

    const endTime = new Date(
      new Date(startTime).getTime() + duration * 60 * 60 * 1000
    );

    const newBooking: IBooking = new Booking({
      userId,
      slotId,
      vehicleId,
      startTime,
      endTime,
      totalAmount,
      status: "active",
      paymentStatus: "paid", // Assuming immediate payment for now
    });

    const savedBooking = await newBooking.save();

    // Update slot status
    await ParkingSlot.findByIdAndUpdate(slotId, { status: "occupied" });

    sendResponse(res, 201, true, savedBooking);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
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
