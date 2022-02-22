import { Schema, model, Types } from "mongoose";

export interface ITFConflict {
  conflictTF1: string;
  conflictTF2: string;
  type: "TF";
  conflictUser: Types.ObjectId;
}
export interface ITSConflict {
  conflictTS1: Types.ObjectId;
  conflictTS2: Types.ObjectId;
  type: "TF";
  conflictUser: Types.ObjectId;
}

export type IConflict = ITFConflict | ITSConflict;

export const ConflictSchema = new Schema<IConflict>({
  conflictTS1: [{ type: Schema.Types.ObjectId, ref: "TimeSpan" }],
  conflictTS2: [{ type: Schema.Types.ObjectId, ref: "TimeSpan" }],
  conflictTF1: [{ type: String, ref: "TimeFrame" }],
  conflictTF2: [{ type: String, ref: "TimeFrame" }],
  type: { type: String, required: true },
  conflictUser: { type: Schema.Types.ObjectId, required: true, ref: "User" },
});

const ConflictModel = model<IConflict>("Conflict", ConflictSchema);

export default ConflictModel;
