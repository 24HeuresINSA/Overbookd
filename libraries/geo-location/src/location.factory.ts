import { Line } from "./line.js";
import { AREA, GeoLocation, POINT, ROAD } from "./location.js";
import { Point } from "./point.js";
import { Polygon } from "./polygon.js";

export class LocationFactory {
  static create(geoLocation: GeoLocation) {
    switch (geoLocation.type) {
      case POINT:
        return Point.create(geoLocation.coordinates);
      case ROAD:
        return Line.create(geoLocation.coordinates);
      case AREA:
        return Polygon.create(geoLocation.coordinates);
    }
  }
}
