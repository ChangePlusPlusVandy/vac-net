import { type Request, type Response } from "express";
import Session, { type ISession } from "../models/SessionModel";
import mongoose from "mongoose";

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

const editSession = async (req: Request, res: Response) => {
  try {
    const sessionContent = req.body as ISession;
    const sessionID = sessionContent._id;
    if (sessionID) {
      // Convert associatedStaff to ObjectId
      if (sessionContent.associatedStaff) {
        sessionContent.associatedStaff = sessionContent.associatedStaff.map(
          (staffId) => new mongoose.Types.ObjectId(staffId),
        );
      }
      const updatedSession = await Session.findByIdAndUpdate(
        sessionID,
        sessionContent,
        { new: true }, // return the updated document
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

const getNoShows = async (req: Request, res: Response) => {
  try {
    const sessions = await Session.find({}).populate("expectedAttendance").populate("actualAttendance");

    const ans = []

    for (let session of sessions) {
      const expected = session.expectedAttendance;
      const actual = session.actualAttendance;

      if (!expected || !actual) continue;

      if (expected.length > actual.length) {
        ans.push(session)
      }
    }

    return res.status(200).json(ans);


  } catch (err) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }

};

const getSessionCountWithinInterval = async (req: Request, res: Response) => {
  try {
    // Get the day number from the request query
    const days = 14;

    // Calculate the start and end dates of the interval
    const currentDate = new Date();
    const endDate = new Date(currentDate);
    endDate.setDate(currentDate.getDate() + days);

    // Find Session objects within the future interval
    const sessionCount = await Session.find({
      sessionDate: {
        $gte: currentDate,
        $lte: endDate,
      },
    });

    return res.status(200).json({ total: sessionCount.length });
  } catch (err) {
    if (err instanceof Error) {
      console.log(err, err.message);
      return res.status(500).send({ message: err.message });
    }
    console.log("Something unexpected went wrong");
  }
};

export {
  createSession,
  getSessionById,
  getSessions,
  editSession,
  deleteSession,
  getNoShows,
  getSessionCountWithinInterval,
};
