import mongoose, { Schema, Document } from "mongoose";

export interface IParkingSlot extends Document {
  number: string;
  type: "standard" | "ev" | "disabled";
  status: "available" | "occupied" | "reserved";
  pricePerHour: number;
  location: string;
}

const ParkingSlotSchema: Schema = new Schema(
  {
    number: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["standard", "ev", "disabled"],
      required: true,
    },
    status: {
      type: String,
      enum: ["available", "occupied", "reserved"],
      default: "available",
    },
    pricePerHour: { type: Number, required: true },
    location: { type: String, required: true },
  },
  { timestamps: true }
);

// Performance indexes for frequently queried fields
ParkingSlotSchema.index({ status: 1 }); // Filter by availability
ParkingSlotSchema.index({ type: 1 }); // Filter by slot type
ParkingSlotSchema.index({ status: 1, type: 1 }); // Combined filter

export default mongoose.model<IParkingSlot>("ParkingSlot", ParkingSlotSchema);
