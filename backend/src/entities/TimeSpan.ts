/**
 * A Timespan represents a task to be realized by someone (in its final form).
 * TimeSpan is the collection that store the timeframes after they are partitioned
 */

import { BaseEntity } from "@shared/BaseEntity";
import { prop, Ref, getModelForClass } from "@typegoose/typegoose";
import { Schema, Types } from "mongoose";
import { User } from "./User";

export class Timespan extends BaseEntity {
  @prop({ required: true })
  start: Date;
  @prop({ required: true })
  end: Date;
  @prop({ required: true })
  timeframeID: string;
  @prop({ required: true, ref: () => User, default: null })
  assigned: Ref<User> | null;
  @prop({ required: true })
  required: string;
  @prop({ required: true })
  FTID: number;
}

const TimeSpanModel = getModelForClass(Timespan);
export interface ITimeSpan {
  _id: Types.ObjectId;
  start: Date;
  end: Date;
  timeframeID: string;
  assigned: Types.ObjectId | null; // assigned user
  required: string; // required user or team
  FTID: number;
}

export type TimeSpanForm = Omit<ITimeSpan, "_id">;

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

//const TimeSpanModel = model<ITimeSpan>("TimeSpan", TimeSpanSchema);

export default TimeSpanModel;
