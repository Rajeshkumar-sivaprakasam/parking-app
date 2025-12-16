import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  role: string;
  email: string;
  password?: string; // Optional because we might not send it back to client
  phoneNumber: string;
  fcmTokens: string[]; // Firebase Cloud Messaging tokens for push notifications
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  phoneNumber: { type: String, required: true },
  fcmTokens: { type: [String], default: [] },
});

// Performance index for role-based queries
UserSchema.index({ role: 1 });

export default mongoose.model<IUser>("User", UserSchema);
