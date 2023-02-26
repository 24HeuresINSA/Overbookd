import { beforeEach, describe, expect, it } from '@jest/globals';
import { PeriodOrchestrator } from './period-orchestrator';

describe('Period orchestrator', () => {
  describe('when there is no existing period', () => {
    it('should be initialized', () => {
      expect(() => PeriodOrchestrator.init()).not.toThrow();
    });
    describe('when adding a 1 hour period', () => {
      it('should alert the user that the period is too short and should last at least 2 hours', () => {
        const periodOrchestrator = PeriodOrchestrator.init();
        const period = {
          start: new Date('2023-05-12 05:00'),
          end: new Date('2023-05-12 06:00'),
        };
        periodOrchestrator.addPeriod(period);
        expect(periodOrchestrator.errors).toEqual([
          {
            ...period,
            message: 'La période doit durer au moins 2 heures',
          },
        ]);
      });
    });
    describe('when adding a 3 hours period', () => {
      it("shouldn't have any error in the report", () => {
        const periodOrchestrator = PeriodOrchestrator.init();
        const period = {
          start: new Date('2023-05-12 03:00'),
          end: new Date('2023-05-12 06:00'),
        };
        periodOrchestrator.addPeriod(period);
        expect(periodOrchestrator.errors).toEqual([]);
      });
    });
  });
  describe('when there is existing periods', () => {
    const periods = [
      {
        start: new Date('2023-05-12 02:00'),
        end: new Date('2023-05-12 03:00'),
      },
      {
        start: new Date('2023-05-12 04:00'),
        end: new Date('2023-05-12 05:00'),
      },
      {
        start: new Date('2023-05-12 05:00'),
        end: new Date('2023-05-12 06:00'),
      },
      {
        start: new Date('2023-05-12 08:00'),
        end: new Date('2023-05-12 10:00'),
      },
      {
        start: new Date('2023-05-12 10:00'),
        end: new Date('2023-05-12 12:00'),
      },
    ];
    it('should be initialized', () => {
      expect(() => PeriodOrchestrator.init(periods)).not.toThrow();
    });
    describe('when adding a period', () => {
      it('should inform the user that only the period from 2 to 3 is too short', () => {
        const periodOrchestrator = PeriodOrchestrator.init(periods);
        expect(periodOrchestrator.errors).toEqual([
          {
            start: new Date('2023-05-12 02:00'),
            end: new Date('2023-05-12 03:00'),
            message: 'La période doit durer au moins 2 heures',
          },
        ]);
      });
      it('should merge the 6 periods to 3 jointed ones', () => {
        const periodOrchestrator = PeriodOrchestrator.init(periods);
        expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
        expect(periodOrchestrator.availabilityPeriods).toEqual([
          {
            start: new Date('2023-05-12 02:00'),
            end: new Date('2023-05-12 03:00'),
          },
          {
            start: new Date('2023-05-12 04:00'),
            end: new Date('2023-05-12 06:00'),
          },
          {
            start: new Date('2023-05-12 08:00'),
            end: new Date('2023-05-12 12:00'),
          },
        ]);
      });
      describe('when adding an existing period', () => {
        let periodOrchestrator: PeriodOrchestrator;
        beforeEach(() => {
          periodOrchestrator = PeriodOrchestrator.init(periods);
          const period = {
            start: new Date('2023-05-12 04:00'),
            end: new Date('2023-05-12 05:00'),
          };
          periodOrchestrator.addPeriod(period);
        });
        it('should not duplicate periods', () => {
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date('2023-05-12 02:00'),
              end: new Date('2023-05-12 03:00'),
            },
            {
              start: new Date('2023-05-12 04:00'),
              end: new Date('2023-05-12 06:00'),
            },
            {
              start: new Date('2023-05-12 08:00'),
              end: new Date('2023-05-12 12:00'),
            },
          ]);
        });
      });
      describe('when adding a period before the period from 2 to 3', () => {
        let periodOrchestrator: PeriodOrchestrator;
        beforeEach(() => {
          periodOrchestrator = PeriodOrchestrator.init(periods);
          const period = {
            start: new Date('2023-05-12 00:00'),
            end: new Date('2023-05-12 02:00'),
          };
          periodOrchestrator.addPeriod(period);
        });
        it("shouldn't have any error in the report", () => {
          expect(periodOrchestrator.errors).toEqual([]);
        });
        it('should merge the 6 periods to 3 jointed ones', () => {
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date('2023-05-12 00:00'),
              end: new Date('2023-05-12 03:00'),
            },
            {
              start: new Date('2023-05-12 04:00'),
              end: new Date('2023-05-12 06:00'),
            },
            {
              start: new Date('2023-05-12 08:00'),
              end: new Date('2023-05-12 12:00'),
            },
          ]);
        });
      });
      describe('when adding a period before the period from 8 to 10', () => {
        let periodOrchestrator: PeriodOrchestrator;
        beforeEach(() => {
          periodOrchestrator = PeriodOrchestrator.init(periods);
          const period = {
            start: new Date('2023-05-12 06:00'),
            end: new Date('2023-05-12 08:00'),
          };
          periodOrchestrator.addPeriod(period);
        });
        it('should inform the user that only the period from 2 to 3 is too short', () => {
          expect(periodOrchestrator.errors).toEqual([
            {
              start: new Date('2023-05-12 02:00'),
              end: new Date('2023-05-12 03:00'),
              message: 'La période doit durer au moins 2 heures',
            },
          ]);
        });
        it('should merge the 6 periods to 2 jointed ones', () => {
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(2);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date('2023-05-12 02:00'),
              end: new Date('2023-05-12 03:00'),
            },
            {
              start: new Date('2023-05-12 04:00'),
              end: new Date('2023-05-12 12:00'),
            },
          ]);
        });
      });
    });
    describe('when removing a period', () => {
      describe('when removing an entire period', () => {
        it('should remove the period from availabilities', () => {
          const periodOrchestrator = PeriodOrchestrator.init(periods);
          periodOrchestrator.removePeriod({
            start: new Date('2023-05-12 02:00'),
            end: new Date('2023-05-12 03:00'),
          });
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(2);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date('2023-05-12 04:00'),
              end: new Date('2023-05-12 06:00'),
            },
            {
              start: new Date('2023-05-12 08:00'),
              end: new Date('2023-05-12 12:00'),
            },
          ]);
        });
      });
      describe('when removing a part of a period', () => {
        it('should update impacted period', () => {
          const periodOrchestrator = PeriodOrchestrator.init(periods);
          periodOrchestrator.removePeriod({
            start: new Date('2023-05-12 05:00'),
            end: new Date('2023-05-12 06:00'),
          });
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(3);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date('2023-05-12 02:00'),
              end: new Date('2023-05-12 03:00'),
            },
            {
              start: new Date('2023-05-12 04:00'),
              end: new Date('2023-05-12 05:00'),
            },
            {
              start: new Date('2023-05-12 08:00'),
              end: new Date('2023-05-12 12:00'),
            },
          ]);
        });
      });
      describe('when removing center part of a period', () => {
        it('should update impated period', () => {
          const periodOrchestrator = PeriodOrchestrator.init([
            ...periods,
            {
              start: new Date('2023-05-12 12:00'),
              end: new Date('2023-05-12 14:00'),
            },
          ]);
          periodOrchestrator.removePeriod({
            start: new Date('2023-05-12 10:00'),
            end: new Date('2023-05-12 12:00'),
          });
          expect(periodOrchestrator.availabilityPeriods).toHaveLength(4);
          expect(periodOrchestrator.availabilityPeriods).toEqual([
            {
              start: new Date('2023-05-12 02:00'),
              end: new Date('2023-05-12 03:00'),
            },
            {
              start: new Date('2023-05-12 04:00'),
              end: new Date('2023-05-12 06:00'),
            },
            {
              start: new Date('2023-05-12 08:00'),
              end: new Date('2023-05-12 10:00'),
            },
            {
              start: new Date('2023-05-12 12:00'),
              end: new Date('2023-05-12 14:00'),
            },
          ]);
        });
      });
    });
  });
});
