import mongoose from "mongoose";

export interface ISession {
  _id: string;
  sessionDate: Date;
  region: string;
  staff: string[];
  archived?: boolean;
  attendance: string[];
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
  attendance: {
    type: [String],
  },
});

export default mongoose.model<ISession>("Session", SessionSchema);
