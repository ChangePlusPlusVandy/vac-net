import {
  createOutstandingLoan,
  deleteLoan,
  editLoan,
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

export default loanRouter;
