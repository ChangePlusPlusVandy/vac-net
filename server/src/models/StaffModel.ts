import mongoose from "mongoose";

interface Staff {
  firstName?: string;
  lastName?: string;
  firebaseUID?: string;
  joinDate?: Date;
  status?: string;
  clearance?: string;
}

const StaffSchema = new mongoose.Schema<Staff>({
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

export default mongoose.model<Staff>("Staff", StaffSchema);
