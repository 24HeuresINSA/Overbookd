import { IAssignment } from "./Assignment";
import { Schema, model, Types } from 'mongoose';

export interface IConflict {
    conflictWithId: Types.ObjectId;

}
