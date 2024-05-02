import { distanceBetweenPoints } from "./distance";
import { AREA, AreaLocation, Coordinate, ManageLocation } from "./location";

export class Polygon implements AreaLocation, ManageLocation {
  private constructor(private _coordinates: Coordinate[]) {}

  static create(coordinates: Coordinate[] = []) {
    return new Polygon(coordinates);
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

  get type(): typeof AREA {
    return AREA;
  }

  get location(): AreaLocation {
    return {
      type: this.type,
      coordinates: [...this.coordinates],
    };
  }
}
