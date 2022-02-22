import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import ConflictModel, { IConflict } from "@entities/Conflict";
import FTModel from "@entities/FT";
import { ITimeFrame, isTFRequiredUser, ITFRequiredUser } from "../entities/FT";
import { Types } from "mongoose";

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

/**
 * Sorting timeframes by user required. A timeFrame can be present multiple times if multiple users are required
 * @param tfs TimeFrames array
 * @returns Dict with stringified user _id as key and array of timeFrames for each user as value
 */
function sortTFByUser(tfs: ITimeFrame[]): Record<string, Array<ITimeFrame>> {
  // Store them sorted by user
  const TFsByOrga: Record<string, Array<ITimeFrame>> = {};

  tfs.forEach((tf) => {
    tf.required.filter(isTFRequiredUser).forEach((req) => {
      const id = req.user._id.toString();
      if (!TFsByOrga[id]) {
        TFsByOrga[id] = [];
      }
      TFsByOrga[id].push(tf);
    });
  });

  return TFsByOrga;
}

/**
 * Calculate TimeFrame Conflict for the given input
 * @param TFsByOrga TimeFrames to include in the computation sorted with keys as stringified user required _id
 * @returns TimeFrame Conflict array
 */
function detectAllTFConflicts(
  TFsByOrga: Record<string, Array<ITimeFrame>>
): IConflict[] {
  const conflicts: IConflict[] = [];
  for (const [key, value] of Object.entries(TFsByOrga)) {
    value.forEach((v, i) => {
      for (let j = 0; j < i; j++) {
        if (isOverlappingTFs(v, value[j])) {
          // overlap detected
          conflicts.push({
            conflictUser: Types.ObjectId(key),
            conflictTF1: v._id,
            conflictTF2: value[j]._id,
            type: "TF",
          });
        }
      }
    });
  }

  return conflicts;
}

/**
 * Determine wether or not 2 timeFrames are overlapping in time
 *
 * Checks if :
 * 1 starts strictly after 2 starts AND 1 starts strictly before 2 ends OR
 * 1 ends after 2 strictly starts AND 1 ends strictly before 2 ends OR
 * 1 starts before 2 start AND 1 ends after 2 ends
 *
 * @param tf1 timeFrame 1
 * @param tf2 timeFrame 2
 * @returns If the timeFrames overlap or not
 */
function isOverlappingTFs(tf1: ITimeFrame, tf2: ITimeFrame): boolean {
  // 1 starts between the two borders of 2
  if (tf1.start > tf2.start && tf1.start < tf2.end) {
    return true;
  }
  // 1 ends between the two borders of 2
  if (tf1.end > tf2.start && tf1.end < tf2.end) {
    return true;
  }
  // 1 is larger or equal to 2
  if (tf1.start <= tf2.start && tf1.end >= tf2.end) {
    return true;
  }
  return false;
}
