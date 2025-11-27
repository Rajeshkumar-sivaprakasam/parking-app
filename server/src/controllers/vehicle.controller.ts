import { Request, Response } from "express";
import Vehicle, { IVehicle } from "../models/vehicle.model";
import { sendResponse } from "../utils/response.utils";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find();
    sendResponse(res, 200, true, vehicles);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const getVehicleById = async (req: Request, res: Response) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle)
      return sendResponse(res, 404, false, null, "Vehicle not found");
    sendResponse(res, 200, true, vehicle);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const createVehicle = async (req: Request, res: Response) => {
  try {
    const { model, ...rest } = req.body;
    const vehicleData = { ...rest, vehicleModel: model };
    const newVehicle: IVehicle = new Vehicle(vehicleData);
    const savedVehicle = await newVehicle.save();
    sendResponse(res, 201, true, savedVehicle);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { model, ...rest } = req.body;
    const updateData = model ? { ...rest, vehicleModel: model } : req.body;
    const updatedVehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updatedVehicle)
      return sendResponse(res, 404, false, null, "Vehicle not found");
    sendResponse(res, 200, true, updatedVehicle);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const deletedVehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deletedVehicle)
      return sendResponse(res, 404, false, null, "Vehicle not found");
    sendResponse(res, 200, true, null, "Vehicle deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};
