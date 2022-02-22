import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import ConflictModel, { IConflict } from "@entities/Conflict";
import FTModel, { ITimeFrame } from "@entities/FT";
import { detectAllTFConflicts, sortTFByUser } from "@src/services/conflicts";

//create conflict
export async function createConflict(
  req: Request<Record<string, unknown>, Record<string, unknown>, IConflict>,
  res: Response
): Promise<void> {
  try {
    const conflict = new ConflictModel(req.body);
    await conflict.save();
    res.status(StatusCodes.CREATED).json(conflict);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

//get all conflicts
export async function getConflicts(req: Request, res: Response): Promise<void> {
  try {
    const conflicts = await ConflictModel.find()
      .populate("conflictUser", "-password")
      .populate("conflictWith");
    logger.info(`${conflicts}`);
    res.status(StatusCodes.OK).json(conflicts);
  } catch (error) {
    logger.info(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

//get conflict by userID
export async function getConflictsByUserId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const conflicts = await ConflictModel.find({ user: req.params.id });
    res.json(conflicts);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

/**
 * Very resource intensive function
 * Do not use unless this is completly necessary
 *
 * Detect all TimeFrames related conflicts and send back an array of them
 */
export async function detectAllConflits(
  req: Request,
  res: Response
): Promise<void> {
  // Fetch all timeframes with a required user inside
  const timeFramesWithOrgas: ITimeFrame[] = await FTModel.aggregate()
    .unwind("$timeframes")
    .replaceRoot("$timeframes")
    .match({ "required.type": "user" });

  // sort by user and compute all
  const conflicts = detectAllTFConflicts(sortTFByUser(timeFramesWithOrgas));

  // send them back
  res.send(conflicts);
}
