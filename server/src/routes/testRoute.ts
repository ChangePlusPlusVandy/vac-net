import express from "express";
import { editBeneficiary, deleteBeneficiary } from "../controllers/beneficiaries.controllers";
const beneficiaryRoute = express.Router(); 

beneficiaryRoute.put("/", editBeneficiary);
beneficiaryRoute.delete("/", deleteBeneficiary);

export { beneficiaryRoute };
