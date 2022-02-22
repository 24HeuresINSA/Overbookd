import { model, Schema, Types } from "mongoose";
import { IForm } from "@entities/FA";
import { IComment } from "./FA";

type FTStatus = "draft" | "submitted" | "validated" | "refused" | "ready";
export interface IFT extends IForm {
  FA?: number;
  status: FTStatus;
  timeframes: ITimeFrame[];
  details: Record<string, unknown>;
}

type ITFRequiredType = "user" | "team";

interface ITFRequiredUserField {
  _id: Types.ObjectId;
  username: string;
}

export interface ITFRequiredUser {
  _id: string;
  type: "user";
  team?: string;
  amount?: number;
  user: ITFRequiredUserField;
}

export interface ITFRequiredTeam {
  _id: string;
  type: "team";
  team: string;
  amount: number;
  user?: ITFRequiredUserField;
}
export type ITFRequired = ITFRequiredTeam | ITFRequiredUser;

export function isTFRequiredUser(req: ITFRequired): req is ITFRequiredUser {
  return req.type === "user";
}

export interface ITimeFrame {
  _id: string;
  name: string;
  start: number;
  end: number;
  required: ITFRequired[];
  sliceTime?: number;
  toSlice?: boolean;
  timed: boolean;
}

const RequiredSchema = new Schema<ITFRequired>({
  _id: { type: String, required: true },
  type: { type: String, required: true },
  amount: Number,
  team: String,
  user: new Schema<ITFRequiredUser>({
    _id: { type: Types.ObjectId, ref: "User" },
    username: String,
  }),
});

const TimeFrameSchema = new Schema<ITimeFrame>({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  required: { type: [RequiredSchema], default: [] },
  timed: { type: Boolean, default: true },
  sliceTime: Number,
  toSlice: Boolean,
});

const CommentSchema = new Schema<IComment>({
  topic: { type: String, required: true },
  text: { type: String, required: true },
  time: { type: Date, required: true },
  validator: { type: String, required: true },
});

const FTSchema = new Schema<IFT>({
  FA: Number,
  comments: { type: [CommentSchema], default: [] },
  refused: { type: [String], default: [] },
  validated: { type: [String], default: [] },
  status: { type: String, default: "draft" },
  equipments: { type: [Object], default: [] },
  timeframes: { type: [TimeFrameSchema], default: [] },
  count: { type: Number, required: true },
  details: Object,
  general: Object,
});

const FTModel = model<IFT>("FT", FTSchema);

export default FTModel;
