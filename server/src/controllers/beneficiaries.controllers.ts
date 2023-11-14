import { type Request, type Response } from "express";

import BeneficiaryModel, {
  type IBeneficiary,
} from "../models/BeneficiaryModel";

const editBeneficiary = async (req: Request, res: Response): Promise<void> => {
  const beneficiaryId = req.query?._id;
  const beneficiaryContent = req.body as IBeneficiary;

  try {
    if (beneficiaryId) {
      const beneficiary = await BeneficiaryModel.findByIdAndUpdate(
        beneficiaryId,
        beneficiaryContent,
        { new: true },
      );

      console.log(beneficiary);
      res.status(200).json(beneficiary);
    } else {
      res.status(400).send({ message: "Missing Beneficiary ID" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, error.message);
      res.status(500).send({ message: error.message });
    }
  }
};

const deleteBeneficiary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const beneficiaryId = req.query?.id;
  console.log(req.query);
  try {
    if (beneficiaryId) {
      await BeneficiaryModel.deleteOne({ _id: beneficiaryId });
      res.status(200).json({ message: "Beneficiary successfully deleted." });
    } else {
      res.status(500).send("Invalid ID query");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, error.message);
      res.status(500).send({ message: error.message });
    }
  }
};

export { editBeneficiary, deleteBeneficiary };
