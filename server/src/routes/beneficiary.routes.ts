import express from 'express';
import { editBeneficiary, deleteBeneficiary } from '../controllers/beneficiary.controllers';

const router = express.Router();

// Endpoint for editing a beneficiary with a given ID
// The `verifyToken` middleware is not added here since it's already applied in `index.ts`
router.put('/:id', editBeneficiary);

// Endpoint for deleting a beneficiary with a given ID
router.delete('/:id', deleteBeneficiary);

export default router;
