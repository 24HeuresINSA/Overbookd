import { Coordinate, ROAD, RoadLocation } from "@overbookd/signa";
import { Location } from "./location";

export class Line implements RoadLocation, Location {
  private constructor(private _coordinates: Coordinate[]) {}

  static create(coordinates: Coordinate[] = []) {
    return new Line(coordinates);
  }

  addCoordinate(coordinate: Coordinate) {
    this._coordinates = [...this._coordinates, coordinate];
  }

  get coordinates() {
    return this._coordinates;
  }

  get type(): typeof ROAD {
    return ROAD;
  }

  get geoJson(): RoadLocation {
    return {
      type: this.type,
      coordinates: [...this.coordinates],
    };
  }
}
