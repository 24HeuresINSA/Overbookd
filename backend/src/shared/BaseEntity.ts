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
  _id!: Types.ObjectId;

  id: string;

  @prop()
  public modifiedAt!: Date;

  @prop()
  public createdAt!: Date;
}
