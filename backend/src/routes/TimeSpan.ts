import { Request, Response } from "express";
import TimeSpan , { ITimeSpan } from "@entities/TimeSpan";
import StatusCodes from "http-status-codes";
import { Types } from "mongoose";

export async function getAllTimeSpan(req: Request, res: Response) {
  const timespan = await TimeSpan.find({});
  return res.json(timespan);
}

export async function getTimeSpanById(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found"
    });
  }
  return res.json(timespan);
}

/*
 assign user to a timespan
 /timespan/:id/user/:userId
 */
export async function assignUserToTimeSpan(req: Request, res: Response) {
  const timespan = await TimeSpan.findById(req.params.id);
  if (!timespan) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found"
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