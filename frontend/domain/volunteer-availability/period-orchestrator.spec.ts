import { describe, it, expect } from "@jest/globals";
import { PeriodOrchestrator } from "./period-orchestrator";

describe("Period orchestrator", () => {
  describe("when there is no existing period", () => {
    it("should be initialized", () => {
      expect(() => PeriodOrchestrator.init()).not.toThrow();
    });
    describe("when adding a 1 hour period", () => {
      it("should alert the user that the period is too short and should last at least 2 hours", () => {
        const periodOrchestrator = PeriodOrchestrator.init();
        const period = {
          start: new Date("2023-05-12 05:00"),
          end: new Date("2023-05-12 06:00"),
        };
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
        const period = {
          start: new Date("2023-05-12 03:00"),
          end: new Date("2023-05-12 06:00"),
        };
        periodOrchestrator.addPeriod(period);
        expect(periodOrchestrator.errors).toEqual([]);
      });
    });
  });
  describe("when there is existing periods", () => {
    const periods = [
      {
        start: new Date("2023-05-12 02:00"),
        end: new Date("2023-05-12 03:00"),
      },
      {
        start: new Date("2023-05-12 04:00"),
        end: new Date("2023-05-12 05:00"),
      },
      {
        start: new Date("2023-05-12 05:00"),
        end: new Date("2023-05-12 06:00"),
      },
      {
        start: new Date("2023-05-12 08:00"),
        end: new Date("2023-05-12 10:00"),
      },
      {
        start: new Date("2023-05-12 10:00"),
        end: new Date("2023-05-12 12:00"),
      },
    ];
    it("should be initialized", () => {
      expect(() => PeriodOrchestrator.init(periods)).not.toThrow();
    });
    it("should inform the user that only the period from 2 to 3 is too short", () => {
      const periodOrchestrator = PeriodOrchestrator.init(periods);
      expect(periodOrchestrator.errors).toEqual([
        {
          start: new Date("2023-05-12 02:00"),
          end: new Date("2023-05-12 03:00"),
          message: "La période doit durer au moins 2 heures",
        },
      ]);
    });
    describe("when adding a period before the period from 2 to 3", () => {
      it("shouldn't have any error in the report", () => {
        const periodOrchestrator = PeriodOrchestrator.init(periods);
        const period = {
          start: new Date("2023-05-12 00:00"),
          end: new Date("2023-05-12 02:00"),
        };
        periodOrchestrator.addPeriod(period);
        expect(periodOrchestrator.errors).toEqual([]);
      });
    });
  });
});
