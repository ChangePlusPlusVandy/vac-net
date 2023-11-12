import {
  deleteBeneficiary,
  editBeneficiary,
} from "../controllers/beneficiaries.controllers";

import express from "express";

const beneficiaryRoute = express.Router();

beneficiaryRoute.put("/", editBeneficiary);
beneficiaryRoute.delete("/", deleteBeneficiary);

export { beneficiaryRoute };
