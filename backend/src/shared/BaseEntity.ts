import { ModelOptions, prop } from "@typegoose/typegoose";
import { Base } from "@typegoose/typegoose/lib/defaultClasses";
import { Types } from "mongoose";

@ModelOptions({
  schemaOptions: {
    timestamps: { updatedAt: "modifiedAt" },
    toObject: { virtuals: true },
  },
})
export class BaseEntity implements Base {
  @prop()
  _id: Types.ObjectId;

  @prop()
  id: string;

  @prop()
  public modifiedAt!: Date;

  @prop()
  public createdAt!: Date;
}
