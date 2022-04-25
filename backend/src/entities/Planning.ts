import { model, Schema } from "mongoose";
import { Document } from "docx";

export interface Planning {
  _id?: string;
  user_id: string;
  plannning: Document;
}

export const PlanningSchema = new Schema<Planning>({
  user_id: { type: String, required: true },
  plannning: { type: Document, required: true },
});

const PlanningModel = model<Planning>("Planning", PlanningSchema);

export default PlanningModel;
