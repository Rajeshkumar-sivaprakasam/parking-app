import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  plateNumber: string;
  vehicleModel: string;
  isDefault: boolean;
}

const VehicleSchema: Schema = new Schema({
  plateNumber: { type: String, required: true },
  vehicleModel: { type: String, required: true }, // Renamed from model to avoid conflict with Mongoose Document.model
  isDefault: { type: Boolean, default: false },
});

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
