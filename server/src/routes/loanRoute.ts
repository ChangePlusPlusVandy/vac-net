import express, { type Request, type Response } from "express";
const loanRoute = express.Router();

const {
    createOutstandingLoan,
    getLoanById,
    getLoans
} = require("../controllers/loan.controllers");


loanRoute.post("/", createOutstandingLoan)
loanRoute.get("/", getLoanById)
loanRoute.get("/getall", getLoans)

export default loanRoute;