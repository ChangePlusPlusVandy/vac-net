import { type Request, type Response } from "express";
import Session from "../models/SessionModel";

const createSession = async (req: Request, res: Response) => {
  try {
    const newSession = await Session.create(req.body);
    await newSession.save();

    return res.status(200).json(newSession);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }
};

const getSessionById = async (req: Request, res: Response) => {
  const sessionId = req.params.sessionId;
  try {
    if (sessionId) {
      const session = await Session.findById(sessionId).exec();

      if (!session) {
        return res.status(500).send("Invalid ID query");
      }

      return res.status(200).json(session);
    } else {
      return res.status(400).send("No sessionId provided");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }
};

const getSessions = async (req: Request, res: Response) => {
  try {
    const allSessions = await Session.find({});
    return res.status(200).json(allSessions);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }
};

export { createSession, getSessionById, getSessions };
