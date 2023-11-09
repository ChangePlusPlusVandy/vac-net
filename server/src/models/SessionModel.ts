import mongoose from "mongoose";

interface Session {
  sessionDate: Date;
  region: string;
  staff: string[];
  archived?: boolean;
  attendance: string[];
}

const SessionSchema = new mongoose.Schema<Session>({
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

export default mongoose.model<Session>("Session", SessionSchema);
