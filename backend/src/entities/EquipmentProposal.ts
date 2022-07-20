import { getModelForClass, prop } from "@typegoose/typegoose";
import { model, Schema, Types } from "mongoose";
import { Equipment, IEquipment } from "./Equipment";

export class EquipmentProposal extends Equipment {
  @prop({ required: true })
  isNewEquipment: boolean;

  @prop({ required: false })
  oldEquipment?: Types.ObjectId;

  @prop({ required: true })
  byUser: Types.ObjectId;
}

const EquipmentProposalModel = getModelForClass(EquipmentProposal);

export interface IEquipmentProposal extends IEquipment {
  isNewEquipment: boolean;
  oldEquipment?: Types.ObjectId;
  byUser: Types.ObjectId;
}

const EquipmentProposalSchema = new Schema({
  isNewEquipment: { type: Boolean, required: true },
  oldEquipment: { type: Schema.Types.ObjectId, ref: "Equipment" },
  byUser: { type: Schema.Types.ObjectId, ref: "User" },
  name: { type: String, required: true },
  isValid: { type: Boolean, default: true },
  amount: { type: Number, required: true },
  comment: { type: String },
  location: { type: String, required: true },
  preciseLocation: { type: String },
  borrowed: { type: Array },
  referencePicture: { type: String },
  referenceInvoice: { type: String },
  type: { type: String, required: true },
  fromPool: { type: Boolean, default: false },
});

export default EquipmentProposalModel;
