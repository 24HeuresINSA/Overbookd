import { Schema, model, Types } from 'mongoose';

export interface IConflict {
    conflictWith: Types.ObjectId[];
    type: string;
    conflictUser: Types.ObjectId;
}

export const ConflictSchema = new Schema<IConflict>({
    conflictWith: [{ type: Schema.Types.ObjectId, ref: 'Assignment' }],
    type: { type: String, required: true },
    conflictUser: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
});

const ConflictModel = model<IConflict>('Conflict', ConflictSchema);

export default ConflictModel;
