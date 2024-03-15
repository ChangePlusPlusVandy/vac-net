import mongoose, { Schema } from "mongoose";

import { type ObjectId } from "mongodb";

export interface IStaff {
  firstName?: string;
  lastName?: string;
  firebaseUID?: string;
  joinDate?: Date;
  status?: string;
  clearance?: string;
  bookmarkedBeneficiaries?: string[];
  trackedSessions?: string[];
  sessions?: ObjectId;
}

const StaffSchema = new mongoose.Schema<IStaff>({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  firebaseUID: {
    type: String,
    required: true,
  },
  joinDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  clearance: {
    type: String,
    required: true,
  },
  bookmarkedBeneficiaries: {
    type: [String],
  },
  trackedSessions: {
    type: [String],
  },
  sessions: {
    type: Schema.Types.ObjectId,
    ref: "Session",
  },
});

export default mongoose.model<IStaff>("Staff", StaffSchema);
