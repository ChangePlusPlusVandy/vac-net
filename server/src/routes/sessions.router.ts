import express from "express";
import {
  createSession,
  getSessionById,
  getSessions,
} from "../controllers/sessions.controllers";

const sessionRouter = express.Router();

sessionRouter.post("/", createSession);
sessionRouter.get("/:sessionId", getSessionById);
sessionRouter.get("/sessions", getSessions);

export default sessionRouter;
