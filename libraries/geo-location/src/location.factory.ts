import { Line } from "./line";
import { AREA, GeoLocation, POINT, ROAD } from "./location";
import { Point } from "./point";
import { Polygon } from "./polygon";

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
