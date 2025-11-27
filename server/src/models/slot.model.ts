import mongoose, { Schema, Document } from "mongoose";

export interface ISlot extends Document {
  status: string;
  type: string;
  identifier: string; // e.g., A1, A2
}

const SlotSchema: Schema = new Schema({
  identifier: { type: String, required: true, unique: true },
  status: {
    type: String,
    required: true,
    enum: ["FREE", "OCCUPIED", "RESERVED"],
    default: "FREE",
  },
  type: {
    type: String,
    required: true,
    enum: ["standard", "ev"],
    default: "standard",
  },
});

export default mongoose.model<ISlot>("Slot", SlotSchema);
