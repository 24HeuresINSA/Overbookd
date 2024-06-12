import { distanceBetweenPoints } from "./distance.js";
import {
  Coordinate,
  ManageLocation,
  POINT,
  PointLocation,
} from "./location.js";

export class Point implements PointLocation, ManageLocation {
  private constructor(private _coordinates: Coordinate) {}

  static create(coordinates: Coordinate = { lat: 1, lng: 1 }) {
    return new Point(coordinates);
  }

  addCoordinate(coordinate: Coordinate) {
    this._coordinates = coordinate;
  }

  isNear(coordinate: Coordinate, radius: number): boolean {
    return distanceBetweenPoints(this._coordinates, coordinate) <= radius;
  }

  get type(): typeof POINT {
    return POINT;
  }

  get coordinates() {
    return this._coordinates;
  }

  get location(): PointLocation {
    return {
      type: this.type,
      coordinates: { ...this.coordinates },
    };
  }

  get barycentre(): PointLocation {
    return this.location;
  }
}
