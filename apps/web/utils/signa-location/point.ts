import { POINT, PointLocation, Coordinate } from "@overbookd/signa";

export class Point implements PointLocation {
  private constructor(private _coordinates: Coordinate) {}

  static create(coordinates: Coordinate = { lat: 1, lng: 1 }) {
    return new Point(coordinates);
  }

  addCoordinate(coordinate: Coordinate) {
    this._coordinates = coordinate;
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
