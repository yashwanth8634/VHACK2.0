import mongoose, { Schema, Document, Model } from "mongoose";

export interface IMember {
  name: string;
  email: string;
  phone: string;
  year: string;
}

export interface IRegistration extends Document {
  teamName: string;
  domain: string;
  teamSize: number;
  college: string;
  leader: {
    name: string;
    email: string;
    phone: string;
    year: string;
  };
  members: IMember[];
  transactionId: string;
  screenshotUrl: string;
  createdAt: Date;
  updatedAt: Date;
}

const MemberSchema = new Schema<IMember>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    year: { type: String, required: true },
  },
  { _id: false }
);

const RegistrationSchema = new Schema<IRegistration>(
  {
    teamName: { type: String, required: true, trim: true, unique: true, index: true },
    domain: { type: String, required: true, index: true },
    teamSize: { type: Number, required: true, min: 3, max: 3 },
    college: { type: String, required: true, trim: true, index: true },
    leader: {
      name: { type: String, required: true, trim: true },
      email: { type: String, required: true, trim: true, lowercase: true, unique: true },
      phone: { type: String, required: true, trim: true },
      year: { type: String, required: true },
    },
    members: { type: [MemberSchema], default: [] },
    transactionId: { type: String, required: true, trim: true, unique: true },
    screenshotUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for common admin queries
RegistrationSchema.index({ domain: 1, createdAt: -1 });
RegistrationSchema.index({ createdAt: -1 });

// Prevent model recompilation in dev
const Registration: Model<IRegistration> =
  mongoose.models.Registration ||
  mongoose.model<IRegistration>("Registration", RegistrationSchema);

export default Registration;
