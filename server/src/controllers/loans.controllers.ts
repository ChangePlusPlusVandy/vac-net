import OutstandingLoan, { type Loan } from "../models/OutstandingLoan";
import { type Request, type Response } from "express";

const { ObjectId } = require("mongoose").Types;

const editLoan = async (req: Request, res: Response): Promise<any> => {
  try {
    const loan = req.body as Loan;
    const id = new ObjectId(req.body._id);
    if (id) {
      console.log(req.body);
      const result = await OutstandingLoan.findByIdAndUpdate(id, {$set: req.body.content});
      return res.status(200).send(result);
    } else {
      return res.status(404).send({ message: "Missing Loan ID" });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({message: err.message});
    }
  }
};

const deleteLoan = async (req: Request, res: Response): Promise<any> => {
  const userId = req.body._id;
  try {
    if (userId) {
      await OutstandingLoan.deleteOne({ _id: new ObjectId(userId) });
      res.status(200).json({ message: "Successfully deleted." });
    }
    else {
      return res.status(500).send("Invalid ID query");
    }
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({message: err.message});
    }
  }
};

export { editLoan, deleteLoan };
