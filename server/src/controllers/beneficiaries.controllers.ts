import { type Request, type Response } from "express";

import Beneficiary, { type IBeneficiary } from "../models/BeneficiaryModel";

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

const editBeneficiary = async (req: Request, res: Response): Promise<void> => {
  const beneficiaryId = req.query?._id;
  const beneficiaryContent = req.body as IBeneficiary;

  try {
    if (beneficiaryId) {
      const beneficiary = await Beneficiary.findByIdAndUpdate(
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

const deleteBeneficiary = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const beneficiaryId = req.query?.id;
  console.log(req.query);
  try {
    if (beneficiaryId) {
      await Beneficiary.deleteOne({ _id: beneficiaryId });
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

const countBeneficiaries = async (req: Request, res: Response) => {
  try {
    const totalCount = await Beneficiary.countDocuments();
    const activeCount = await Beneficiary.countDocuments({ archived: false });

    return res.status(200).json({
      totalBeneficiaries: totalCount,
      activeBeneficiaries: activeCount
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

export {
  createBeneficiary,
  getBeneficiaryById,
  getBeneficiaries,
  editBeneficiary,
  deleteBeneficiary,
  countBeneficiaries
};
