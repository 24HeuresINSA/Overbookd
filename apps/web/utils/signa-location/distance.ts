import { Coordinate } from "@overbookd/signa";

export function distanceBetweenPoints(
  point1: Coordinate,
  point2: Coordinate,
): number {
  const latitude = point1.lat - point2.lat;
  const longitude = point1.lng - point2.lng;
  return Math.hypot(latitude, longitude);
}
