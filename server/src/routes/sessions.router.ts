import {
  createSession,
  deleteSession,
  editSession,
  getSessionById,
  getSessions,
  getNoShows,
} from "../controllers/session.controllers";

import express from "express";

const sessionRouter = express.Router();

sessionRouter.post("/", createSession);
sessionRouter.get("/sessions", getSessions);
sessionRouter.get("/noshows", getNoShows);
sessionRouter.get("/:sessionId", getSessionById);
sessionRouter.put("/", editSession);
sessionRouter.delete("/", deleteSession);

export default sessionRouter;
