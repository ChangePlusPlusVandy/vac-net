import {
  createBeneficiary,
  deleteBeneficiary,
  editBeneficiary,
  getBeneficiaries,
  getBeneficiaryById,
} from "../controllers/beneficiaries.controllers";

import express from "express";

const beneficiaryRouter = express.Router();

beneficiaryRouter.put("/", editBeneficiary);
beneficiaryRouter.delete("/", deleteBeneficiary);
beneficiaryRouter.post("/create", createBeneficiary);
beneficiaryRouter.get("/id", getBeneficiaryById);
beneficiaryRouter.get("/all", getBeneficiaries);

export default beneficiaryRouter;
