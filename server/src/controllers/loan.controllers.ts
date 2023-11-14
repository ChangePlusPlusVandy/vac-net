import { type Request, type Response } from "express";
import OutstandingLoan, { type Loan } from "../models/OutstandingLoan";

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
    const loans = await OutstandingLoan.find();

    return res.status(200).json(loans);
  } catch (err) {
    if (err instanceof Error) {
      console.error(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.error("Something unexpected happened");
  }
};

export { createOutstandingLoan, getLoanById, getLoans };
