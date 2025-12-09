import { Request, Response } from "express";
import Vehicle, { IVehicle } from "../models/vehicle.model";
import { sendResponse } from "../utils/response.utils";

export const getVehicles = async (req: Request, res: Response) => {
  try {
    const vehicles = await Vehicle.find({ userId: (req as any).user.id });
    sendResponse(res, 200, true, vehicles);
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};

export const addVehicle = async (req: Request, res: Response) => {
  try {
    console.log("Adding vehicle - Body:", req.body);
    console.log("Adding vehicle - User:", (req as any).user);

    const { plateNumber, make, vehicleModel, color, isDefault } = req.body;
    const userId = (req as any).user.id;

    // Check if vehicle already exists
    const existingVehicle = await Vehicle.findOne({ plateNumber });
    console.log("🚀 ~ addVehicle ~ plateNumber:", plateNumber);
    console.log("🚀 ~ addVehicle ~ existingVehicle:", existingVehicle);
    if (existingVehicle) {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Vehicle with this plate number already exists"
      );
    }

    // If setting as default, unset other defaults
    if (isDefault) {
      await Vehicle.updateMany({ userId }, { isDefault: false });
    }

    const newVehicle: IVehicle = new Vehicle({
      userId,
      plateNumber,
      make,
      vehicleModel,
      color,
      isDefault,
    });

    const savedVehicle = await newVehicle.save();
    sendResponse(res, 201, true, savedVehicle);
  } catch (error) {
    console.error("Error adding vehicle:", error);
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const updateVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = (req as any).user.id;

    // If setting as default, unset other defaults
    if (updates.isDefault) {
      await Vehicle.updateMany(
        { userId, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    const updatedVehicle = await Vehicle.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true }
    );

    if (!updatedVehicle) {
      return sendResponse(res, 404, false, null, "Vehicle not found");
    }

    sendResponse(res, 200, true, updatedVehicle);
  } catch (error) {
    sendResponse(res, 400, false, null, (error as Error).message);
  }
};

export const deleteVehicle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).user.id;

    const deletedVehicle = await Vehicle.findOneAndDelete({ _id: id, userId });

    if (!deletedVehicle) {
      return sendResponse(res, 404, false, null, "Vehicle not found");
    }

    sendResponse(res, 200, true, null, "Vehicle deleted successfully");
  } catch (error) {
    sendResponse(res, 500, false, null, (error as Error).message);
  }
};
