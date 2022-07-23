import { getModelForClass, prop } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Equipment } from "./Equipment";

export class EquipmentProposal extends Equipment {
  @prop({ required: true })
  isNewEquipment: boolean;

  @prop({ required: false })
  oldEquipment?: Types.ObjectId;

  @prop({ required: true })
  byUser: Types.ObjectId;
}

const EquipmentProposalModel = getModelForClass(EquipmentProposal);

export default EquipmentProposalModel;
