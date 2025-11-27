import { Request, Response } from "express";
import Booking, { IBooking } from "../models/booking.model";
import { sendResponse } from "../utils/response.utils";

export const getBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find()
      .populate("userId")
      .populate("vehicleId")
      .populate("slotId");
    sendResponse(res, 200, true, bookings);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("userId")
      .populate("vehicleId")
      .populate("slotId");
    if (!booking)
      return sendResponse(res, 404, false, null, "Booking not found");
    sendResponse(res, 200, true, booking);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const newBooking: IBooking = new Booking(req.body);
    const savedBooking = await newBooking.save();
    sendResponse(res, 201, true, savedBooking);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBooking)
      return sendResponse(res, 404, false, null, "Booking not found");
    sendResponse(res, 200, true, updatedBooking);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking)
      return sendResponse(res, 404, false, null, "Booking not found");
    sendResponse(res, 200, true, null, "Booking deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};
