import Beneficiary, { type IBeneficiary } from "../models/BeneficiaryModel";
import { type Request, type Response } from "express";

const editBeneficiary = async (req: Request, res: Response) => {
  try {
    const beneficiaryID = req.params.id; // Use params instead of body for ID
    if (beneficiaryID) {
      const result = await Beneficiary.findByIdAndUpdate(
        beneficiaryID,
        req.body as IBeneficiary,
        { new: true },
      );
      if (!result) {
        return res.status(404).send({ message: "Beneficiary not found" });
      }
      return res.status(200).json(result);
    } else {
      return res.status(404).send({ message: "Missing Beneficiary ID" });
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }
};

const deleteBeneficiary = async (req: Request, res: Response) => {
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
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }
};

export { editBeneficiary, deleteBeneficiary };
