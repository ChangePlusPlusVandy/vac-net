import mongoose from "mongoose";
const { Schema } = mongoose;

export interface Loan {
  _id?: string;
  initialPayment?: number;
  initialPaymentDate?: Date;
  principalLeft?: number;
  nextPaymentDate?: Date;
  nextPaymentAmount?: number;
  paymentFrequency?: string;
  archivedLoan?: boolean;
  beneficiaries?: string[];
  validLoan?: boolean;
  loanStatus?: string;
  associatedSessions?: string[];
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
  paymentFrequency: {
    type: String,
  },
  archivedLoan: {
    type: Boolean,
    default: false,
  },
  beneficiaries: {
    type: [Schema.Types.ObjectId],
    ref: "Beneficiary",
  },
  validLoan: {
    type: Boolean,
  },
  loanStatus: {
    type: String,
    required: true,
  },
  associatedSessions: {
    type: [Schema.Types.ObjectId],
    ref: "Session",
  },
});

export default mongoose.model<Loan>("OutstandingLoan", LoanSchema);
