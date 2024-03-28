import OutstandingLoan, { type Loan } from "../models/OutstandingLoan";
import { type Request, type Response } from "express";

const createOutstandingLoan = async (req: Request, res: Response) => {
  try {
    const newLoan = await OutstandingLoan.create(req.body as Loan);
    await newLoan.save();

    return res.status(200).json(newLoan);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.error("Something unexpected happened");
  }
};

const getLoanById = async (req: Request, res: Response) => {
  const id = req.query.id;

  try {
    const loan = await OutstandingLoan.findById(id).populate("beneficiaries");
    return res.status(200).json(loan);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.error("Something unexpected happened");
  }
};

const getLoans = async (req: Request, res: Response) => {
  try {
    const loans = await OutstandingLoan.find().populate("beneficiaries").populate("associatedSessions");

    return res.status(200).json(loans);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.error("Something unexpected happened");
  }
};

const editLoan = async (req: Request, res: Response): Promise<any> => {
  try {
    const loan = req.body as Loan;
    const id = loan._id;
    if (id) {
      console.log(req.body);
      const result = await OutstandingLoan.findByIdAndUpdate(id, loan);
      return res.status(200).send(result);
    } else {
      return res.status(404).send({ message: "Missing Loan ID" });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

const deleteLoan = async (req: Request, res: Response): Promise<any> => {
  const id = req.query.id;
  try {
    if (id) {
      await OutstandingLoan.deleteOne({ _id: id });
      res.status(200).json({ message: "Successfully deleted." });
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

const getDelinquentPayment = async (req: Request, res: Response) => {
  const date = new Date();
  date.setDate(date.getDate() - 3);

  try {
    const loans = await OutstandingLoan.find({
      nextPaymentDate: { $lt: date },
    }).populate("beneficiaries");
    return res.status(200).json(loans);
  } catch (err) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    } else {
      console.log("Something unexpected happened");
    }
  }
};

const getOutstandingLoansWithinInterval = async (
  req: Request,
  res: Response,
) => {
  try {
    // Extract the number of days from the request
    const days = '14';

    // Calculate the end date of the interva;
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(String(days)));

    // Find outstanding loans within the interval
    const outstandingLoans = await OutstandingLoan.find({
      nextPaymentDate: {
        $gte: new Date(), // today
        $lte: endDate, // endDate
      },
      nextPaymentAmount: { $exists: true, $ne: null },
    });

    const totalNextPaymentAmount = outstandingLoans.reduce((total, loan) => {
      if (loan.nextPaymentAmount !== undefined) {
        return total + loan.nextPaymentAmount;
      }
      return total; // Ensure to always return the total
    }, 0);

    return res.status(200).json({ total: totalNextPaymentAmount });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.error("Something unexpected happened");
  }
};

const associateBeneficiaryWithLoan = async (req: Request, res: Response) => {
  const { id, beneId } = req.params;
  try {
    const updatedLoan = await OutstandingLoan.findByIdAndUpdate(
      id,
      { $addToSet: { beneficiaries: beneId } }, // Use $addToSet to prevent duplicates
      { new: true }
    ).populate('beneficiaries');
    
    return res.status(200).json(updatedLoan);
  } catch (error) {
    // ... error handling
  }
};

// Controller to dissociate a loan from a beneficiary
const dissociateBeneficiaryFromLoan = async (req: Request, res: Response) => {
  const { id, beneId } = req.params;
  try {
    const updatedBeneficiary = await OutstandingLoan.findByIdAndUpdate(
      id,
      { $pull: { beneficiaries: beneId } }, // Use $pull to remove the loanId from the array
      { new: true }
    ).populate('beneficiaries');
    
    return res.status(200).json(updatedBeneficiary);
  } catch (error) {
    // ... error handling
  }
};

// Controller to associate a session with a beneficiary
const associateSessionWithLoan = async (req: Request, res: Response) => {
  const { id, sessionId } = req.params;
  try {
    const updatedBeneficiary = await OutstandingLoan.findByIdAndUpdate(
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
const dissociateSessionFromLoan = async (req: Request, res: Response) => {
  const { id, sessionId } = req.params;
  try {
    const updatedBeneficiary = await OutstandingLoan.findByIdAndUpdate(
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
  editLoan,
  deleteLoan,
  createOutstandingLoan,
  getLoanById,
  getLoans,
  getDelinquentPayment,
  getOutstandingLoansWithinInterval,
  associateBeneficiaryWithLoan,
  dissociateBeneficiaryFromLoan,
  associateSessionWithLoan,
  dissociateSessionFromLoan
};
