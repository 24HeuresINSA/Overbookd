import { model, Schema } from "mongoose";

export interface Planning {
  _id?: string;
  user_id: string;
  plannning: string;
}

export const PlanningSchema = new Schema<Planning>({
  user_id: { type: String, required: true },
  plannning: { type: String, required: true },
});

const PlanningModel = model<Planning>("Planning", PlanningSchema);

export default PlanningModel;
