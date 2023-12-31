import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Loan {
  _id: string;
  initialPayment?: number;
  initialPaymentDate?: Date;
  principalLeft?: number;
  nextPaymentDate?: Date;
  nextPaymentAmount?: number;
  archivedLoan?: boolean;
  beneficiary?: string;
  validLoan?: boolean;
}

const LoanSchema = new mongoose.Schema<Loan>({
  initialPayment: {
    type: Number,
  },
  initialPaymentDate: {
    type: Date,
    default: Date.now,
    // You can add required: true if needed
  },
  principalLeft: {
    type: Number,
  },
  nextPaymentDate: {
    type: Date,
    // You can add default values or required: true if needed
  },
  nextPaymentAmount: {
    type: Number,
  },
  archivedLoan: {
    type: Boolean,
    default: false,
  },
  beneficiary: {
    type: Schema.Types.ObjectId,
    ref: "Beneficiary",
  },
  validLoan: {
    type: Boolean,
  },
});

export default mongoose.model<Loan>("OutstandingLoan", LoanSchema);
