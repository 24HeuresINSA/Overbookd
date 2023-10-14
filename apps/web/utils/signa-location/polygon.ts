import { Coordinate, AREA, AreaLocation } from "@overbookd/signa";

export class Polygon implements AreaLocation {
  private constructor(private _coordinates: Coordinate[]) {}
  static create(coordinates: Coordinate[] = []) {
    return new Polygon(coordinates);
  }
  addCoordinate(coordinate: Coordinate) {
    this._coordinates = [...this._coordinates, coordinate];
  }
  get coordinates() {
    return this._coordinates;
  }
  get type(): typeof AREA {
    return AREA;
  }
  get geoJson(): AreaLocation {
    return {
      type: this.type,
      coordinates: [ ...this.coordinates ],
    };
  }
}
