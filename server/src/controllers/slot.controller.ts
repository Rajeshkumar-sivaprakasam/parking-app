import { Request, Response } from "express";
import Slot, { ISlot } from "../models/slot.model";
import { sendResponse } from "../utils/response.utils";

export const getSlots = async (req: Request, res: Response) => {
  try {
    const slots = await Slot.find();
    sendResponse(res, 200, true, slots);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const getSlotById = async (req: Request, res: Response) => {
  try {
    const slot = await Slot.findById(req.params.id);
    if (!slot) return sendResponse(res, 404, false, null, "Slot not found");
    sendResponse(res, 200, true, slot);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const createSlot = async (req: Request, res: Response) => {
  try {
    const newSlot: ISlot = new Slot(req.body);
    const savedSlot = await newSlot.save();
    sendResponse(res, 201, true, savedSlot);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const updateSlot = async (req: Request, res: Response) => {
  try {
    const updatedSlot = await Slot.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedSlot)
      return sendResponse(res, 404, false, null, "Slot not found");
    sendResponse(res, 200, true, updatedSlot);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const deleteSlot = async (req: Request, res: Response) => {
  try {
    const deletedSlot = await Slot.findByIdAndDelete(req.params.id);
    if (!deletedSlot)
      return sendResponse(res, 404, false, null, "Slot not found");
    sendResponse(res, 200, true, null, "Slot deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};
