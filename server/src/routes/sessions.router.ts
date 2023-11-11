import { deleteSession, editSession } from "../controllers/session.controllors";

import express from "express";

const router = express.Router();

router.delete("/", deleteSession);
router.put("/", editSession);

export default router;
