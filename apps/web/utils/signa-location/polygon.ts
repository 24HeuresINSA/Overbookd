import { Coordinate, AREA, AreaLocation } from "@overbookd/signa";
import { Location } from "./location";

export class Polygon implements AreaLocation, Location {
  private constructor(private _coordinates: Coordinate[]) {}

  static create(coordinates: Coordinate[] = []) {
    return new Polygon(coordinates);
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

  get type(): typeof AREA {
    return AREA;
  }

  get geoJson(): AreaLocation {
    return {
      type: this.type,
      coordinates: [...this.coordinates],
    };
  }
}
