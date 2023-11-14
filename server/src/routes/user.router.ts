import {
  createStaff,
  getAllStaff,
  getStaffByFirebaseId,
  getStaffById,
} from "../controllers/users.controllers";

import express from "express";

const staffRoute = express.Router();

staffRoute.post("/", createStaff);
staffRoute.get("/allstaff", getAllStaff);
staffRoute.get("/getstaff", getStaffById);
staffRoute.get("/", getStaffByFirebaseId);

export default staffRoute;
