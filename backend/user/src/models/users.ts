import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  linkedIn?: string;
  bio?: string;
  refreshToken?: string;
}

const schema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String },
    instagram: { type: String },
    facebook: { type: String },
    twitter: { type: String },
    linkedIn: { type: String },
    bio: { type: String },
    refreshToken: { type: String, default: "" },
  },
  { timestamps: true },
);

export const User = mongoose.model<IUser>("User", schema);
