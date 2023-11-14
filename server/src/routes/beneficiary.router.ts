import {
  deleteBeneficiary,
  editBeneficiary,
} from "../controllers/beneficiaries.controllers";

import express from "express";

const beneficiaryRouter = express.Router();

beneficiaryRouter.put("/", editBeneficiary);
beneficiaryRouter.delete("/", deleteBeneficiary);

export default beneficiaryRouter;
