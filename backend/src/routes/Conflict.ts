import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import ConflictModel, { IConflict } from "@entities/Conflict";

//create conflict
export async function createConflict(req: Request, res: Response) {
    try {
        const conflict = new ConflictModel(req.body);
        await conflict.save();
        res.status(StatusCodes.CREATED).json(conflict);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

//get all conflicts
export async function getConflicts(req: Request, res: Response) {
    try {
        const conflicts = await ConflictModel.find();
        res.status(StatusCodes.OK).json(conflicts);
    } catch (error) {
        logger.info(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}

//get conflict by userID
export async function getConflictsByUserId(req: Request, res: Response) {
    try {
        const conflicts = await ConflictModel.find({ user: req.params.id });
        res.json(conflicts);
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
}
