import mongoose from "mongoose";

export interface IStaff {
  firstName?: string;
  lastName?: string;
  firebaseUID?: string;
  joinDate?: Date;
  status?: string;
  clearance?: string;
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
});

export default mongoose.model<IStaff>("Staff", StaffSchema);
