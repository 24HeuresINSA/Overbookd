import { BaseEntity } from "@shared/BaseEntity";
import { getModelForClass, prop } from "@typegoose/typegoose";

class Borrowed {
  @prop({ required: true })
  amount: string;
  @prop({ required: true })
  start: string;
  @prop({ required: true })
  end: string;
  @prop({ required: true })
  from: string;
}

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

  @prop({ default: [], type: () => Borrowed })
  borrowed: Borrowed[];

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

export default EquipmentModel;
