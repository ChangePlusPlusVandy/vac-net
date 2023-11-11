import express, { type Request, type Response } from "express";
import { read } from "fs";
import OutstandingLoan, {Loan} from "../models/OutstandingLoan";
const mongoose = require("mongoose");


const createOutstandingLoan = async (req: Request, res: Response) => {
    try {
        const {
            initialPayment,
            initialPaymentDate,
            principalLeft,
            nextPaymentDate,
            nextPaymentAmount,
            archivedLoan,
            beneficiary,
            validLoan
        } = req.body;

        
        const newLoan = await OutstandingLoan.create(req.body as Loan);
        await newLoan.save();

        return res.status(200).json(newLoan);
    } catch (err) {
        console.error(err);
        return res.status(500).send({message: err});
    }
}

const getLoanById = async (req: Request, res: Response) => {
    const id = req.query.id;

    try {
        const loan = await OutstandingLoan.findById(id);

        return res.status(200).json(loan);
    } catch (err){
        return res.status(500).send({message: err});
    }
}

const getLoans = async (req: Request, res: Response) => {
    try {
        const loans = await OutstandingLoan.find();
        
        return res.status(200).json(loans);
    } catch (err) {
        return res.status(500).send({message: err});
    }
}

export {createOutstandingLoan, getLoanById, getLoans}