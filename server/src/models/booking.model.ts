import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  status: string;
}

const BookingSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: true,
  },
  slotId: { type: mongoose.Schema.Types.ObjectId, ref: "Slot", required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, required: true, default: "active" },
});

export default mongoose.model<IBooking>("Booking", BookingSchema);
