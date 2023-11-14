import Beneficiary from "../models/BeneficiaryModel";
import { type Request, type Response } from "express";

const createBeneficiary = async (req: Request, res: Response) => {
  try {
    const newBeneficiary = await Beneficiary.create(req.body);
    await newBeneficiary.save();

    return res.status(200).json(newBeneficiary);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

const getBeneficiaryById = async (req: Request, res: Response) => {
  const beneficiaryID = req.query?.id;
  try {
    if (beneficiaryID) {
      const beneficiary = await Beneficiary.findById(beneficiaryID).exec();
      return res.status(200).json(beneficiary);
    } else {
      return res.status(500).send("Invalid ID query");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

const getBeneficiaries = async (req: Request, res: Response) => {
  try {
    const allUsers = await Beneficiary.find({});
    return res.status(200).json(allUsers);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

export { createBeneficiary, getBeneficiaryById, getBeneficiaries };
