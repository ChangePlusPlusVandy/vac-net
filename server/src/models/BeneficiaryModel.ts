import mongoose from "mongoose";

export interface IBeneficiary {
  firstName?: string;
  lastName?: string;
  joinDate?: Date;
  languages?: string[];
  phoneNumber?: string;
  archived?: boolean;
  birthday?: Date;
  currentSavings?: number;
  currentSpending?: number;
  priorities?: string[];
  children?: number;
}

const BeneficiarySchema = new mongoose.Schema<IBeneficiary>({
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

export default mongoose.model<IBeneficiary>("Beneficiary", BeneficiarySchema);
