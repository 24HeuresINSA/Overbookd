export type PointLocation = {
  type: "POINT";
  coordinates: Coordinate;
};

export type RoadLocation = {
  type: "ROAD";
  coordinates: Coordinate[];
};

export type AreaLocation = {
  type: "AREA";
  coordinates: Coordinate[];
};

export type Coordinate = {
  lat: number;
  lng: number;
};

export type GeoJson = null | PointLocation | RoadLocation | AreaLocation;

export interface SignaLocation<T extends GeoJson = GeoJson> {
  id: number;
  name: string;
  geoJson: T;
}
