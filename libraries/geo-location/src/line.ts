import { distanceBetweenPoints } from "./distance";
import { Coordinate, ManageLocation, ROAD, RoadLocation } from "./location";

export class Line implements RoadLocation, ManageLocation {
  private constructor(private _coordinates: Coordinate[]) {}

  static create(coordinates: Coordinate[] = []) {
    return new Line(coordinates);
  }

  addCoordinate(coordinate: Coordinate) {
    this._coordinates = [...this._coordinates, coordinate];
  }

  isNear(coordinate: Coordinate, radius: number): boolean {
    return this._coordinates.some(
      (c) => distanceBetweenPoints(coordinate, c) <= radius,
    );
  }

  get coordinates() {
    return this._coordinates;
  }

  get type(): typeof ROAD {
    return ROAD;
  }

  get location(): RoadLocation {
    return {
      type: this.type,
      coordinates: [...this.coordinates],
    };
  }
}
