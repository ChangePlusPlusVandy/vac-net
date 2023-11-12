import OutstandingLoan, { type Loan } from "../models/OutstandingLoan";
import { type Request, type Response } from "express";

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

export { editLoan, deleteLoan };
