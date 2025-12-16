import { Request, Response } from "express";
import ParkingSlot from "../models/slot.model";
import Booking from "../models/booking.model";
import { sendResponse } from "../utils/response.utils";
import { cacheManager, cacheKeys, cacheTTL } from "../utils/cache.utils";

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { status, startTime, duration } = req.query;

    // Generate cache key based on query params
    const cacheKey = cacheKeys.slots(
      `${status || "all"}_${startTime || ""}_${duration || ""}`
    );

    // Check cache first (only for requests without time window)
    if (!startTime && !duration) {
      const cachedSlots = cacheManager.get(cacheKey);
      if (cachedSlots) {
        return sendResponse(res, 200, true, cachedSlots);
      }
    }

    // Fetch all slots as POJOs using lean() for better performance
    let slots = await ParkingSlot.find({}).sort({ number: 1 }).lean();

    // If time window provided, check bookings
    if (startTime && duration) {
      const start = new Date(startTime as string);
      const end = new Date(start.getTime() + Number(duration) * 60 * 60 * 1000);

      if (!isNaN(start.getTime())) {
        const bookings = await Booking.find({
          status: { $ne: "cancelled" },
          $or: [{ startTime: { $lt: end }, endTime: { $gt: start } }],
        })
          .select("slotId")
          .lean(); // Use lean for read-only query

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

    // Cache the result if no time window (static data)
    if (!startTime && !duration) {
      cacheManager.set(cacheKey, slots, cacheTTL.MEDIUM);
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
    ).lean();

    if (!updatedSlot) {
      return sendResponse(res, 404, false, null, "Slot not found");
    }

    // Invalidate slots cache on update
    cacheManager.deleteByPrefix("slots");

    sendResponse(res, 200, true, updatedSlot);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};
