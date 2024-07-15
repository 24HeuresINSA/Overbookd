import {
  AREA,
  GeoLocation,
  POINT,
  PointLocation,
  ROAD,
} from "@overbookd/geo-location";

type NullableGeoLocation = GeoLocation | null;

export type SignaLocation<T extends NullableGeoLocation = NullableGeoLocation> =
  {
    id: number;
    name: string;
    geoLocation: T;
  };

export function isPointLocation(
  geoLocation: NullableGeoLocation,
): geoLocation is PointLocation {
  return geoLocation?.type === POINT;
}

type GeoLocationType = typeof POINT | typeof ROAD | typeof AREA;

export function filterLocation<T extends GeoLocationType>(
  type: T,
  locations: SignaLocation[],
): SignaLocation<Extract<GeoLocation, { type: T }>>[] {
  return locations.filter(
    (location): location is SignaLocation<Extract<GeoLocation, { type: T }>> =>
      location.geoLocation?.type === type,
  );
}
