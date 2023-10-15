import { Coordinate, GeoJson } from "@overbookd/signa";

export type Location = {
  addCoordinate(coordinate: Coordinate): void;
  geoJson: GeoJson;
};
