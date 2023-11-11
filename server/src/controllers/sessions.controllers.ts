import { AnyAaaaRecord } from "dns";
import Session from "../models/SessionModel";
import { Request, Response } from 'express';

const createSession = async (req: Request, res: Response) => {
    try {
        const {
            sessionDate,
            region,
            staff,
            archived,
            attendance
        } = req.body;

        const newSession = await Session.create(req.body);
        await newSession.save();

        return res.status(200).json(newSession);
    } catch (error: any) {
        console.error(error.message);
        return res.status(500).send({ message: error.message });
    }
};

const getSessionById = async (req: Request, res: Response) => {
    const sessionId = req.params.sessionId;
    try {
            const session = await Session.findById(sessionId).exec();

            if (!session) {
                return res.status(500).send("Invalid ID query");
            }
            
            return res.status(200).json(session);
            
    } catch (err: any) {
        console.error(err.message);
        return res.status(500).send({ message: err.message });
    }
}

const getSessions = async (req: Request, res: Response) => {
    try {
        const allSessions = await Session.find({});
        return res.status(200).json(allSessions);
    } catch (err: any) {
        console.error(err.message);
        return res.status
    }
}

export { createSession, getSessionById, getSessions };