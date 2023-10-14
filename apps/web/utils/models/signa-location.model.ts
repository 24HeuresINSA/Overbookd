export interface SignaLocation {
  id: number;
  name: string;
  coordinates: MapObjectType | null;
}

export interface MapObject {
  type: string;
  coordinates: number[] | number[][];
}

export type MapObjectTypes = "POINT" | "ROAD" | "AREA";

export type MapObjectType = {
  type: MapObjectTypes;
  coordinates: number[] | number[][];
};

export type CreateLocation = Pick<SignaLocation, "name" | "coordinates">;

export interface SignaLocationCreate {
  name: string;
}

export class Location implements SignaLocation {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly coordinates: MapObjectType | null,
  ) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
  }
}
