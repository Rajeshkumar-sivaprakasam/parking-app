import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  role: string;
  phoneNumber: string;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, default: "user" },
  phoneNumber: { type: String, required: true },
});

export default mongoose.model<IUser>("User", UserSchema);
