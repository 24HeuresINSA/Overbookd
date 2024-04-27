import { describe, it, expect, beforeEach } from "vitest";
import { Period, Duration } from "@overbookd/period";
import { BreakPeriods } from "./break-periods";
import { InMemoryBreakRepository } from "./break-repository.inmemory";

const saturday02h = new Date("2024-05-18T02:00+02:00");
const saturday04h = new Date("2024-05-18T04:00+02:00");
const saturday06h = new Date("2024-05-18T06:00+02:00");
const saturday10h = new Date("2024-05-18T10:00+02:00");
const saturday11h30 = new Date("2024-05-18T11:30+02:00");
const saturday14h = new Date("2024-05-18T14:00+02:00");
const sunday04h = new Date("2024-05-19T04:00+02:00");
const sunday10h = new Date("2024-05-19T10:00+02:00");
const sixHours = Duration.hours(6);
const saturday02hTo06h = Period.init({ start: saturday02h, end: saturday06h });
const sunday04hTo10h = Period.init({ start: sunday04h, end: sunday10h });

const noel = { id: 1 };
const lea = { id: 2, breaks: [saturday02hTo06h] };
const tatouine = { id: 3, breaks: [saturday02hTo06h, sunday04hTo10h] };

describe("Add break period to volunteer", () => {
  let breakPeriods: BreakPeriods;
  beforeEach(() => {
    const breaks = new InMemoryBreakRepository(
      new Map([
        [lea.id, lea.breaks],
        [tatouine.id, tatouine.breaks],
      ]),
    );
    breakPeriods = new BreakPeriods(breaks);
  });
  describe.each`
    volunteer | start          | duration               | expectedBreaks
    ${noel}   | ${saturday04h} | ${sixHours}            | ${[Period.init({ start: saturday04h, end: saturday10h })]}
    ${noel}   | ${saturday02h} | ${Duration.hours(2)}   | ${[Period.init({ start: saturday02h, end: saturday04h })]}
    ${noel}   | ${saturday06h} | ${Duration.hours(8)}   | ${[Period.init({ start: saturday06h, end: saturday14h })]}
    ${noel}   | ${saturday06h} | ${Duration.hours(5.5)} | ${[Period.init({ start: saturday06h, end: saturday11h30 })]}
  `(
    "when add a break from $start during $duration",
    ({ volunteer, start, duration, expectedBreaks }) => {
      let generatedBreaks: Period[];
      beforeEach(async () => {
        generatedBreaks = await breakPeriods.for({
          volunteer: volunteer.id,
          during: { start, duration },
        });
      });
      it(`should settle ${expectedBreaks.length} breaks`, async () => {
        expect(generatedBreaks).toStrictEqual(expectedBreaks);
      });
      it("should store it afterward", async () => {
        const storedBreaks = await breakPeriods.of(volunteer.id);
        expect(storedBreaks).toStrictEqual(expectedBreaks);
      });
    },
  );
  describe("when volunteer has already some breaks", () => {
    it("should retrieve previous breaks with new settle one", async () => {
      const start = sunday04h;
      const duration = sixHours;
      const generatedBreaks = await breakPeriods.for({
        volunteer: lea.id,
        during: { start, duration },
      });
      const expectedBreaks = [
        saturday02hTo06h,
        Period.init({ start: sunday04h, end: sunday10h }),
      ];
      expect(generatedBreaks).toStrictEqual(expectedBreaks);
    });
  });
});

describe("Remove break period", () => {
  let breakPeriods: BreakPeriods;
  beforeEach(() => {
    const breaks = new InMemoryBreakRepository(
      new Map([
        [lea.id, lea.breaks],
        [tatouine.id, tatouine.breaks],
      ]),
    );
    breakPeriods = new BreakPeriods(breaks);
  });
  describe.each`
    volunteer      | breakToRemove       | expectedRemainingBreaks
    ${lea.id}      | ${saturday02hTo06h} | ${[]}
    ${tatouine.id} | ${saturday02hTo06h} | ${[sunday04hTo10h]}
    ${tatouine.id} | ${sunday04hTo10h}   | ${[saturday02hTo06h]}
  `(
    "when removing an existing break from $volunteer",
    ({ volunteer, breakToRemove, expectedRemainingBreaks }) => {
      let remainingBreaks: Period[];
      beforeEach(async () => {
        const breakIdentifier = { volunteer, period: breakToRemove };
        remainingBreaks = await breakPeriods.remove(breakIdentifier);
      });
      it("should retrieve previous breaks without the removing one", async () => {
        expect(remainingBreaks).toStrictEqual(expectedRemainingBreaks);
      });
      it("should store it afterward", async () => {
        const storedBreaks = await breakPeriods.of(volunteer);
        expect(storedBreaks).toStrictEqual(expectedRemainingBreaks);
      });
    },
  );
});
