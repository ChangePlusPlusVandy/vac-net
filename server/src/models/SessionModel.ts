import mongoose, { Schema } from "mongoose";
import { type ObjectId } from "mongodb";

export interface ISession {
  _id: string;
  sessionDate?: Date;
  region?: string;
  staff?: string[];
  archived?: boolean;
  expectedAttendance: string[];
  actualAttendance: string[];
  associatedBeneficiaries: mongoose.Types.ObjectId[];
  associatedStaff: mongoose.Types.ObjectId[];
}

const SessionSchema = new mongoose.Schema<ISession>({
  sessionDate: {
    type: Date,
  },
  region: {
    type: String,
  },
  staff: {
    type: [String],
  },
  archived: {
    type: Boolean,
  },
  expectedAttendance: {
    type: [String],
  },
  actualAttendance: {
    type: [String],
  },
  associatedBeneficiaries: [
    {
      type: Schema.Types.ObjectId,
      ref: "Beneficiary",
    },
  ],
  associatedStaff: [
    {
      type: Schema.Types.ObjectId,
      ref: "Staff",
    },
  ],
});

export default mongoose.model<ISession>("Session", SessionSchema);
