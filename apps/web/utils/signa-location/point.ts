import { POINT, PointLocation, Coordinate } from "@overbookd/signa";
import { Location } from "./location";

export class Point implements PointLocation, Location {
  private constructor(private _coordinates: Coordinate) {}

  static create(coordinates: Coordinate = { lat: 1, lng: 1 }) {
    return new Point(coordinates);
  }

  addCoordinate(coordinate: Coordinate) {
    this._coordinates = coordinate;
  }

  isNear(coordinate: Coordinate, radius: number) {
    const distance = Math.sqrt(
      (coordinate.lat - this._coordinates.lat) ** 2 +
        (coordinate.lng - this._coordinates.lng) ** 2,
    );

    return distance <= radius;
  }

  get type(): typeof POINT {
    return POINT;
  }

  get coordinates() {
    return this._coordinates;
  }

  get geoJson(): PointLocation {
    return {
      type: this.type,
      coordinates: { ...this.coordinates },
    };
  }
}
