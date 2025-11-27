import { Request, Response } from "express";
import ParkingSlot from "../models/slot.model";
import { sendResponse } from "../utils/response.utils";

export const getSlots = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};
    const slots = await ParkingSlot.find(query).sort({ number: 1 });
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
