import { Request, Response } from "express";
import Timespan , { ITimespan } from "@entities/Timespan";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import { Types } from "mongoose";

export async function getAllTimespan(req: Request, res: Response) {
  const timespan = await Timespan.find({});
  return res.json(timespan);
}

export async function getTimespanById(req: Request, res: Response) {
  const timespan = await Timespan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Timespan not found"
    });
  }
  return res.json(timespan);
}

/*
 assign user to a timespan
 /timespan/:id/user/:userId
 */
export async function assignUserToTimespan(req: Request, res: Response) {
  const timespan = await Timespan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "Timespan not found"
    });
  }
  // is userID valid
  if (!Types.ObjectId.isValid(req.params.userId)) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      message: "User ID is not valid"
    });
  }
  timespan.assigned = (req.body.userId);
  await timespan.save();
  return res.json(timespan);
}