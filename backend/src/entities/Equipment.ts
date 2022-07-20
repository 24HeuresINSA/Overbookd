import { BaseEntity } from "@shared/BaseEntity";
import { getModelForClass, prop } from "@typegoose/typegoose";
import { model, Schema } from "mongoose";

export class Equipment extends BaseEntity {
  @prop({ required: true })
  name: string;

  @prop({ default: false })
  isValid: boolean;

  @prop({ required: true })
  amount: number;

  @prop({ default: "" })
  comment: string;

  @prop({ required: true })
  location: string;

  @prop({ default: "" })
  preciseLocation: string;

  @prop({ default: [] })
  borrowed: any[];

  @prop({ default: "" })
  referencePicture: string;

  @prop({ default: "" })
  referenceInvoice: string;

  @prop({ required: true })
  type: string;

  @prop({ default: false })
  fromPool: boolean;
}

const EquipmentModel = getModelForClass(Equipment);

export interface IEquipment {
  _id?: string;
  name: string;
  isValid?: boolean;
  amount: number;
  comment?: string;
  location: string;
  preciseLocation?: string;
  borrowed?: Array<any>;
  referencePicture?: string;
  referenceInvoice?: string;
  type: string;
  fromPool?: boolean;
}

export const EquipmentSchema = new Schema<IEquipment>({
  name: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  amount: { type: Number, required: true },
  comment: { type: String, default: "" },
  location: { type: String, required: true },
  preciseLocation: { type: String, default: "" },
  borrowed: { type: Array, default: [] },
  referencePicture: { type: String, default: "" },
  referenceInvoice: { type: String, default: "" },
  type: { type: String, required: true },
  fromPool: { type: Boolean, default: false },
});

export default EquipmentModel;
