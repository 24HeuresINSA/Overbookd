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

  isNear(coordinate: Coordinate, radius: number) {
    return this._coordinates.some((c) => {
      const distance = Math.sqrt(
        (coordinate.lat - c.lat) ** 2 + (coordinate.lng - c.lng) ** 2,
      );

      return distance <= radius;
    });
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
