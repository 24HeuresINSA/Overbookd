import { Coordinate } from "@overbookd/signa";

export function distanceBetweenPoints(
  point1: Coordinate,
  point2: Coordinate,
): number {
  return Math.sqrt(
    (point1.lat - point2.lat) ** 2 + (point1.lng - point2.lng, 2) ** 2,
  );
}
