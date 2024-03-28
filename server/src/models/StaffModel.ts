import mongoose, { Schema } from "mongoose";

import { type ObjectId } from "mongodb";

export interface IStaff {
  firstName?: string;
  lastName?: string;
  email?: string;
  firebaseUID?: string;
  joinDate?: Date;
  status?: string;
  clearance?: string;
  bookmarkedBeneficiaries?: string[];
  trackedSessions?: string[];
  sessions?: ObjectId[];
}

const StaffSchema = new mongoose.Schema<IStaff>({
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  firebaseUID: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
  },
  clearance: {
    type: String,
  },
  bookmarkedBeneficiaries: {
    type: [String],
  },
  trackedSessions: {
    type: [String],
  },
  sessions: {
    type: [Schema.Types.ObjectId],
    ref: "Session",
  },
});

export default mongoose.model<IStaff>("Staff", StaffSchema);
