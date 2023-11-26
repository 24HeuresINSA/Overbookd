import { Coordinate, GeoJson } from "@overbookd/signa";

export type Location = {
  addCoordinate(coordinate: Coordinate): void;
  isNear(coordinate: Coordinate, radius: number): boolean;
  geoJson: GeoJson;
};
