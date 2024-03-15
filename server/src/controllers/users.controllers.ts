import StaffModel, { type IStaff } from "../models/StaffModel";
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
    const allStaff = await StaffModel.find({})
    .populate("sessions")
    .exec();
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
      const staff = await StaffModel.findById(staffId)
      .populate("sessions")
      .exec();
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

export const editStaff = async (req: Request, res: Response): Promise<void> => {
  const staffId = req.query?.id;
  const staffContent = req.body as IStaff;

  console.log("Got here", staffId, staffContent);

  try {
    if (staffId) {
      const staff = await StaffModel.findByIdAndUpdate(staffId, staffContent, {
        new: true,
      });
      console.log(staff);
      res.status(200).json(staff);
    } else {
      res.status(400).send({ message: "Missing Staff ID" });
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, error.message);
      res.status(500).send({ message: error.message });
    }
  }
};

export const deleteStaff = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const staffId = req.query?.id;
  console.log(req.query);
  try {
    if (staffId) {
      await StaffModel.deleteOne({ _id: staffId });
      res.status(200).json({ message: "Staff successfully deleted." });
    } else {
      res.status(500).send("Invalid ID query");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.log(error, error.message);
      res.status(500).send({ message: error.message });
    }
  }
};
