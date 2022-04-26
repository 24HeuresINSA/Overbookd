import { Request, Response } from "express";
import User from "@entities/User";
import TimeSpan from "@entities/TimeSpan";
import PlanningModel from "@entities/Planning";
import logger from "@shared/Logger";
import StatusCodes from "http-status-codes";

export async function createPlanning(
  req: Request,
  res: Response
): Promise<any> {
  //Get user from request
  const userID = req.params.userID;
  const user = await User.findById(userID);
  if (!user) {
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "User not found",
    });
  }
  //Get timespans where assigned is userid
  const timespans = await TimeSpan.find({ assigned: userID });
  if (!timespans) {
    return res.status(StatusCodes.NOT_FOUND).json({
      message: "TimeSpan not found",
    });
  }
}
