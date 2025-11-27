import mongoose, { Schema, Document } from "mongoose";

export interface IVehicle extends Document {
  userId: mongoose.Types.ObjectId;
  plateNumber: string;
  make: string;
  vehicleModel: string;
  color: string;
  isDefault: boolean;
}

const VehicleSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    plateNumber: { type: String, required: true, unique: true },
    make: { type: String, required: true },
    vehicleModel: { type: String, required: true },
    color: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicle>("Vehicle", VehicleSchema);
