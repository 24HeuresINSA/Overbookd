import { describe, expect, it } from "vitest";
import {
  groupAssigneesByPeriod,
  splitOverlappingPeriods,
} from "./assignees-by-period.js";

const at = (hour: number) =>
  new Date(`2024-05-10T${hour.toString().padStart(2, "0")}:00:00`);

const period = (startHour: number, endHour: number) => ({
  start: at(startHour),
  end: at(endHour),
});

describe("splitOverlappingPeriods", () => {
  it("should return periods as-is when none overlap", () => {
    const periods = [period(10, 12), period(14, 16)];
    expect(splitOverlappingPeriods(periods)).toEqual([
      period(10, 12),
      period(14, 16),
    ]);
  });

  it("should split two partially overlapping periods", () => {
    const periods = [period(10, 14), period(12, 16)];
    expect(splitOverlappingPeriods(periods)).toEqual([
      period(10, 12),
      period(12, 14),
      period(14, 16),
    ]);
  });

  it("should split a period contained in another one", () => {
    const periods = [period(10, 16), period(12, 14)];
    expect(splitOverlappingPeriods(periods)).toEqual([
      period(10, 12),
      period(12, 14),
      period(14, 16),
    ]);
  });

  it("should split a chain of overlapping periods", () => {
    const periods = [period(10, 12), period(11, 13), period(12, 15)];
    expect(splitOverlappingPeriods(periods)).toEqual([
      period(10, 11),
      period(11, 12),
      period(12, 13),
      period(13, 15),
    ]);
  });

  it("should ignore duplicate periods", () => {
    const periods = [period(10, 12), period(10, 12)];
    expect(splitOverlappingPeriods(periods)).toEqual([period(10, 12)]);
  });
});

describe("groupAssigneesByPeriod", () => {
  const noel = { id: 1, name: "Noel" };
  const olop = { id: 2, name: "Olop" };
  const dnamra = { id: 3, name: "Dnamra" };
  const rasec = { id: 4, name: "Rasec" };

  it("should return an empty list when there is no assignee", () => {
    expect(groupAssigneesByPeriod(period(14, 18), [])).toEqual([]);
  });

  it("should group every assignee in a single period when they share the container period", () => {
    const res = groupAssigneesByPeriod(period(14, 18), [
      { volunteer: noel, period: period(14, 18) },
      { volunteer: olop, period: period(14, 18) },
    ]);
    expect(res).toEqual([{ period: period(14, 18), volunteers: [noel, olop] }]);
  });

  it("should split assignees into sub-periods and exclude those outside the container period", () => {
    const res = groupAssigneesByPeriod(period(14, 18), [
      { volunteer: noel, period: period(14, 16) },
      { volunteer: olop, period: period(16, 18) },
      { volunteer: dnamra, period: period(14, 18) },
      { volunteer: rasec, period: period(20, 22) },
    ]);
    expect(res).toEqual([
      { period: period(14, 16), volunteers: [noel, dnamra] },
      { period: period(16, 18), volunteers: [olop, dnamra] },
    ]);
  });

  it("should list a volunteer on every sub-period he overlaps", () => {
    const res = groupAssigneesByPeriod(period(14, 20), [
      { volunteer: noel, period: period(14, 18) },
      { volunteer: olop, period: period(16, 20) },
    ]);
    expect(res).toEqual([
      { period: period(14, 16), volunteers: [noel] },
      { period: period(16, 18), volunteers: [noel, olop] },
      { period: period(18, 20), volunteers: [olop] },
    ]);
  });

  it("should drop empty sub-periods at the edges of the container period", () => {
    const res = groupAssigneesByPeriod(period(14, 20), [
      { volunteer: noel, period: period(15, 16) },
    ]);
    expect(res).toEqual([{ period: period(15, 16), volunteers: [noel] }]);
  });

  it("should clip assignee periods extending beyond the container period", () => {
    const res = groupAssigneesByPeriod(period(14, 18), [
      { volunteer: noel, period: period(12, 16) },
    ]);
    expect(res).toEqual([{ period: period(14, 16), volunteers: [noel] }]);
  });

  it("should not duplicate a volunteer assigned on several periods", () => {
    const res = groupAssigneesByPeriod(period(14, 18), [
      { volunteer: noel, period: period(14, 16) },
      { volunteer: noel, period: period(15, 18) },
    ]);
    expect(res).toEqual([
      { period: period(14, 15), volunteers: [noel] },
      { period: period(15, 16), volunteers: [noel] },
      { period: period(16, 18), volunteers: [noel] },
    ]);
  });
});
