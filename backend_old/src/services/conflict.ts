import ConflictModel, {IConflict, ITFConflict, ITSConflict,} from "@entities/Conflict";
import UserModel from "@entities/User";
import FTModel, {IFT, isTFRequiredUser, ITFRequiredUser, ITimeFrame} from "@entities/FT";
import {ITimeSpan} from "@entities/TimeSpan";
import {ITimeslot} from "@entities/Timeslot";
import {Document, Types} from "mongoose";
import {newAvailabilityConflit, newTFConflit} from "../entities/Conflict";
import {getTimeFramesWhereUserIsRequired} from "./timeFrame";
import {getTimespansWhereUserIsAssigned} from "./timeSpan";

/* ################ Interfaces ################ */

type TFsByOrga = Record<string, Array<ITimeFrame>>;

/* ################ TimeFrames ################ */

/**
 * Return all conflicts in DB related to the timeFrames in args
 * Does not return conflicts related to timeSpans.
 *
 * @param tfs timeFrames array
 * @returns Conflicts array
 */
export async function getFTConflicts(tfs: ITimeFrame[]): Promise<IConflict[]> {
  // Find conflicts for all timeFrames of the FT
  let conflicts: IConflict[] = [];

  // Do not use forEach here because of async
  for (const tf of tfs) {
    const nc = await ConflictModel.find({
      $and: [{ type: "TF" }, { $or: [{ tf1: tf._id }, { tf2: tf._id }] }],
    }).lean();
    if (nc) {
      conflicts = conflicts.concat(nc);
    }
  }

  return conflicts;
}

/**
 * Sorting timeframes by user required. A timeFrame can be present multiple times if multiple users are required
 * @param tfs TimeFrames array
 * @returns Dict with stringified user _id as key and array of timeFrames for each user as value
 */
export function sortTFByUser(tfs: ITimeFrame[]): TFsByOrga {
  // Store them sorted by user
  const TFsByOrga: TFsByOrga = {};

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

export async function computeFTConflicts(ft: IFT): Promise<IConflict[]> {
  const timeframesConflicts = await Promise.all(
    ft.timeframes.flatMap((timeframe) => [
      computeTimeframeConflicts(timeframe, ft.count),
      computeTimespanConflicts(timeframe, ft.count),
    ])
  );
  const ftConflicts = timeframesConflicts.flat();
  return ftConflicts;
}

async function computeTimeframeConflicts(
  timeframe: ITimeFrame,
  FTID: number
): Promise<ITFConflict[]> {
  const { start, end } = timeframe;
  const requiredUserIds = getRequiredUserIdsFromTimeframe(timeframe);
  const usersWithConflicts = await getUsersWithConflictualTimeframes(
    requiredUserIds,
    { start, end },
    FTID
  );
  return generateTFConflits(usersWithConflicts, timeframe);
}

async function computeTimespanConflicts(
  timeframe: ITimeFrame,
  FTID: number
): Promise<ITSConflict[]> {
  const { start, end } = timeframe;
  const requiredUserIds = getRequiredUserIdsFromTimeframe(timeframe);
  const usersWithConflicts = await getUsersWithConflictualTimespans(
    requiredUserIds,
    start,
    end,
    FTID
  );
  return generateTimeSpanConflicts(usersWithConflicts, timeframe);
}

function generateTFConflits(
  usersWithConflicts: {
    user: Types.ObjectId;
    conflictualTimeframes: ITimeFrame[];
  }[],
  timeframe: ITimeFrame
): ITFConflict[] {
  return usersWithConflicts.flatMap(({ user, conflictualTimeframes }) =>
    conflictualTimeframes.map((conflictalTimeframe) => ({
      tf1: conflictalTimeframe._id,
      tf2: timeframe._id,
      type: "TF",
      user,
    }))
  );
}

function generateTimeSpanConflicts(
  usersWithConflicts: {
    user: Types.ObjectId;
    conflictualTimespans: ITimeSpan[];
  }[],
  timeframe: ITimeFrame
): ITSConflict[] {
  return usersWithConflicts.flatMap(({ user, conflictualTimespans }) =>
    conflictualTimespans.map((conflictualTimespan) => ({
      tf1: timeframe._id,
      ts1: conflictualTimespan._id,
      type: "TS",
      user,
    }))
  );
}

async function getUsersWithConflictualTimeframes(
  userIds: Types.ObjectId[],
  range: { start: number; end: number },
  FTID: number
): Promise<{ user: Types.ObjectId; conflictualTimeframes: ITimeFrame[] }[]> {
  const usersWithDedicatedConflicts = await Promise.all(
    userIds.map(async (userId) => {
      const conflictualTimeframes = await getTimeFramesWhereUserIsRequired(
        userId,
        range,
        [FTID]
      );
      return {
        user: userId,
        conflictualTimeframes,
      };
    })
  );
  const usersWithConflictsOnly = usersWithDedicatedConflicts.filter(
    (userConflicts) => userConflicts.conflictualTimeframes.length
  );
  return usersWithConflictsOnly;
}

async function getUsersWithConflictualTimespans(
  userIds: Types.ObjectId[],
  start: number,
  end: number,
  FTID: number
): Promise<{ user: Types.ObjectId; conflictualTimespans: ITimeSpan[] }[]> {
  const usersWithDedicatedConflicts = await Promise.all(
    userIds.map(async (userId) => {
      const conflictualTimespans = await getTimespansWhereUserIsAssigned(
        userId,
        {
          start,
          end,
        },
        [FTID]
      );
      return {
        user: userId,
        conflictualTimespans,
      };
    })
  );
  const usersWithConflictsOnly = usersWithDedicatedConflicts.filter(
    (userConflicts) => userConflicts.conflictualTimespans.length
  );
  return usersWithConflictsOnly;
}

function getRequiredUserIdsFromTimeframe(timeframe: ITimeFrame) {
  const requiredUsers = timeframe.required.filter((r) =>
    isTFRequiredUser(r)
  ) as ITFRequiredUser[];
  const requiredUserIds = requiredUsers.map(
    (requiredUser) => requiredUser.user._id
  );
  return requiredUserIds;
}

/**
 * Useful to compute conflicts between an array of TimeFrames AND itself
 * Calculate TimeFrame Conflict between the TFsByOrga
 *
 * @param TFsByOrga TimeFrames to include in the computation sorted with keys as stringified user required _id
 * @returns TimeFrame Conflict array
 */
export function computeAllTFConflicts(TFsByOrga: TFsByOrga): IConflict[] {
  const conflicts: IConflict[] = [];

  for (const [key, value] of Object.entries(TFsByOrga)) {
    value.forEach((v, i) => {
      for (let j = 0; j < i; j++) {
        if (isOverlappingTFs(v, value[j])) {
          // overlap detected
          conflicts.push(
            newTFConflit(v._id, value[j]._id, Types.ObjectId(key))
          );
        }
      }
    });
  }

  return conflicts;
}

/**
 * Determine wether or not 2 timeFrames are overlapping in time
 *
 * @param tf1 timeFrame 1
 * @param tf2 timeFrame 2
 * @returns If the timeFrames overlap or not
 */
function isOverlappingTFs(tf1: ITimeFrame, tf2: ITimeFrame): boolean {
  return dateRangeOverlaps(tf1.start, tf1.end, tf2.start, tf2.end);
}

/* ################# TimeSpans ################ */

// todo

/* ################# Availability ################ */
export async function computeAvailabilityConflicts(
  ft: IFT
): Promise<IConflict[]> {
  const timeframes = ft.timeframes;
  const conflicts: IConflict[] = [];
  const TFsByOrga: TFsByOrga = sortTFByUser(timeframes);
  for (const [key, value] of Object.entries(TFsByOrga)) {
    const user = await UserModel.findById(key).populate("availabilities");
    if (!user || !user.availabilities) {
      continue;
    }
    value.forEach((tf) => {
      if (!isTimeFrameCovered(tf, user.availabilities!)) {
        conflicts.push(newAvailabilityConflit(tf._id, Types.ObjectId(key)));
      }
    });
  }
  return conflicts;
}

/* ################## Global ################## */

/**
 * Compare conflicts before and after udpate and access which ones needs to be deleted or created
 * This function is needed because we cannot use _id.
 *
 * @note Conflits TimeFrames_id fields NEED to be sorted correctly. Use newTFConflict function always
 *
 * @param oldConflicts Conflicts present before the FT update
 * @param newConflicts All Conflicts computed after the FT update
 * @returns Object with outdated conflicts that needs to be deleted and new conflicts that needs to be added
 */
export function compareTFConflicts(
  oldConflicts: ITFConflict[],
  newConflicts: ITFConflict[]
): { outdated: ITFConflict[]; created: ITFConflict[] } {
  const outdated: ITFConflict[] = [];
  const created: ITFConflict[] = [];

  // check for each conflicts if an other conflict is already present
  newConflicts.forEach((nc) => {
    const match = oldConflicts
      .filter((oc) => oc.user === oc.user)
      .filter((oc) => nc.tf1 === oc.tf1)
      .find((oc) => nc.tf2 === oc.tf2);

    // push to both arrays is match is found
    if (match) {
      outdated.push({ ...match });
      created.push({ ...nc });
    }
  });

  // return the results
  return { outdated, created };
}

/**
 * Delete all conflicts for one FT and recompute them all
 */
export async function updateConflictsByFTCount(FTCount: number): Promise<void> {
  const ft = await FTModel.findOne({ count: FTCount }).lean();

  if (!ft) {
    throw new Error("Did not find the FT for conflicts");
  }

  return await updateFTConflicts(ft);
}

export async function updateFTConflicts(ft: IFT): Promise<void> {
  await Promise.all(
    ft.timeframes.map((timeframe) =>
      ConflictModel.deleteMany({
        $or: [{ tf1: timeframe._id }, { tf2: timeframe._id }],
      })
    )
  );

  // Stop after deleting if the current FT is deleted
  if (ft.isValid === false) {
    return;
  }

  // compute new conflicts
  const [newConflicts, newAvailabiltyConflicts] = await Promise.all([
    computeFTConflicts(ft),
    computeAvailabilityConflicts(ft),
  ]);

  // save new conflicts
  if (newConflicts.length != 0) {
    ConflictModel.insertMany(newConflicts);
  }
  if (newAvailabiltyConflicts.length != 0) {
    ConflictModel.insertMany(newAvailabiltyConflicts);
  }
}

/* ################## Utils ################## */
/*
 * Checks if :
 * 1 starts strictly after 2 starts AND 1 starts strictly before 2 ends OR
 * 1 ends after 2 strictly starts AND 1 ends strictly before 2 ends OR
 * 1 starts before 2 start AND 1 ends after 2 ends
 *
 */
export function dateRangeOverlaps(
  a_start: number,
  a_end: number,
  b_start: number,
  b_end: number
): boolean {
  //suppose that a_start < a_end and b_start < b_end
  return a_start < b_end && a_end > b_start; //https://stackoverflow.com/a/325964
}

function dateRangeOverlapsAvailability(
  a_start: number,
  a_end: number,
  b_start: number,
  b_end: number
): boolean {
  if (a_start <= b_start && b_start <= a_end) return true; // b starts in a
  if (a_start <= b_end && b_end <= a_end) return true; // b ends in a
  if (b_start < a_start && a_end < b_end) return true; // a in b
  return false;
}

/**
 * Check if a given timeframe is covered by others timeslot
 */
function isTimeFrameCovered(tf: ITimeFrame, timeslots: ITimeslot[]): boolean {
  //sort timeslots by start date
  timeslots.sort(
    (a, b) => a.timeFrame.start.getTime() - b.timeFrame.start.getTime()
  );
  let totalOverlapSize = 0;
  for (const ts of timeslots) {
    if (
      dateRangeOverlapsAvailability(
        tf.start,
        tf.end,
        ts.timeFrame.start.getTime(),
        ts.timeFrame.end.getTime()
      )
    ) {
      //calculate total overlap size over multiple iterations
      totalOverlapSize +=
        Math.min(tf.end, ts.timeFrame.end.getTime()) -
        Math.max(tf.start, ts.timeFrame.start.getTime());
    }
  }
  const timeFrameSize = tf.end - tf.start;
  if (totalOverlapSize === timeFrameSize) {
    return true;
  }
  return false;
}

export async function computeFTAllConflicts(
  ft: IFT & Document<any, any, IFT>
): Promise<IConflict[]> {
  const newConflicts = await computeFTConflicts(ft);
  const newAvailabiltyConflicts = await computeAvailabilityConflicts(ft);
  // save new conflicts
  return [...newConflicts, ...newAvailabiltyConflicts];
}

export function isTimespanCovered(
  timespan: ITimeSpan,
  timeslots: ITimeslot[]
): boolean {
  timeslots.sort(
    (a, b) => a.timeFrame.start.getTime() - b.timeFrame.start.getTime()
  );
  let totalOverlapSize = 0;
  for (const ts of timeslots) {
    if (
      dateRangeOverlapsAvailability(
        timespan.start.getTime(),
        timespan.end.getTime(),
        ts.timeFrame.start.getTime(),
        ts.timeFrame.end.getTime()
      )
    ) {
      //calculate total overlap size over multiple iterations
      totalOverlapSize +=
        Math.min(timespan.end.getTime(), ts.timeFrame.end.getTime()) -
        Math.max(timespan.start.getTime(), ts.timeFrame.start.getTime());
    }
  }
  const timeFrameSize = timespan.end.getTime() - timespan.start.getTime();
  if (totalOverlapSize === timeFrameSize) {
    return true;
  }
  return false;
}
