import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import ConflictModel, { IConflict } from "@entities/Conflict";
import FTModel, { ITimeFrame } from "@entities/FT";
import {
  computeAllTFConflicts,
  getFTConflicts,
  sortTFByUser,
} from "@src/services/conflict";
import { Types } from "mongoose";
import { ITFConflict } from "../entities/Conflict";
import { getTimeFrameById } from "@src/services/timeFrame";
import { getFTByID } from "./FT";
import { getTimeFrameByIdOpts } from "../services/timeFrame";
import { read } from "fs";

/**
 * Should conflict only be created on backend side ? Then the
 * use of this function is @deprecated
 */
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

/**
 *  Get all TF conflicts
 * todo: remove ts-ignore and improve structures
 */
export async function getTFConflicts(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const conflicts: ITFConflict[] = await ConflictModel.find({ type: "TF" })
      .populate({ path: "user", select: "firstname lastname" })
      .lean();

    const populatedConflicts: ITFConflict<unknown | undefined>[] = [];

    const queryOptions: getTimeFrameByIdOpts = {
      select: ["start", "end"],
      ft: { include: true, fields: ["general", "FA", "count"] },
    };

    // Resolve all promises inside
    await Promise.all(
      conflicts.map(async (c) => {
        populatedConflicts.push({
          ...c,
          tf1: await getTimeFrameById(c.tf1, queryOptions),
          tf2: await getTimeFrameById(c.tf2, queryOptions),
        });
      })
    );

    res.status(StatusCodes.OK).json(populatedConflicts);
  } catch (error) {
    logger.warn(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

/**
 * Fetch all timeFrames for 1 FT and then fetch all conflicts for
 * each specific timeFrames.
 *
 * @param req params needs to have the FTId
 * @param res Send back the array of conflicts
 * @returns nothing
 */
export async function oldGetTFConflictsByFTId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Parse objectId of the FT
    const FTId = Types.ObjectId(req.params.FTId);

    const FT = await FTModel.findById(FTId).lean();
    if (!FT) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }
    // Find conflicts for all timeFrames of the FT
    const conflicts = await getFTConflicts;
    // return all found conflicts
    res.json(conflicts);
  } catch (error) {
    logger.warn(error);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

export async function updateTFConflictsByFTId(
  req: Request,
  res: Response
): Promise<void> {
  try {
    // Parse objectId of the FT
    const FTId = Types.ObjectId(req.params.FTId);

    // Get FT
    const FT = await FTModel.findById(FTId).lean();
    if (!FT) {
      res.sendStatus(StatusCodes.BAD_REQUEST);
      return;
    }

    // Compute conflicts
    sortTFByUser(FT.timeframes);
  } catch (error) {
    logger.warn(error);
    res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
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
 * Delete all timeFrames conflicts and recompute them
 * Send a proper array to the database
 *
 * Detect all TimeFrames related conflicts and send back an array of them
 */
export async function detectAllTFConflictsHandler(
  req: Request,
  res: Response
): Promise<void> {
  // Remove all existing TF conflicts
  await ConflictModel.deleteMany({ type: "TF" });

  // Fetch all timeframes with a required user inside
  const timeFramesWithOrgas: ITimeFrame[] = await FTModel.aggregate()
    .unwind("$timeframes")
    .replaceRoot("$timeframes")
    .match({ "required.type": "user" });

  // sort by user and compute all
  const conflicts = computeAllTFConflicts(sortTFByUser(timeFramesWithOrgas));

  await ConflictModel.insertMany(conflicts);

  // send them back
  res.json(conflicts);
}

/**
 * For a given FT find all conflicts and populate otherTf inside to have the other timeFrame infos
 */
export async function getTFConflictsByFTCount(
  req: Request,
  res: Response
): Promise<void> {
  const ft = await FTModel.findOne({ count: req.params.FTCount }).lean();

  if (!ft) {
    throw new Error("Did not find the FT for conflicts");
  }
  let conflictsTf1: ITFConflict[] = [];
  let conflictsTf2: ITFConflict[] = [];

  // Fetch conflicts from both timeframes
  await Promise.all(
    ft.timeframes.map(async (tf) => {
      conflictsTf1 = conflictsTf1.concat(
        await ConflictModel.find({
          // type: "FT",
          tf1: tf._id,
        }).lean()
      );
      conflictsTf2 = conflictsTf2.concat(
        await ConflictModel.find({
          // type: "TF",
          tf2: tf._id,
        }).lean()
      );
    })
  );

  // populate conflicts with the other timeframe

  conflictsTf1 = await Promise.all(
    conflictsTf1.map(async (c) =>
      // remove tf1 and tf2 and populate other tf
      ({
        ...c,
        otherTf: await getTimeFrameById(c.tf1, {
          select: ["start", "end"],
          ft: { include: true, fields: ["general"] },
        }),
      })
    )
  );
  conflictsTf2 = await Promise.all(
    conflictsTf2.map(async (c) =>
      // remove tf1 and tf2 and populate other tf
      ({
        ...c,
        otherTf: await getTimeFrameById(c.tf1, {
          select: ["start", "end"],
          ft: { include: true, fields: ["general"] },
        }),
      })
    )
  );

  res.json(conflictsTf1.concat(conflictsTf2));
  return;
}
