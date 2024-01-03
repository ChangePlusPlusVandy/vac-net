import {
  createOutstandingLoan,
  deleteLoan,
  editLoan,
  getDelinquentPayment,
  getLoanById,
  getLoans,
} from "../controllers/loans.controllers";

import express from "express";

const loanRouter = express.Router();

loanRouter.put("/", editLoan);
loanRouter.delete("/:_id", deleteLoan);
loanRouter.post("/", createOutstandingLoan);
loanRouter.get("/", getLoanById);
loanRouter.get("/getall", getLoans);
loanRouter.get("/getDelinquent", getDelinquentPayment)

export default loanRouter;
