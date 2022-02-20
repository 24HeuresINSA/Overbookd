/**
 * Timespan is the collection that store the timeframes after they are partitioned and also store
 */

import { Schema, model, Types } from 'mongoose';

export interface ITimespan {
    start: Date;
    end: Date;
    timeframeID: Types.ObjectId;
    assigned: Types.ObjectId; // assigned user
    required: Types.ObjectId | string; // required user or team
}

const TimespanSchema = new Schema<ITimespan>({
    start: { type: Date, required: true },
    end: { type: Date, required: true },
    timeframeID: { type: Schema.Types.ObjectId, required: true },
    assigned: { type: Schema.Types.ObjectId, required: false, ref: 'User' },
    required: { type: Schema.Types.ObjectId ||  String, required: true, ref: 'User' },
});

const TimespanModel = model<ITimespan>('Timespan', TimespanSchema);

export default TimespanModel;