import Beneficiary from "../models/BeneficiaryModel";
import { Request, Response } from 'express';

const editBeneficiary = async (req: Request, res: Response): Promise<Response> => {
    try {
        const beneficiaryID = req.params.id; // Use params instead of body for ID
        if (beneficiaryID) {
            const result = await Beneficiary.findByIdAndUpdate(
                beneficiaryID,
                req.body,
                { new: true }
            );
            if (!result) {
                return res.status(404).send({ message: "Beneficiary not found" });
            }
            return res.status(200).json(result);
        } else {
            return res.status(404).send({ message: "Missing Beneficiary ID" });
        }
    } catch (err: any) { // using `any` for simplicity; you can also create a custom error type
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

const deleteBeneficiary = async (req: Request, res: Response): Promise<Response> => {
    try {
        const beneficiaryID = req.params.id; // Use params instead of body for ID
        if (beneficiaryID) {
            const result = await Beneficiary.deleteOne({ _id: beneficiaryID });
            if (result.deletedCount === 0) {
                return res.status(404).send({ message: "Beneficiary not found" });
            }
            return res.status(200).json({ message: "Successfully deleted." });
        } else {
            return res.status(400).send({ message: "Missing Beneficiary ID" });
        }
    } catch (err: any) { // using `any` for simplicity; you can also create a custom error type
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
};

export { editBeneficiary, deleteBeneficiary };

