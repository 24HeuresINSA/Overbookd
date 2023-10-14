export interface SignaLocation {
  id: number;
  name: string;
  coordinates: MapObjectType | null;
}

export type LatLng = {
  lat: number;
  lng: number;
};

export interface MapObject {
  type: string;
  coordinates: LatLng[];
}

export type MapObjectTypes = "POINT" | "ROAD" | "AREA";

export type MapObjectType = {
  type: MapObjectTypes;
  coordinates: LatLng[];
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

export class NotNullLocation implements SignaLocation {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly coordinates: MapObjectType,
  ) {
    this.id = id;
    this.name = name;
    this.coordinates = coordinates;
  }
}
