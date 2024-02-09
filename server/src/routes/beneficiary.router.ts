import {
  countBeneficiaries,
  createBeneficiary,
  deleteBeneficiary,
  editBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
  associateLoanWithBeneficiary,
  dissociateLoanFromBeneficiary,
  associateSessionWithBeneficiary,
  dissociateSessionFromBeneficiary,
} from "../controllers/beneficiaries.controllers";

import express from "express";

const beneficiaryRouter = express.Router();

beneficiaryRouter.put("/", editBeneficiary);
beneficiaryRouter.delete("/", deleteBeneficiary);
beneficiaryRouter.post("/create", createBeneficiary);
beneficiaryRouter.get("/id", getBeneficiaryById);
beneficiaryRouter.get("/all", getBeneficiaries);
beneficiaryRouter.get("/count", countBeneficiaries);

// New routes for associating loans and sessions
beneficiaryRouter.put("/:id/loans/:loanId", associateLoanWithBeneficiary);
beneficiaryRouter.delete("/:id/loans/:loanId", dissociateLoanFromBeneficiary);
beneficiaryRouter.put("/:id/sessions/:sessionId", associateSessionWithBeneficiary);
beneficiaryRouter.delete("/:id/sessions/:sessionId", dissociateSessionFromBeneficiary);

export default beneficiaryRouter;
