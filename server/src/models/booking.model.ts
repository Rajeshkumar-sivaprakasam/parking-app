import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status: "active" | "upcoming" | "completed" | "cancelled";
  paymentStatus: "pending" | "paid" | "refunded";
}

const BookingSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    slotId: { type: Schema.Types.ObjectId, ref: "ParkingSlot", required: true },
    vehicleId: { type: Schema.Types.ObjectId, ref: "Vehicle", required: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["active", "upcoming", "completed", "cancelled"],
      default: "upcoming",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
