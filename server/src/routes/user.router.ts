import {
  createStaff,
  deleteStaff,
  editStaff,
  getAllStaff,
  getStaffByFirebaseId,
  getStaffById,
} from "../controllers/users.controllers";

import express from "express";

const staffRouter = express.Router();

staffRouter.post("/", createStaff);
staffRouter.get("/allstaff", getAllStaff);
staffRouter.get("/getstaff", getStaffById);
staffRouter.get("/", getStaffByFirebaseId);
staffRouter.put("/", editStaff);
staffRouter.delete("/", deleteStaff);

export default staffRouter;
