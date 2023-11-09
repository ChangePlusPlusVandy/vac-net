import mongoose from "mongoose";

interface Beneficiary {
  firstName?: string;
  lastName?: string;
  joinDate?: Date;
  languages?: string[];
  phoneNumber?: string;
  archived?: boolean;
  birthday?: Date;
  currentSavings?: Number;
  currentSpending?: Number;
  priorities?: string[];
  children?: Number;
}

const BeneficiarySchema = new mongoose.Schema<Beneficiary>({
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
  birthday: {
    type: Date,
    default: () => Date.now(),
  },
  currentSavings: {
    type: Number,
  },
  currentSpending: {
    type: Number,
  },
  priorities: {
    type: [String],
  },
  children: {
    type: Number,
  },
});

export default mongoose.model<Beneficiary>("Beneficiary", BeneficiarySchema);
