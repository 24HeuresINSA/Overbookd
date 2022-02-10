import { model, Schema } from "mongoose";
import { IForm } from "@entities/FA";

export interface IFT extends IForm {
  FA: number;
}

interface ISchedule {
  date: string;
  start: Date;
  end: Date;
  needs: INeed[];
  assigned?: IAssign[];
}

interface INeed {
  role?: string;
  amount?: number;
}

interface IAssign {
  userID: string;
  _id: string;
  username?: string;
}

const FTSchema = new Schema<IFT>(
  {
    FA: { type: Number, default: 0 },
  },
  { strict: false }
);

const FTModel = model<IFT>("FT", FTSchema);

class FT implements IFT {
  constructor() {
  }

  FA = 0;
  comments = [];
  count = 0;
  equipments = [];
  general = {};
  isValid = true;
  refused = [];
  status = "draft";
  validated = [];
  _id = "";
}

export default FTModel;
