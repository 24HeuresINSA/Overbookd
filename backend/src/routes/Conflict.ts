import { Request, Response } from "express";
import StatusCodes from "http-status-codes";
import logger from "@shared/Logger";
import ConflictModel, { IConflict } from "@entities/Conflict";
import FTModel, { ITimeFrame } from "@entities/FT";
import {
  computeAllTFConflicts,
  computeFTConflicts,
  computeAvailabilityConflicts,
  getFTConflicts,
  sortTFByUser,
  computeFTAllConflicts,
} from "@src/services/conflict";
import { Types } from "mongoose";
import { ITFConflict } from "../entities/Conflict";
import { getTimeFrameById } from "@src/services/timeFrame";
import { getTimeFrameByIdOpts } from "../services/timeFrame";

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

declare type ReturnType = IConflict & { ft1: number; ft2: number };
export async function getConflicts(req: Request, res: Response) {
  try {
    const conflicts = await ConflictModel.find()
      .populate({
        path: "user",
        select: "firstname lastname",
      })
      .lean();
    const ret: ReturnType[] = [];
    await Promise.all(
      conflicts.map(async (conflict: IConflict) => {
        if (conflict.type === "TF") {
          const ft1 = await FTModel.findOne({
            "timeframes._id": conflict.tf1,
          }).lean();
          const ft2 = await FTModel.findOne({
            "timeframes._id": conflict.tf2,
          }).lean();
          if (!ft1 || !ft2) {
            logger.err(`Conflict with unknown timeframe ${conflict.tf1} or ${conflict.tf2}`);
            return res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
          }
          ret.push({
            ...conflict,
            ft1: ft1.count,
            ft2: ft2.count,
          });
        } else if (conflict.type === "TS") {
          //TODO
        } else if (conflict.type === "availability") {
          const ft = await FTModel.findOne({
            "timeframes._id": conflict.tf1,
          }).lean();
          if (ft) {
            ret.push({
              ...conflict,
              ft1: ft.count,
              ft2: ft.count,
            });
          }
        }
      })
    );

    res.status(StatusCodes.OK).json(ret);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
  }
}

/**
 *  Get all TF conflicts
 */
export async function getTFConflicts(
  req: Request,
  res: Response
): Promise<void> {
  logger.info("getTFConflicts");
  try {
    const conflicts: ITFConflict[] = await ConflictModel.find({ type: "TF" })
      .populate({ path: "user", select: "firstname lastname" })
      .lean();
    logger.info(`Found ${conflicts.length} conflicts`);
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
    .match({ isValid: false })
    .unwind("$timeframes")
    .replaceRoot("$timeframes")
    .match({ "required.type": "user" });

  // sort by user and compute all
  const conflicts = computeAllTFConflicts(sortTFByUser(timeFramesWithOrgas));

  await ConflictModel.insertMany(conflicts);

  // send them back
  res.json(conflicts);
}

export async function computeAllConflicts(
  req: Request,
  res: Response
): Promise<void> {
  // Remove all existing conflicts
  await ConflictModel.deleteMany({});
  // get ALL FTs
  const FTs = await FTModel.find({ isValid: true });
  // compute all conflicts
  const conflicts = await FTs.reduce(async (previousPromise, ft) => {
    const acc: IConflict[] = await previousPromise;
    const newConflicts = await computeFTAllConflicts(ft);
    acc.push(...newConflicts);
    return Promise.resolve(acc);
  }, Promise.resolve([] as IConflict[]));
  // filter duplicate conflicts
  const conflictsFiltered = conflicts.filter(
    (conflict: IConflict, index: number, self: IConflict[]) =>
      self.findIndex((c) => {
        if (conflict.type === "TF" && c.type === "TF") {
          return c.tf1 === conflict.tf1 && c.tf2 === conflict.tf2;
        } else if (
          c.type === "availability" &&
          conflict.type === "availability"
        ) {
          return c.tf1 === conflict.tf1;
        } else if (c.type === "TS" && conflict.type === "TS") {
          return c.ts1 === conflict.ts1 && c.ts2 === conflict.ts2;
        }
        return false;
      }) === index
  );
  await ConflictModel.insertMany(conflictsFiltered);
}

/**
 * For a given FT find all conflicts and populate otherTf inside to have the other timeFrame infos
 */
export async function getTFConflictsByFTCount(
  req: Request,
  res: Response
): Promise<void> {
  const count = parseInt(req.params.FTCount);
  const ft = await FTModel.findOne({ count }).lean();
  logger.info(`Found ${ft}`);
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
        }).lean(),
        conflictsTf1
      );
      conflictsTf2 = conflictsTf2.concat(
        await ConflictModel.find({
          // type: "TF",
          tf2: tf._id,
        }).lean(),
        conflictsTf2
      );
    })
  );

  // populate conflicts with the other timeframe

  conflictsTf1 = await Promise.all(
    conflictsTf1.map(async (c) =>
      // remove tf1 and tf2 and populate other tf
      ({
        ...c,
        otherTf: await getTimeFrameById(c.tf2, {
          select: ["start", "end"],
          ft: { include: true, fields: ["general", "count"] },
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
          ft: { include: true, fields: ["general", "count"] },
        }),
      })
    )
  );

  res.json(conflictsTf1.concat(conflictsTf2));
  return;
}
