import express from "express";
import {
  editBeneficiary,
  deleteBeneficiary,
} from "../controllers/beneficiaries.controllers";
const beneficiaryRoute = express.Router();

beneficiaryRoute.put("/:_id", editBeneficiary);
beneficiaryRoute.delete("/:_id", deleteBeneficiary);

export { beneficiaryRoute };
