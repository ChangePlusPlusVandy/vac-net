import {
  createStaff,
  deleteStaff,
  editStaff,
  getAllStaff,
  getStaffByFirebaseId,
  getStaffById,
  associateSessionWithStaff,
  dissociateSessionFromStaff,
} from "../controllers/users.controllers";

import express from "express";

const staffRouter = express.Router();

staffRouter.post("/", createStaff);
staffRouter.get("/allstaff", getAllStaff);
staffRouter.get("/getstaff", getStaffById);
staffRouter.get("/", getStaffByFirebaseId);
staffRouter.post("/edit", editStaff);
staffRouter.delete("/", deleteStaff);

// New routes for associating sessions
staffRouter.put("/:id/sessions/:sessionId", associateSessionWithStaff);
staffRouter.delete("/:id/sessions/:sessionId", dissociateSessionFromStaff);

export default staffRouter;
