import OutstandingLoan from "../models/OutstandingLoan";
import {type Request, type Response} from "express";

const { ObjectId } = require("mongoose").Types;

const editLoan = async (req: Request, res: Response): Promise<any> => {
  try {
    const id = new ObjectId(req.body._id);
    if (id) {
      console.log(req.body);
      await OutstandingLoan.findByIdAndUpdate(id, {$set: req.body.content})
        .then((result) => res.status(200).json(result))
        .catch((error) => {
          console.log(error);
          res.status(400).send({ message: error });
        });
    } else {
      return res.status(404).send({ message: "Missing Loan ID" });
    }
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

const deleteLoan = async (req: Request, res: Response): Promise<any> => {
  const userId = req.body._id;
  try {
    if (userId)
      await OutstandingLoan.deleteOne({ _id: new ObjectId(userId) }).then(() =>
          res.status(200).json({ message: "Successfully deleted." }));
    else
      return res.status(500).send("Invalid ID query");
  } catch (err: any) {
    console.error(err.message);
    return res.status(500).send({ message: err.message });
  }
};

export { editLoan, deleteLoan };
