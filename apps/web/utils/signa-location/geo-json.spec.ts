import { describe, expect, it } from "@jest/globals";
import { POINT, ROAD, AREA } from "@overbookd/signa";
import { Point } from "./point";
import { Line } from "./line";
import { Polygon } from "./polygon";

const coord1 = { lat: 0, lng: 0 };
const coord2 = { lat: 1, lng: 2 };

describe("add coordinate to geo-json", () => {
  describe("when the geo json is a point", () => {
    it("should replace the coordinate by the new", () => {
      const point = Point.create(coord1);
      point.addCoordinate(coord2);
      expect(point.coordinates).toEqual(coord2);
    });
    it("should return a PointLocation", () => {
      const point = Point.create(coord1);
      expect(point.type).toBe(POINT);
    });
  });
  describe("when the geo json is a line", () => {
    it("should add the new one to the coordinates", () => {
      const line = Line.create();
      line.addCoordinate(coord1);
      expect(line.coordinates).toEqual([coord1]);
      line.addCoordinate(coord2);
      expect(line.coordinates).toEqual([coord1, coord2]);
    });
    it("should return a RoadLocation", () => {
      const line = Line.create();
      expect(line.type).toBe(ROAD);
    });
  });
  describe("when the geo json is a polygon", () => {
    it("should add the new one to the coordinates", () => {
      const polygon = Polygon.create();
      polygon.addCoordinate(coord1);
      expect(polygon.coordinates).toEqual([coord1]);
      polygon.addCoordinate(coord2);
      expect(polygon.coordinates).toEqual([coord1, coord2]);
    });
    it("should return an AreaLocation", () => {
      const polygon = Polygon.create();
      expect(polygon.type).toBe(AREA);
    });
  });
});
