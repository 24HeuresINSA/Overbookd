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

export type GeoJson = null | PointLocation | RoadLocation | AreaLocation;

export interface SignaLocation<T extends GeoJson = GeoJson> {
  id: number;
  name: string;
  geoJson: T;
}

export function isPointLocation(geoJson: GeoJson): geoJson is PointLocation {
  return geoJson?.type === POINT;
}

export function filterLocation<
  T extends typeof POINT | typeof ROAD | typeof AREA,
>(
  type: T,
  locations: SignaLocation[],
): SignaLocation<Extract<GeoJson, { type: T }>>[] {
  return locations.filter(
    (location): location is SignaLocation<Extract<GeoJson, { type: T }>> =>
      location.geoJson?.type === type,
  );
}
