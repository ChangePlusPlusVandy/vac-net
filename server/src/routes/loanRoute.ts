import {
  createOutstandingLoan,
  getLoanById,
  getLoans,
} from "../controllers/loan.controllers";

import express from "express";

const loanRoute = express.Router();

loanRoute.post("/", createOutstandingLoan);
loanRoute.get("/", getLoanById);
loanRoute.get("/getall", getLoans);

export default loanRoute;
