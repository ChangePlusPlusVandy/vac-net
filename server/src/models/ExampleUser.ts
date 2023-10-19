import mongoose from "mongoose";

interface IUser {
  firebaseUID?: string;
  firstName?: string;
  lastName?: string;
  joinDate?: Date;
  level?: number;
  languages?: string[];
  phoneNumber?: string;
  archived?: boolean;
}

const UserSchema = new mongoose.Schema<IUser>({
  firebaseUID: {
    type: String,
  },
  firstName: {
    type: String,
    //required: true
  },
  lastName: {
    type: String,
    //required: true
  },
  joinDate: {
    type: Date,
    default: () => Date.now(),
    //required: true,
  },
  level: {
    type: Number,
    default: 0,
    //required: true,
  },
  languages: {
    type: [String],
  },
  phoneNumber: {
    type: String,
  },
  archived: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IUser>("User", UserSchema);
