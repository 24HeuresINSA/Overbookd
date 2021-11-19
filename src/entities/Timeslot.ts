import { model, Schema } from "mongoose";


export interface ITimeslot {
  _id?: string;
  groupTitle: string;
  groupDescription?: string;
  timeFrame: {
    start: Date,
    end: Date
  };
  charisma: number;
}


const TimeslotSchema = new Schema<ITimeslot>(
  {
    groupTitle: { type: String, required: true},
    groupDescription: { type: String, required: false},
    timeFrame: {
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    },
    charisma: { type: Number, required: true }
  }
);

const TimeslotModel = model<ITimeslot>('Timeslot', TimeslotSchema)




export default TimeslotModel;
