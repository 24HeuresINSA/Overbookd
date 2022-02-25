import { Schema, model, Types } from "mongoose";

export interface ITFConflict<T = string> {
  tf1: T;
  tf2: T;
  type: "TF";
  user: Types.ObjectId;
}
export interface ITSConflict {
  ts1: Types.ObjectId;
  ts2: Types.ObjectId;
  type: "TF";
  user: Types.ObjectId;
}

export type IConflict = ITFConflict | ITSConflict;

export const ConflictSchema = new Schema<IConflict>({
  ts1: Types.ObjectId,
  ts2: Types.ObjectId,
  tf1: String,
  tf2: String,
  type: { type: String, required: true },
  user: { type: Types.ObjectId, required: true, ref: "User" },
});

const ConflictModel = model<IConflict>("Conflict", ConflictSchema);

/* ################### Logic ################## */

/**
 * Used to create a TFconflict with TimeFrames sorted by _id ( tf1._id < tf2._id )
 * Needed for a good detection of duplicates
 * Use the function everywhere when a new conflict is created
 * todo: Maybe add a DB check for this to avoid issues
 *
 * @param tf1ID string _id in first timeframe
 * @param tf2ID string _id in second timeframe
 * @param user user _id
 * @returns conflict
 */
export function newTFConflit(
  tf1ID: string,
  tf2ID: string,
  user: Types.ObjectId
): IConflict {
  if (tf1ID < tf2ID) {
    return {
      type: "TF",
      tf1: tf1ID,
      tf2: tf2ID,
      user: user,
    };
  }
  return {
    type: "TF",
    tf1: tf2ID,
    tf2: tf1ID,
    user: user,
  };
}

/* ################### Model ################## */

export default ConflictModel;
