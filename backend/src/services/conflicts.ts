import { IConflict } from "@entities/Conflict";
import { isTFRequiredUser, ITimeFrame } from "@entities/FT";
import { Types } from "mongoose";

/**
 * Sorting timeframes by user required. A timeFrame can be present multiple times if multiple users are required
 * @param tfs TimeFrames array
 * @returns Dict with stringified user _id as key and array of timeFrames for each user as value
 */
export function sortTFByUser(
  tfs: ITimeFrame[]
): Record<string, Array<ITimeFrame>> {
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
export function detectAllTFConflicts(
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
