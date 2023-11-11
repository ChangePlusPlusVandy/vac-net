import express from "express";

import {
  createStaff,
  getAllStaff,
  getStaffById,
  getStaffByFirebaseId,
} from "../controllers/staffmodel.controller";

const staffRoute = express.Router();

staffRoute.post("/", createStaff);
staffRoute.get("/allstaff", getAllStaff);
staffRoute.get("/getstaff", getStaffById);
staffRoute.get("/", getStaffByFirebaseId);

export { staffRoute };
