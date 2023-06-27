import { beforeEach, describe, expect, it } from '@jest/globals';
import { Availability } from './volunteer-availability';
import { AvailabilityRegistery } from './volunteer-availability.registery';

describe('Volunteer availability registery', () => {
  describe('Add volunteer availability period', () => {
    describe("when volunteer doesn't have any availability", () => {
      it('should add a new availability', () => {
        const availabilityRegistery = AvailabilityRegistery.init();
        const period = {
          start: new Date('2023-05-12 01:00+02:00'),
          end: new Date('2023-05-12 05:00+02:00'),
        };
        availabilityRegistery.addPeriod(period);
        expect(availabilityRegistery.availabilities).toHaveLength(1);
        expect(availabilityRegistery.availabilities).toContainEqual(
          Availability.fromPeriod(period),
        );
      });
    });
    describe('when volunteer has already one availability', () => {
      let availabilityRegistery: AvailabilityRegistery;
      const existingPeriod = {
        start: new Date('2023-05-12 01:00+02:00'),
        end: new Date('2023-05-12 05:00+02:00'),
      };
      beforeEach(() => {
        availabilityRegistery = AvailabilityRegistery.fromAvailabilities([
          Availability.fromPeriod(existingPeriod),
        ]);
      });
      describe("when periods aren't jointed", () => {
        it('should add a new availability', () => {
          const addingPeriod = {
            start: new Date('2023-05-12 10:00+02:00'),
            end: new Date('2023-05-12 16:00+02:00'),
          };
          availabilityRegistery.addPeriod(addingPeriod);
          expect(availabilityRegistery.availabilities).toContainEqual(
            Availability.fromPeriod(existingPeriod),
          );
          expect(availabilityRegistery.availabilities).toContainEqual(
            Availability.fromPeriod(addingPeriod),
          );
        });
      });
      describe('when periods are jointed', () => {
        it('should merge periods to one availability', () => {
          const addingPeriod = {
            start: new Date('2023-05-12 05:00+02:00'),
            end: new Date('2023-05-12 16:00+02:00'),
          };
          availabilityRegistery.addPeriod(addingPeriod);
          expect(availabilityRegistery.availabilities).toHaveLength(1);
        });
      });
    });
    describe('when volunteer has several availabilities', () => {
      let availabilityRegistery: AvailabilityRegistery;
      let existingAvailabilities: Availability[] = [];
      beforeEach(() => {
        const fridayPartyShiftPeriod = {
          start: new Date('2023-05-12 21:00+02:00'),
          end: new Date('2023-05-13 00:00+02:00'),
        };
        const saturdayDayShiftPeriod = {
          start: new Date('2023-05-13 12:00+02:00'),
          end: new Date('2023-05-13 16:00+02:00'),
        };
        const saturdayPartyShiftPeriod = {
          start: new Date('2023-05-13 22:00+02:00'),
          end: new Date('2023-05-14 02:00+02:00'),
        };
        const sundayPartyAndNighShift = {
          start: new Date('2023-05-14 23:00+02:00'),
          end: new Date('2023-05-15 05:00+02:00'),
        };
        const availabilityPeriods = [
          fridayPartyShiftPeriod,
          saturdayDayShiftPeriod,
          saturdayPartyShiftPeriod,
          sundayPartyAndNighShift,
        ];
        existingAvailabilities = availabilityPeriods.map(
          Availability.fromPeriod,
        );
        availabilityRegistery = AvailabilityRegistery.fromAvailabilities(
          existingAvailabilities,
        );
      });
      describe('when adding availability period from 2023-05-12 12:00 to 2023-05-12 18:00', () => {
        it('should add a new availability for the period', () => {
          const addingPeriod = {
            start: new Date('2023-05-12 12:00+02:00'),
            end: new Date('2023-05-12 18:00+02:00'),
          };
          availabilityRegistery.addPeriod(addingPeriod);
          expect(availabilityRegistery.availabilities).toContainEqual(
            Availability.fromPeriod(addingPeriod),
          );
        });
      });
      describe('when adding availability period from 2023-05-13 00:00 to 2023-05-13 01:00', () => {
        it('should update friday party shift availability', () => {
          const addingPeriod = {
            start: new Date('2023-05-13 00:00+02:00'),
            end: new Date('2023-05-13 01:00+02:00'),
          };
          availabilityRegistery.addPeriod(addingPeriod);
          expect(availabilityRegistery.availabilities).toContainEqual(
            Availability.fromPeriod({
              start: existingAvailabilities[0].start,
              end: addingPeriod.end,
            }),
          );
        });
      });
      describe('when adding availability period from 2023-05-12 23:00 to 2023-05-13 15:00', () => {
        it('should merge friday party shift and saturday day availabilities', () => {
          const addingPeriod = {
            start: new Date('2023-05-12 23:00+02:00'),
            end: new Date('2023-05-13 15:00+02:00'),
          };
          availabilityRegistery.addPeriod(addingPeriod);
          expect(availabilityRegistery.availabilities).toHaveLength(
            existingAvailabilities.length - 1,
          );
          expect(availabilityRegistery.availabilities).toContainEqual(
            Availability.fromPeriod({
              start: existingAvailabilities[0].start,
              end: existingAvailabilities[1].end,
            }),
          );
        });
      });
      describe('when adding availability period from 2023-05-12 22:00 to 2023-05-15 01:00', () => {
        it('should merge all shift availabilities to one unique', () => {
          const addingPeriod = {
            start: new Date('2023-05-12 22:00+02:00'),
            end: new Date('2023-05-15 01:00+02:00'),
          };
          availabilityRegistery.addPeriod(addingPeriod);
          expect(availabilityRegistery.availabilities).toHaveLength(1);
          expect(availabilityRegistery.availabilities).toContainEqual(
            Availability.fromPeriod({
              start: existingAvailabilities[0].start,
              end: existingAvailabilities[3].end,
            }),
          );
        });
      });
    });
  });
});
