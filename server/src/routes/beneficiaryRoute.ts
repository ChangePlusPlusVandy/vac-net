import {
  createBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
} from "../controllers/beneficiaries.controllers";

import express from "express";

const beneficiaryRouter = express.Router();

beneficiaryRouter.post("/create", createBeneficiary);
beneficiaryRouter.get("/id", getBeneficiaryById);
beneficiaryRouter.get("/all", getBeneficiaries);

export default beneficiaryRouter;
