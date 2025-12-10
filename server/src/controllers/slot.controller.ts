import { Request, Response } from "express";
import ParkingSlot from "../models/slot.model";
import Booking from "../models/booking.model";
import { sendResponse } from "../utils/response.utils";

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { status, startTime, duration } = req.query;

    // Fetch all slots as POJOs
    let slots = await ParkingSlot.find({}).sort({ number: 1 }).lean();

    // If time window provided, check bookings
    if (startTime && duration) {
      const start = new Date(startTime as string);
      const end = new Date(start.getTime() + Number(duration) * 60 * 60 * 1000);

      if (!isNaN(start.getTime())) {
        const bookings = await Booking.find({
          status: { $ne: "cancelled" },
          $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
        }).select("slotId");

        const bookedSlotIds = new Set(bookings.map((b) => b.slotId.toString()));

        // Mark booked slots as occupied for this view
        slots = slots.map((slot: any) => {
          if (bookedSlotIds.has(slot._id.toString())) {
            return { ...slot, status: "occupied" };
          }
          return slot;
        });
      }
    }

    // Filter by status if requested
    if (status) {
      slots = slots.filter((s: any) => s.status === status);
    }

    sendResponse(res, 200, true, slots);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const updateSlotStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedSlot = await ParkingSlot.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedSlot) {
      return sendResponse(res, 404, false, null, "Slot not found");
    }

    sendResponse(res, 200, true, updatedSlot);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};
