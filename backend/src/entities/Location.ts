import { getModelForClass, prop } from "@typegoose/typegoose";

export class Location {
  @prop({ required: true, unique: true })
  name: string;

  @prop()
  latitude?: number;

  @prop()
  longitude?: number;

  @prop({ type: () => String, required: true })
  neededBy: string[];
}

const LocationModel = getModelForClass(Location);

export default LocationModel;
