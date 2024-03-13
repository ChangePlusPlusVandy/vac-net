import {
  createOutstandingLoan,
  deleteLoan,
  editLoan,
  getDelinquentPayment,
  getLoanById,
  getLoans,
  getOutstandingLoansWithinInterval,
  associateBeneficiaryWithLoan,
  dissociateBeneficiaryFromLoan,
  associateSessionWithLoan,
  dissociateSessionFromLoan
} from "../controllers/loans.controllers";

import express from "express";

const loanRouter = express.Router();

loanRouter.put("/", editLoan);
loanRouter.delete("/:_id", deleteLoan);
loanRouter.post("/", createOutstandingLoan);
loanRouter.get("/", getLoanById);
loanRouter.get("/getall", getLoans);
loanRouter.get("/getDelinquent", getDelinquentPayment);
loanRouter.get("/expectedrev", getOutstandingLoansWithinInterval);

// New routes for associating loans and sessions
loanRouter.put("/:id/beneficiaries/:beneId", associateBeneficiaryWithLoan);
loanRouter.delete("/:id/beneficiaries/:beneId", dissociateBeneficiaryFromLoan);
loanRouter.put("/:id/sessions/:sessionId", associateSessionWithLoan);
loanRouter.delete("/:id/sessions/:sessionId", dissociateSessionFromLoan);

export default loanRouter;
