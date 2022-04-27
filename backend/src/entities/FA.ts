import {model, Schema, Types} from "mongoose";
import {IFT} from "@entities/FT";

export interface ITimeframe {
  start: string;
  end: string;
}

type ICommentTopic =
  | "refused"
  | "validated"
  | "commentaire"
  | "ready"
  | "timespan";

export type IComment = {
  topic: ICommentTopic;
  text: string;
  time: Date;
  validator: string;
};

export interface IForm {
  _id: Types.ObjectId;
  comments: IComment[];
  refused: string[];
  validated: string[];
  general: Record<string, unknown>;
  count: number;
  isValid: boolean;
  equipments: Record<string, unknown>[];
  status: string;
}

export interface ISecurityPass {
  fullname: string;
  licensePlate: string;
  timeframe: string[];
  phone: number;
}

export interface ISignalisation {
  type: string;
  text: string;
  number: number;
}

export interface ElectricityNeed {
  type: string;
  power: number;
}

export interface IFA extends IForm {
  timeframes: ITimeframe[];
  details: Record<string, unknown>;
  security: Record<string, unknown>;
  securityPasses: ISecurityPass[];
  signalisation: ISignalisation[];
  electricityNeeds: ElectricityNeed[];
  name: string;
  FTs: Partial<IFT>[];
}

const FASchema = new Schema<IFA>(
  {
    name: { type: String, required: false },
    FTs: { type: Array, required: false },
    isValid: { type: Boolean, default: true },
  },
  { strict: false }
);

const FAModel = model<IFA>("FA", FASchema);

export default FAModel;
