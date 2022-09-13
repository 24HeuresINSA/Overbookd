/**
 * TimeSpan is the collection that store the timeframes after they are partitioned and also store
 */

import {model, Schema, Types} from "mongoose";

export interface ITimeSpan {
  _id: Types.ObjectId,
  start: Date;
  end: Date;
  timeframeID: string;
  assigned: Types.ObjectId | null; // assigned user
  required: string; // required user or team
  FTID: number;
}

export type TimeSpanForm = Omit<ITimeSpan, "_id">

const TimeSpanSchema = new Schema<ITimeSpan>({
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  timeframeID: { type: String, required: true },
  assigned: { type: String, required: false, ref: "User" },
  required: {
    type: String,
    required: false,
  },
  FTID: { type: Number, required: true },
});

const TimeSpanModel = model<ITimeSpan>("TimeSpan", TimeSpanSchema);

export default TimeSpanModel;
