import { describe, expect, it } from "vitest";
import { POINT, ROAD, AREA } from "./location.js";
import { Point } from "./point.js";
import { Line } from "./line.js";
import { Polygon } from "./polygon.js";

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

describe("add coordinate to geo-location", () => {
  describe("when the geo location is a point", () => {
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
  describe("when the geo location is a line", () => {
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
  describe("when the geo location is a polygon", () => {
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
      const l = location;
      const displayReference = `${l.name} ${JSON.stringify(reference)}`;
      const displayCoordinate = `Point ${JSON.stringify(coordinate)}`;
      const displayExpectation = expected ? "is near" : "is NOT near";
      it(`should indicate ${displayCoordinate} ${displayExpectation} ${displayReference}`, () => {
        expect(l.create(reference).isNear(coordinate, distance)).toBe(expected);
      });
    },
  );
});

describe("Get barycentre", () => {
  describe.each`
    structureName   | structure  | numberOfCoordinates | coordinates                                 | expectedBarycentreCoordinates
    ${Point.name}   | ${Point}   | ${1}                | ${pointA}                                   | ${pointA}
    ${Line.name}    | ${Line}    | ${2}                | ${[pointA, pointF]}                         | ${pointA}
    ${Line.name}    | ${Line}    | ${3}                | ${[pointA, pointC, pointF]}                 | ${pointC}
    ${Line.name}    | ${Line}    | ${4}                | ${[pointA, pointC, pointB, pointF]}         | ${pointC}
    ${Line.name}    | ${Line}    | ${5}                | ${[pointA, pointC, pointB, pointF, pointE]} | ${pointB}
    ${Polygon.name} | ${Polygon} | ${5}                | ${[pointA, pointB, pointE, pointF, pointC]} | ${pointA}
  `(
    "When asking for barycentre from $structureName with $numberOfCoordinates coordinates",
    ({ structure, coordinates, expectedBarycentreCoordinates }) => {
      it(`should retrieve a Point with ${JSON.stringify(expectedBarycentreCoordinates)} as coordinates`, () => {
        const expectedBarycentre = {
          type: POINT,
          coordinates: expectedBarycentreCoordinates,
        };
        expect(structure.create(coordinates).barycentre).toStrictEqual(
          expectedBarycentre,
        );
      });
    },
  );
});
