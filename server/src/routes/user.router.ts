import {
  associateSessionWithStaff,
  createStaff,
  deleteStaff,
  dissociateSessionFromStaff,
  editStaff,
  getAllStaff,
  getStaffByFirebaseId,
  getStaffById
} from "../controllers/users.controllers";

import express from "express";

const staffRouter = express.Router();

staffRouter.post("/", createStaff);
staffRouter.get("/allstaff", getAllStaff);
staffRouter.get("/getstaff", getStaffById);
staffRouter.get("/", getStaffByFirebaseId);
staffRouter.post("/edit", editStaff);
staffRouter.delete("/", deleteStaff);
staffRouter.put("/:id/sessions/:sessionId", associateSessionWithStaff);
staffRouter.delete("/:id/sessions", dissociateSessionFromStaff);

export default staffRouter;
