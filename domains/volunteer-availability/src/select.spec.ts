import { describe, expect, it } from "vitest";
import { DateString, OverDate, Period } from "@overbookd/period";
import { AVAILABILITY_ERROR_MESSAGES } from "./volunteer-availability.error";
import { Availabilities } from "./availabilities";

const festivalStartDate: DateString = "2024-05-17";

const hour2 = OverDate.init({ date: festivalStartDate, hour: 2 }).date;
const hour3 = OverDate.init({ date: festivalStartDate, hour: 3 }).date;
const hour4 = OverDate.init({ date: festivalStartDate, hour: 4 }).date;
const hour5 = OverDate.init({ date: festivalStartDate, hour: 5 }).date;
const hour10 = OverDate.init({ date: festivalStartDate, hour: 10 }).date;
const hour12 = OverDate.init({ date: festivalStartDate, hour: 12 }).date;
const hour16 = OverDate.init({ date: festivalStartDate, hour: 16 }).date;
const hour18 = OverDate.init({ date: festivalStartDate, hour: 18 }).date;
const hour19 = OverDate.init({ date: festivalStartDate, hour: 19 }).date;
const hour21 = OverDate.init({ date: festivalStartDate, hour: 21 }).date;
const hour22 = OverDate.init({ date: festivalStartDate, hour: 22 }).date;

const from02hTo05h = Period.init({ start: hour2, end: hour5 });
const from03hTo04h = Period.init({ start: hour3, end: hour4 });
const from03hTo05h = Period.init({ start: hour3, end: hour5 });
const from04hTo05h = Period.init({ start: hour4, end: hour5 });
const from10hTo12h = Period.init({ start: hour10, end: hour12 });
const from16hTo18h = Period.init({ start: hour16, end: hour18 });
const from16hTo19h = Period.init({ start: hour16, end: hour19 });
const from21hTo22h = Period.init({ start: hour21, end: hour22 });

describe("Select and unselect availabilities", () => {
  describe("when volunteer hasn't any availability recorded yet", () => {
    describe.each`
      date                 | hour  | endHour | expectedError
      ${festivalStartDate} | ${10} | ${12}   | ${false}
      ${festivalStartDate} | ${6}  | ${8}    | ${false}
      ${festivalStartDate} | ${18} | ${19}   | ${true}
      ${festivalStartDate} | ${5}  | ${6}    | ${true}
      ${festivalStartDate} | ${22} | ${23}   | ${true}
    `(
      "when selecting $date at $hour h",
      ({ date, hour, endHour, expectedError }) => {
        const selected = { date, hour } as const;
        const start = OverDate.init(selected).date;
        const end = OverDate.init({ date, hour: endHour }).date;
        it(`should list one period from ${hour}h to ${endHour}h`, () => {
          const availabilities = Availabilities.init().select(selected);

          expect(availabilities.list).toHaveLength(1);
          expect(availabilities.list).toStrictEqual([
            Period.init({ start, end }),
          ]);
        });
        const indicateError =
          "should indicate that availability have to last at least 2 hours";
        const indicateAllRight =
          "should indicate that availability respect specification";
        const decideOnError = expectedError ? indicateError : indicateAllRight;
        it(decideOnError, () => {
          const availabilityError = {
            period: Period.init({ start, end }),
            message: AVAILABILITY_ERROR_MESSAGES.MINIMUM_PERIOD_DURATION,
          };
          const expectedErrors = expectedError ? [availabilityError] : [];

          const availabilities = Availabilities.init().select(selected);

          expect(availabilities.errors).toStrictEqual(expectedErrors);
        });
      },
    );
    describe(`when selecting ${festivalStartDate} at 10h then at 16h`, () => {
      it("should list two periods [10h-12h] and [16h-18h]", () => {
        const selected10H = { date: festivalStartDate, hour: 10 } as const;
        const selected16H = { date: festivalStartDate, hour: 16 } as const;

        const availabilities = Availabilities.init()
          .select(selected10H)
          .select(selected16H);

        expect(availabilities.list).toStrictEqual([
          Period.init({ start: hour10, end: hour12 }),
          Period.init({ start: hour16, end: hour18 }),
        ]);
      });
    });
    describe(`when selecting ${festivalStartDate} at 16h then at 10h (i.e. reverse order)`, () => {
      it("should list two periods [10h-12] and [16h-18h]", () => {
        const selected10H = { date: festivalStartDate, hour: 10 } as const;
        const selected16H = { date: festivalStartDate, hour: 16 } as const;
        const start10H = OverDate.init(selected10H).date;
        const end10H = OverDate.init({ ...selected10H, hour: 12 }).date;
        const start16H = OverDate.init(selected16H).date;
        const end16H = OverDate.init({ ...selected16H, hour: 18 }).date;
        const availabilities = Availabilities.init()
          .select(selected16H)
          .select(selected10H);
        expect(availabilities.list).toStrictEqual([
          Period.init({ start: start10H, end: end10H }),
          Period.init({ start: start16H, end: end16H }),
        ]);
      });
    });
    describe(`when selecting ${festivalStartDate} at 3h then at 4h`, () => {
      it("should list one period [03h-05h]", () => {
        const selected3H = { date: festivalStartDate, hour: 3 } as const;
        const selected4H = { date: festivalStartDate, hour: 4 } as const;
        const start = OverDate.init(selected3H).date;
        const end = OverDate.init({ ...selected3H, hour: 5 }).date;

        const availabilities = Availabilities.init()
          .select(selected3H)
          .select(selected4H);
        expect(availabilities.list).toStrictEqual([
          Period.init({ start: start, end: end }),
        ]);
      });
    });
    describe(`when ${festivalStartDate} [03h-05h], [10h-12h], [16h-19h] are already selected`, () => {
      const selected = [from03hTo05h, from10hTo12h, from16hTo19h];
      const initialState = Availabilities.init({ selected });

      describe.each`
        date                 | hour  | periodsCount | expectedPeriods                               | expectedError
        ${festivalStartDate} | ${18} | ${3}         | ${[from03hTo05h, from10hTo12h, from16hTo18h]} | ${undefined}
        ${festivalStartDate} | ${10} | ${2}         | ${[from03hTo05h, from16hTo19h]}               | ${undefined}
        ${festivalStartDate} | ${3}  | ${3}         | ${[from04hTo05h, from10hTo12h, from16hTo19h]} | ${{ period: from04hTo05h, message: AVAILABILITY_ERROR_MESSAGES.MINIMUM_PERIOD_DURATION }}
        ${festivalStartDate} | ${4}  | ${3}         | ${[from03hTo04h, from10hTo12h, from16hTo19h]} | ${{ period: from03hTo04h, message: AVAILABILITY_ERROR_MESSAGES.MINIMUM_PERIOD_DURATION }}
      `(
        "when unselecting $hour h",
        ({ date, hour, periodsCount, expectedPeriods, expectedError }) => {
          it(`should keep ${periodsCount} periods`, () => {
            const unselected = { date, hour };
            const availabilities = initialState.unselect(unselected);
            expect(availabilities.list).toHaveLength(periodsCount);
            expect(availabilities.list).toStrictEqual(expectedPeriods);
          });
          const indicateError =
            "should indicate that a remaining availability have to last at least 2 hours";
          const indicateAllRight =
            "should indicate that availabilities respect specification";
          const decideOnError = expectedError
            ? indicateError
            : indicateAllRight;
          it(decideOnError, () => {
            const unselected = { date, hour };
            const expectedErrors = expectedError ? [expectedError] : [];

            const availabilities = initialState.unselect(unselected);

            expect(availabilities.errors).toStrictEqual(expectedErrors);
          });
        },
      );
    });
  });
  describe("when volunteer has some availabilities recorded", () => {
    describe(`when ${festivalStartDate} [03h-05h], [10h-12h], [16h-19h] are already recorded`, () => {
      const recorded = [from03hTo05h, from10hTo12h, from16hTo19h];
      const initialState = Availabilities.init({ recorded });
      it("should list all 3 recorded periods", () => {
        expect(initialState.list).toHaveLength(3);
        const expectedPeriods = [from03hTo05h, from10hTo12h, from16hTo19h];
        expect(initialState.list).toStrictEqual(expectedPeriods);
      });
      describe(`when selecting ${festivalStartDate} 21h`, () => {
        it("should list 4 periods [03h-05h], [10h-12h], [16h-19h] and [21h-22h]", () => {
          const selected = { date: festivalStartDate, hour: 21 } as const;

          const availabilities = initialState.select(selected);

          expect(availabilities.list).toHaveLength(4);
          expect(availabilities.list).toStrictEqual([
            from03hTo05h,
            from10hTo12h,
            from16hTo19h,
            from21hTo22h,
          ]);
        });
        it("should indicate that availability [21h-22h] have to last at least 2 hours", () => {
          const selected = { date: festivalStartDate, hour: 21 } as const;
          const expectedError = {
            period: from21hTo22h,
            message: AVAILABILITY_ERROR_MESSAGES.MINIMUM_PERIOD_DURATION,
          };

          const availabilities = initialState.select(selected);

          expect(availabilities.errors).toStrictEqual([expectedError]);
        });
      });
      describe(`when selecting ${festivalStartDate} 02h`, () => {
        it("should list 3 periods [02h-05h], [10h-12h] and [16h-19h]", () => {
          const selected = { date: festivalStartDate, hour: 2 } as const;

          const availabilities = initialState.select(selected);

          expect(availabilities.list).toHaveLength(3);
          expect(availabilities.list).toStrictEqual([
            from02hTo05h,
            from10hTo12h,
            from16hTo19h,
          ]);
        });
        it("should indicate that all availabilities respect specification", () => {
          const selected = { date: festivalStartDate, hour: 2 } as const;

          const availabilities = initialState.select(selected);

          expect(availabilities.errors).toStrictEqual([]);
        });
      });
      describe(`when trying to select ${festivalStartDate} 04h that is already recorded`, () => {
        it("shouldn't add it to selected list", () => {
          const selected = { date: festivalStartDate, hour: 4 } as const;

          const availabilities = initialState.select(selected);

          expect(availabilities.selected).toStrictEqual([]);
        });
      });
      describe(`when trying to unselect ${festivalStartDate} 04h that is already recorded`, () => {
        it("shouldn't have any impact on listed periods", () => {
          const unselected = { date: festivalStartDate, hour: 4 } as const;
          const expectedPeriods = [from03hTo05h, from10hTo12h, from16hTo19h];

          const availabilities = initialState.unselect(unselected);

          expect(availabilities.list).toStrictEqual(expectedPeriods);
        });
      });
    });
  });
});
