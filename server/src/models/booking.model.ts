import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  userId: mongoose.Types.ObjectId;
  slotId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  startTime: Date;
  endTime: Date;
  totalAmount: number;
  status:
    | "active"
    | "upcoming"
    | "completed"
    | "cancelled"
    | "waiting"
    | "allocated"; // "allocated" means offered to waitlist user, pending confirmation
  paymentStatus: "pending" | "paid" | "refunded" | "partial_refund";
  checkInTime?: Date;
  // New fields for Advanced Queue & Refunds
  allocationExpiresAt?: Date; // If allocated, when does the offer expire?
  refundAmount?: number;
  cancellationReason?: string;
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
      enum: [
        "active",
        "upcoming",
        "completed",
        "cancelled",
        "waiting",
        "allocated",
      ],
      default: "upcoming",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded", "partial_refund"],
      default: "pending",
    },
    checkInTime: { type: Date },
    // Advanced Queue Fields
    allocationExpiresAt: { type: Date },
    refundAmount: { type: Number, default: 0 },
    cancellationReason: { type: String },
  },
  { timestamps: true }
);

// Performance indexes for frequently queried fields
BookingSchema.index({ userId: 1 }); // User's bookings lookup
BookingSchema.index({ slotId: 1 }); // Slot availability checks
BookingSchema.index({ status: 1 }); // Status-based queries
BookingSchema.index({ startTime: 1, endTime: 1 }); // Time range queries
BookingSchema.index({ userId: 1, status: 1 }); // Compound: user's active bookings
BookingSchema.index({ slotId: 1, startTime: 1, endTime: 1 }); // Slot time overlap checks
BookingSchema.index({ createdAt: -1 }); // Recent bookings sorting

export default mongoose.model<IBooking>("Booking", BookingSchema);
