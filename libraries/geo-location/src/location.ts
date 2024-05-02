export const POINT = "POINT";
export const ROAD = "ROAD";
export const AREA = "AREA";

export type PointLocation = {
  type: typeof POINT;
  coordinates: Coordinate;
};

export type RoadLocation = {
  type: typeof ROAD;
  coordinates: Coordinate[];
};

export type AreaLocation = {
  type: typeof AREA;
  coordinates: Coordinate[];
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type GeoLocation = PointLocation | RoadLocation | AreaLocation;

export type ManageLocation = {
  addCoordinate(coordinate: Coordinate): void;
  isNear(coordinate: Coordinate, radius: number): boolean;
  location: GeoLocation;
};
