import StaffModel from "../models/StaffModel";
import type { Request, Response } from "express";

export const createStaff = async (req: Request, res: Response) => {
  try {
    const newStaff = await StaffModel.create(req.body);
    await newStaff.save();
    return res.status(200).json(newStaff);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

export const getAllStaff = async (req: Request, res: Response) => {
  try {
    const allStaff = await StaffModel.find({});
    return res.status(200).json(allStaff);
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

export const getStaffById = async (req: Request, res: Response) => {
  const staffId = req.query?.staffId;
  try {
    if (staffId) {
      const staff = await StaffModel.findById(staffId).exec();
      return res.status(200).json(staff);
    } else {
      return res.status(500).send("Invalid ID query");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};

export const getStaffByFirebaseId = async (req: Request, res: Response) => {
  const staffId = req.query?.firebaseUID;
  try {
    if (staffId) {
      const staff = await StaffModel.find({ firebaseUID: staffId });
      return res.status(200).json(staff);
    } else {
      return res.status(500).send("Invalid ID query");
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(err.message);
      return res.status(500).send({ message: err.message });
    }
  }
};
