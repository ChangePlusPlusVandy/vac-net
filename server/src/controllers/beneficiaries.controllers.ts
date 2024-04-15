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
      const beneficiary = await Beneficiary.findById(beneficiaryID)
        .populate("loan")
        .exec();
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
  console.log("got here");
  try {
    const allUsers = await Beneficiary.find({}).populate("associatedLoans");
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
      activeBeneficiaries: activeCount,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

const associateLoanWithBeneficiary = async (req: Request, res: Response) => {
  const { id, loanId } = req.params;
  try {
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      id,
      { $addToSet: { associatedLoans: loanId } }, // Use $addToSet to prevent duplicates
      { new: true }
    ).populate('associatedLoans');
    
    return res.status(200).json(updatedBeneficiary);
  } catch (error) {
    // ... error handling
  }
};

// Controller to dissociate a loan from a beneficiary
const dissociateLoanFromBeneficiary = async (req: Request, res: Response) => {
  const { id, loanId } = req.params;
  try {
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      id,
      { $pull: { associatedLoans: loanId } }, // Use $pull to remove the loanId from the array
      { new: true }
    ).populate('associatedLoans');
    
    return res.status(200).json(updatedBeneficiary);
  } catch (error) {
    // ... error handling
  }
};

// Controller to associate a session with a beneficiary
const associateSessionWithBeneficiary = async (req: Request, res: Response) => {
  const { id, sessionId } = req.params;
  try {
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      id,
      { $addToSet: { associatedSessions: sessionId } }, // Use $addToSet to prevent duplicates
      { new: true }
    ).populate('associatedSessions');
    
    return res.status(200).json(updatedBeneficiary);
  } catch (error) {
    // ... error handling
  }
};

// Controller to dissociate a session from a beneficiary
const dissociateSessionFromBeneficiary = async (req: Request, res: Response) => {
  const { id, sessionId } = req.params;
  try {
    const updatedBeneficiary = await Beneficiary.findByIdAndUpdate(
      id,
      { $pull: { associatedSessions: sessionId } }, // Use $pull to remove the sessionId from the array
      { new: true }
    ).populate('associatedSessions');
    
    return res.status(200).json(updatedBeneficiary);
  } catch (error) {
    // ... error handling
  }
};

export {
  createBeneficiary,
  getBeneficiaryById,
  getBeneficiaries,
  editBeneficiary,
  deleteBeneficiary,
  countBeneficiaries,
  associateLoanWithBeneficiary,
  dissociateLoanFromBeneficiary,
  associateSessionWithBeneficiary,
  dissociateSessionFromBeneficiary,
};
