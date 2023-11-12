import { type Request, type Response } from "express";

import Session, { type ISession } from "../models/SessionModel";

const editSession = async (req: Request, res: Response) => {
  try {
    const sessionContent = req.body as ISession;
    const sessionID = sessionContent._id;
    if (sessionID) {
      const updatedSession = await Session.findByIdAndUpdate(
        sessionID,
        sessionContent,
      );
      return res.status(200).json(updatedSession);
    } else {
      return res.status(404).send({ message: "Missing Session ID" });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }
};

const deleteSession = async (req: Request, res: Response) => {
  try {
    const sessionID = req.query.id;
    if (sessionID) {
      await Session.deleteOne({ _id: sessionID });
      return res.status(200).json({ message: "Successfully deleted." });
    } else {
      return res.status(400).send({ message: "Missing Session ID" });
    }
  } catch (err) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
    return res.status(500);
  }
};

export { editSession, deleteSession };
