import {
  createSession,
  deleteSession,
  editSession,
  getSessionById,
  getSessions,
} from "../controllers/session.controllers";

import express from "express";

const sessionRouter = express.Router();

sessionRouter.post("/", createSession);
sessionRouter.get("/:sessionId", getSessionById);
sessionRouter.get("/sessions", getSessions);
sessionRouter.put("/", editSession);
sessionRouter.delete("/", deleteSession);

export default sessionRouter;
