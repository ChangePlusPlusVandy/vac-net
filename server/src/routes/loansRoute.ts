import express from "express";
import { editLoan, deleteLoan } from "../controllers/loans.controllers";

const router = express.Router();
router.put("/", editLoan);
router.delete("/", deleteLoan);

export default router;
