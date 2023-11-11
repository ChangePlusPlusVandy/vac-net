const express = require('express');
const beneficiaryRouter = express.Router();

const {
    createBeneficiary,
    getBeneficiaryById,
    getBeneficiaries,
} = require("../controllers/beneficiaries.controllers.ts");

// POST request to create a new beneficiary
beneficiaryRouter.post("/create", createBeneficiary);

// GET request to get a beneficiary by ID
beneficiaryRouter.get("/id", getBeneficiaryById);

// GET request to get all beneficiaries
beneficiaryRouter.get("/all", getBeneficiaries);

export { beneficiaryRouter };
