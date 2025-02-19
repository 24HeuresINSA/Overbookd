import { beforeEach, describe, expect, it } from "vitest";
import { PeriodOrchestrator } from "./period-orchestrator.js";
import { Period } from "@overbookd/time";

describe("Period orchestrator", () => {
  describe("when there is no existing period", () => {
    it("should be initialized", () => {
      expect(() => PeriodOrchestrator.init()).not.toThrow();
    });
    describe("when adding a 1 hour period", () => {
      let periodOrchestrator: PeriodOrchestrator;
      const period = Period.init({
        start: new Date("2023-05-12 05:00+02:00"),
        end: new Date("2023-05-12 06:00+02:00"),
      });
      beforeEach(() => {
        periodOrchestrator = PeriodOrchestrator.init();
      });
      it("should tell this is a new period", () => {
        expect(periodOrchestrator.areNewPeriodsAdded([period])).toBe(true);
      });
      it("should alert the user that the period is too short and should last at least 2 hours", () => {
        periodOrchestrator.addPeriod(period);
        expect(periodOrchestrator.errors).toEqual([
          {
            ...period,
            message: "La période doit durer au moins 2 heures",
          },
        ]);
      });
    });
    describe("when adding a 3 hours period", () => {
      it("shouldn't have any error in the report", () => {
        const periodOrchestrator = PeriodOrchestrator.init();
        const period = Period.init({
          start: new Date("2023-05-12 03:00+02:00"),
          end: new Date("2023-05-12 06:00+02:00"),
        });
        periodOrchestrator.addPeriod(period);
        expect(periodOrchestrator.errors).toEqual([]);
      });
    });
  });
  describe("when there is existing periods", () => {
    const periods = [
      {
        start: new Date("2023-05-12 02:00+02:00"),
        end: new Date("2023-05-12 03:00+02:00"),
      },
      {
        start: new Date("2023-05-12 04:00+02:00"),
        end: new Date("2023-05-12 06:00+02:00"),
      },
      {
        start: new Date("2023-05-12 08:00+02:00"),
        end: new Date("2023-05-12 12:00+02:00"),
      },
    ];
    it("should be initialized", () => {
      expect(() => PeriodOrchestrator.init(periods)).not.toThrow();
    });
    describe("when adding a period", () => {
      it("should inform the user that only the period from 2 to 3 is too short", () => {
        const periodOrchestrator = PeriodOrchestrator.init(periods);
        expect(periodOrchestrator.errors).toEqual([
          {
            start: new Date("2023-05-12 02:00+02:00"),
            end: new Date("2023-05-12 03:00+02:00"),
            message: "La période doit durer au moins 2 heures",
          },
        ]);
      });
      it("should merge the 6 periods to 3 jointed ones", () => {
        const periodOrchestrator = PeriodOrchestrator.init(periods);
        expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
        expect(periodOrchestrator.availabilityPeriods).toEqual([
          {
            start: new Date("2023-05-12 02:00+02:00"),
            end: new Date("2023-05-12 03:00+02:00"),
          },
          {
            start: new Date("2023-05-12 04:00+02:00"),
            end: new Date("2023-05-12 06:00+02:00"),
          },
          {
            start: new Date("2023-05-12 08:00+02:00"),
            end: new Date("2023-05-12 12:00+02:00"),
          },
        ]);
      });
      describe("when adding an existing period", () => {
        let periodOrchestrator: PeriodOrchestrator;
        const period = Period.init({
          start: new Date("2023-05-12 04:00+02:00"),
          end: new Date("2023-05-12 05:00+02:00"),
        });
        beforeEach(() => {
          periodOrchestrator = PeriodOrchestrator.init(periods);
        });
        it("should tell this is a not new period", () => {
          expect(periodOrchestrator.areNewPeriodsAdded([period])).toBe(false);
        });
        it("should not duplicate periods", () => {
          periodOrchestrator.addPeriod(period);
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
            },
            {
              start: new Date("2023-05-12 04:00+02:00"),
              end: new Date("2023-05-12 06:00+02:00"),
            },
            {
              start: new Date("2023-05-12 08:00+02:00"),
              end: new Date("2023-05-12 12:00+02:00"),
            },
          ]);
        });
      });
      describe("when adding a period before the period from 2 to 3", () => {
        let periodOrchestrator: PeriodOrchestrator;
        const period = Period.init({
          start: new Date("2023-05-12 00:00+02:00"),
          end: new Date("2023-05-12 02:00+02:00"),
        });
        beforeEach(() => {
          periodOrchestrator = PeriodOrchestrator.init(periods);
        });
        it("should tell this is a new period", () => {
          expect(periodOrchestrator.areNewPeriodsAdded([period])).toBe(true);
        });
        it("shouldn't have any error in the report", () => {
          periodOrchestrator.addPeriod(period);
          expect(periodOrchestrator.errors).toEqual([]);
        });
        it("should merge the 6 periods to 3 jointed ones", () => {
          periodOrchestrator.addPeriod(period);
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date("2023-05-12 00:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
            },
            {
              start: new Date("2023-05-12 04:00+02:00"),
              end: new Date("2023-05-12 06:00+02:00"),
            },
            {
              start: new Date("2023-05-12 08:00+02:00"),
              end: new Date("2023-05-12 12:00+02:00"),
            },
          ]);
        });
      });
      describe("when adding a period before the period from 8 to 12", () => {
        let periodOrchestrator: PeriodOrchestrator;
        const period = Period.init({
          start: new Date("2023-05-12 06:00+02:00"),
          end: new Date("2023-05-12 08:00+02:00"),
        });
        beforeEach(() => {
          periodOrchestrator = PeriodOrchestrator.init(periods);
        });
        it("should tell this is a new period", () => {
          expect(periodOrchestrator.areNewPeriodsAdded([period])).toBe(true);
        });
        it("should inform the user that only the period from 2 to 3 is too short", () => {
          periodOrchestrator.addPeriod(period);
          expect(periodOrchestrator.errors).toEqual([
            {
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
              message: "La période doit durer au moins 2 heures",
            },
          ]);
        });
        it("should merge the 6 periods to 2 jointed ones", () => {
          periodOrchestrator.addPeriod(period);
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(2);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
            },
            {
              start: new Date("2023-05-12 04:00+02:00"),
              end: new Date("2023-05-12 12:00+02:00"),
            },
          ]);
        });
      });
      describe("when adding a period inside the period from 8 to 12", () => {
        let periodOrchestrator: PeriodOrchestrator;
        const period = Period.init({
          start: new Date("2023-05-12 09:00+02:00"),
          end: new Date("2023-05-12 11:00+02:00"),
        });
        beforeEach(() => {
          periodOrchestrator = PeriodOrchestrator.init(periods);
        });
        it("should tell this is not a new period", () => {
          expect(periodOrchestrator.areNewPeriodsAdded([period])).toBe(false);
        });
        it("should inform the user that only the period from 2 to 3 is too short", () => {
          periodOrchestrator.addPeriod(period);
          expect(periodOrchestrator.errors).toEqual([
            {
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
              message: "La période doit durer au moins 2 heures",
            },
          ]);
        });
        it("should merge the 6 periods to 3 jointed ones", () => {
          periodOrchestrator.addPeriod(period);
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
            },
            {
              start: new Date("2023-05-12 04:00+02:00"),
              end: new Date("2023-05-12 06:00+02:00"),
            },
            {
              start: new Date("2023-05-12 08:00+02:00"),
              end: new Date("2023-05-12 12:00+02:00"),
            },
          ]);
        });
      });
    });
    describe("when adding multiple periods", () => {
      let periodOrchestrator: PeriodOrchestrator;
      beforeEach(() => {
        periodOrchestrator = PeriodOrchestrator.init(periods);
      });
      describe("when adding the same periods", () => {
        it("should tell there is no new period", () => {
          expect(periodOrchestrator.areNewPeriodsAdded(periods)).toBe(false);
        });
      });
      describe("when adding an existing period with a new one", () => {
        it("should tell there is a new period", () => {
          expect(
            periodOrchestrator.areNewPeriodsAdded([
              {
                start: new Date("2023-05-12 04:00+02:00"),
                end: new Date("2023-05-12 06:00+02:00"),
              },
              {
                start: new Date("2023-05-12 14:00+02:00"),
                end: new Date("2023-05-12 16:00+02:00"),
              },
            ]),
          ).toBe(true);
        });
      });
      describe("when adding an existing period with a overlapping one", () => {
        it("should tell there is a new period", () => {
          expect(
            periodOrchestrator.areNewPeriodsAdded([
              {
                start: new Date("2023-05-12 04:00+02:00"),
                end: new Date("2023-05-12 06:00+02:00"),
              },
              {
                start: new Date("2023-05-12 07:00+02:00"),
                end: new Date("2023-05-12 09:00+02:00"),
              },
            ]),
          ).toBe(true);
          expect(
            periodOrchestrator.areNewPeriodsAdded([
              {
                start: new Date("2023-05-12 04:00+02:00"),
                end: new Date("2023-05-12 06:00+02:00"),
              },
              {
                start: new Date("2023-05-12 11:00+02:00"),
                end: new Date("2023-05-12 13:00+02:00"),
              },
            ]),
          ).toBe(true);
          expect(
            periodOrchestrator.areNewPeriodsAdded([
              {
                start: new Date("2023-05-12 04:00+02:00"),
                end: new Date("2023-05-12 06:00+02:00"),
              },
              {
                start: new Date("2023-05-12 07:00+02:00"),
                end: new Date("2023-05-12 13:00+02:00"),
              },
            ]),
          ).toBe(true);
        });
      });
    });
    describe("when removing a period", () => {
      describe("when removing an entire period", () => {
        it("should remove the period from availabilities", () => {
          const periodOrchestrator = PeriodOrchestrator.init(periods);
          periodOrchestrator.removePeriod(
            Period.init({
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
            }),
          );
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(2);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date("2023-05-12 04:00+02:00"),
              end: new Date("2023-05-12 06:00+02:00"),
            },
            {
              start: new Date("2023-05-12 08:00+02:00"),
              end: new Date("2023-05-12 12:00+02:00"),
            },
          ]);
        });
      });
      describe("when removing a part of a period", () => {
        it("should update impacted period", () => {
          const periodOrchestrator = PeriodOrchestrator.init(periods);
          periodOrchestrator.removePeriod(
            Period.init({
              start: new Date("2023-05-12 05:00+02:00"),
              end: new Date("2023-05-12 06:00+02:00"),
            }),
          );
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            Period.init({
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
            }),
            Period.init({
              start: new Date("2023-05-12 04:00+02:00"),
              end: new Date("2023-05-12 05:00+02:00"),
            }),
            Period.init({
              start: new Date("2023-05-12 08:00+02:00"),
              end: new Date("2023-05-12 12:00+02:00"),
            }),
          ]);
        });
      });
      describe("when removing center part of a period", () => {
        it("should update impacted period", () => {
          const [firstPeriod, secondPeriod] = periods;
          const periodOrchestrator = PeriodOrchestrator.init([
            firstPeriod,
            secondPeriod,
            {
              start: new Date("2023-05-12 08:00+02:00"),
              end: new Date("2023-05-12 14:00+02:00"),
            },
          ]);
          periodOrchestrator.removePeriod(
            Period.init({
              start: new Date("2023-05-12 10:00+02:00"),
              end: new Date("2023-05-12 12:00+02:00"),
            }),
          );
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(4);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            Period.init({
              start: new Date("2023-05-12 02:00+02:00"),
              end: new Date("2023-05-12 03:00+02:00"),
            }),
            Period.init({
              start: new Date("2023-05-12 04:00+02:00"),
              end: new Date("2023-05-12 06:00+02:00"),
            }),
            Period.init({
              start: new Date("2023-05-12 08:00+02:00"),
              end: new Date("2023-05-12 10:00+02:00"),
            }),
            Period.init({
              start: new Date("2023-05-12 12:00+02:00"),
              end: new Date("2023-05-12 14:00+02:00"),
            }),
          ]);
        });
      });
    });
  });
  describe("when adding periods then removing some", () => {
    const periodOrchestrator = PeriodOrchestrator.init();
    const friday03hTo06h = Period.init({
      start: new Date("2023-05-12 03:00+02:00"),
      end: new Date("2023-05-12 06:00+02:00"),
    });
    const friday06hTo10h = Period.init({
      start: new Date("2023-05-12 06:00+02:00"),
      end: new Date("2023-05-12 10:00+02:00"),
    });
    const friday08hTo10h = Period.init({
      start: new Date("2023-05-12 08:00+02:00"),
      end: new Date("2023-05-12 10:00+02:00"),
    });
    const friday06hTo08h = Period.init({
      start: new Date("2023-05-12 06:00+02:00"),
      end: new Date("2023-05-12 08:00+02:00"),
    });
    periodOrchestrator.addPeriod(friday03hTo06h);
    periodOrchestrator.addPeriod(friday06hTo10h);
    periodOrchestrator.removePeriod(friday06hTo08h);

    it("shouldn't have any error in the report", () => {
      expect(periodOrchestrator.errors).toEqual([]);
    });
    it("should keep 2 periods (03h-06h) and (08h-10h)", () => {
      expect(periodOrchestrator.availabilityPeriods).toHaveLength(2);
      expect(periodOrchestrator.availabilityPeriods).toEqual([
        friday03hTo06h,
        friday08hTo10h,
      ]);
    });
  });
});
