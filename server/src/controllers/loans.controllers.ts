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
    const loan = await OutstandingLoan.findById(id);

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
    const loans = await OutstandingLoan.find().populate("beneficiary");

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
    });
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

export {
  editLoan,
  deleteLoan,
  createOutstandingLoan,
  getLoanById,
  getLoans,
  getDelinquentPayment,
};
