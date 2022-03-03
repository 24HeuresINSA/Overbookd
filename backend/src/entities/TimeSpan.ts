/**
 * TimeSpan is the collection that store the timeframes after they are partitioned and also store
 */

import { Schema, model, Types } from 'mongoose';
import {ITFRequired} from "@entities/FT";

export interface ITimeSpan {
    start: Date;
    end: Date;
    timeframeID: string;
    assigned: Types.ObjectId | null; // assigned user
    required: ITFRequired | null; // required user or team
}

const TimeSpanSchema = new Schema<ITimeSpan>({
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    timeframeID: { type: String, required: true },
    assigned: { type: String, required: false, ref: 'User' },
    required: {
      type: Object,
    },
});

const TimeSpanModel = model<ITimeSpan>('TimeSpan', TimeSpanSchema);

export default TimeSpanModel;