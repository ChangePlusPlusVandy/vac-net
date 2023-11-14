import {
  deleteBeneficiary,
  editBeneficiary,
} from "../controllers/beneficiary.controllers";

import express from "express";

const router = express.Router();

router.put("/:id", editBeneficiary);
router.delete("/:id", deleteBeneficiary);

export default router;
