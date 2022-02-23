import ConflictModel, { IConflict, ITFConflict } from "@entities/Conflict";
import { isTFRequiredUser, ITimeFrame } from "@entities/FT";
import { Types } from "mongoose";
import { newTFConflit } from "../entities/Conflict";

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

/**
 * Calculate timeFrame conflict from a timeFrames of an array of timeFrames
 * If tf is Present in others array, filter it
 *
 * @param tf TimeFrame to check
 * @param others All the TimeFrames to check against
 * @returns Conflicts found
 */
export function computeTFConflictsWithArray(
  tf: ITimeFrame,
  others: ITimeFrame[]
): IConflict[] {
  const conflicts: IConflict[] = [];
  // filter others to avoid timeFrame conflicting with itself
  others = others.filter((t) => t._id !== tf._id);
  const othersByUser = sortTFByUser(others);
  const tfByUser = sortTFByUser([tf]);

  // For each user compute potential conflicts
  for (const [userId, userTfs] of Object.entries(tfByUser)) {
    const othersTfUser = othersByUser[userId];
    // If user is not required in an TF skip this loop
    if (!othersTfUser) {
      continue;
    }

    // Fetch all conflicts for the given user
    userTfs.forEach((utfs) => {
      othersTfUser.forEach((otfs) => {
        if (isOverlappingTFs(utfs, otfs)) {
          conflicts.push(
            newTFConflit(utfs._id, otfs._id, Types.ObjectId(userId))
          );
        }
      });
    });
  }
  return conflicts;
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
 * Compute all conflicts between an array of timeFrames and allTimeFrames
 * Does not compute conflicts INSIDE allTimeFrames array
 *
 * @param checkedTFs The FTs for which we want to find conflicts
 * @param allTimeFrames All the TFs possibly involved in conflicts
 * @returns Array of conflicts
 */
export function computeTFConflictsBetweenArray(
  checkedTFs: ITimeFrame[],
  allTimeFrames: ITimeFrame[]
): IConflict[] {
  // remove checked TFs from the allTimeFrames array
  allTimeFrames = allTimeFrames.filter((tf) => !checkedTFs.includes(tf));

  // Compute between checkedTFS itself
  let conflicts = computeAllTFConflicts(sortTFByUser(checkedTFs));

  // Then compute with other TFs
  for (const tf of checkedTFs) {
    conflicts = conflicts.concat(
      computeTFConflictsWithArray(tf, allTimeFrames)
    );
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

/* ################# TimeSpans ################ */

// todo

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
