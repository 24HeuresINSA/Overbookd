import { describe, expect, it } from "@jest/globals";
import { POINT, ROAD, AREA } from "@overbookd/signa";
import { Point } from "./point";
import { Line } from "./line";
import { Polygon } from "./polygon";

const pointA = { lat: 0, lng: 0 };
const pointB = { lat: 1, lng: 2 };
const pointC = { lat: 9, lng: 0 };
const pointD = { lat: 4, lng: 1 };
const pointE = { lat: 9, lng: 8 };
const pointF = { lat: 8, lng: 8 };

/*
   _ _ _ _ _ _ _ _ _ _
0| A                 C|
1|         D          |
2|   B                |
3|                    |
4|                    |
5|                    |
6|                    |
7|                   F|
8|                   E|
9| _ _ _ _ _ _ _ _ _ _|
   0 1 2 3 4 5 6 7 8 9
*/

describe("add coordinate to geo-json", () => {
  describe("when the geo json is a point", () => {
    it("should replace the coordinate by the new", () => {
      const point = Point.create(pointA);
      point.addCoordinate(pointB);
      expect(point.coordinates).toEqual(pointB);
    });
    it("should return a PointLocation", () => {
      const point = Point.create(pointA);
      expect(point.type).toBe(POINT);
    });
  });
  describe("when the geo json is a line", () => {
    it("should add the new one to the coordinates", () => {
      const line = Line.create();
      line.addCoordinate(pointA);
      expect(line.coordinates).toEqual([pointA]);
      line.addCoordinate(pointB);
      expect(line.coordinates).toEqual([pointA, pointB]);
    });
    it("should return a RoadLocation", () => {
      const line = Line.create();
      expect(line.type).toBe(ROAD);
    });
  });
  describe("when the geo json is a polygon", () => {
    it("should add the new one to the coordinates", () => {
      const polygon = Polygon.create();
      polygon.addCoordinate(pointA);
      expect(polygon.coordinates).toEqual([pointA]);
      polygon.addCoordinate(pointB);
      expect(polygon.coordinates).toEqual([pointA, pointB]);
    });
    it("should return an AreaLocation", () => {
      const polygon = Polygon.create();
      expect(polygon.type).toBe(AREA);
    });
  });
});

describe("compare proximity with location", () => {
  describe.each`
    location   | reference                           | distance | coordinate | expected
    ${Point}   | ${pointA}                           | ${3}     | ${pointB}  | ${true}
    ${Point}   | ${pointA}                           | ${1}     | ${pointB}  | ${false}
    ${Point}   | ${pointA}                           | ${3}     | ${pointE}  | ${false}
    ${Point}   | ${pointF}                           | ${1}     | ${pointE}  | ${true}
    ${Line}    | ${[pointA, pointD]}                 | ${3}     | ${pointB}  | ${true}
    ${Line}    | ${[pointA, pointD]}                 | ${3}     | ${pointC}  | ${false}
    ${Line}    | ${[pointA, pointD]}                 | ${1}     | ${pointB}  | ${false}
    ${Polygon} | ${[pointA, pointC, pointF, pointB]} | ${1}     | ${pointE}  | ${true}
    ${Polygon} | ${[pointA, pointC, pointF, pointB]} | ${1}     | ${pointD}  | ${false}
  `(
    "When looking for a range distance of $distance",
    ({ location, reference, distance, coordinate, expected }) => {
      const l = location as any;
      const displayReference = `${l.name} ${JSON.stringify(reference)}`;
      const displayCoordinate = `Point ${JSON.stringify(coordinate)}`;
      const displayExpectation = expected ? "is near" : "is NOT near";
      it(`should indicate ${displayCoordinate} ${displayExpectation} ${displayReference}`, () => {
        expect(l.create(reference).isNear(coordinate, distance)).toBe(expected);
      });
    },
  );
});
