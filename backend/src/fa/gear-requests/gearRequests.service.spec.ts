import { InMemoryGearRepository } from '../../catalog/repositories/in-memory';
import { Gear } from '../../catalog/interfaces';
import {
  GearRequestsService,
  GearSeekerType,
  PENDING,
} from './gearRequests.service';
import { InMemoryGearRequestRepository } from './repositories/gearRequest.repository.inmemory';

const CHATEAU_GONFLABLE = { id: 1, name: 'Chateau Gonflable' };

const TABLE: Gear = { id: 1, name: 'Table', slug: 'table' };
const CHAISE: Gear = { id: 2, name: 'Chaise', slug: 'chaise' };
const GEARS = [TABLE, CHAISE];

describe('Gear requests', () => {
  const gearRequestRepository = new InMemoryGearRequestRepository([]);
  const gearRepository = new InMemoryGearRepository();
  gearRepository.gears = GEARS;
  const gearRequestService = new GearRequestsService(
    gearRequestRepository,
    gearRepository,
  );
  describe('Create gear requests', () => {
    describe.each`
      fa                   | gear      | quantity | startDate                          | endDate                            | excepectedStatus
      ${CHATEAU_GONFLABLE} | ${TABLE}  | ${10}    | ${new Date('2022-05-23T09:15:00')} | ${new Date('2022-05-23T19:15:00')} | ${PENDING}
      ${CHATEAU_GONFLABLE} | ${CHAISE} | ${5}     | ${new Date('2022-05-23T09:15:00')} | ${new Date('2022-05-23T19:15:00')} | ${PENDING}
    `(
      'When animation $fa.name ask for $quantity $gear.name from $startDate to $endDate',
      ({ fa, gear, quantity, startDate, endDate, excepectedStatus }) => {
        let gearRequest: any;
        beforeAll(
          async () =>
            (gearRequest = await gearRequestService.addAnimationRequest({
              seekerId: fa.id,
              quantity,
              gearId: gear.id,
              start: startDate,
              end: endDate,
            })),
        );
        it(`should set the gear request to ${excepectedStatus}`, () => {
          expect(gearRequest.status).toBe(excepectedStatus);
        });
        it(`should set the gear request quantity to ${quantity}`, () => {
          expect(gearRequest.quantity).toBe(quantity);
        });
        it(`should set the gear request gearId to ${gear.name}'s one`, () => {
          expect(gearRequest.gearId).toBe(gear.id);
        });
        it('should set the rental period', () => {
          expect(gearRequest.rentalPeriod).toEqual({
            start: startDate,
            end: endDate,
          });
        });
        it(`should link the request to ${fa.name} as gear seeker`, () => {
          expect(gearRequest.seeker).toEqual({
            type: GearSeekerType.Animation,
            id: CHATEAU_GONFLABLE.id,
          });
        });
        it('should be accessible after', async () => {
          const seeker = {
            type: GearSeekerType.Animation,
            id: fa.id,
          };
          const searchedGearRequest = await gearRequestService.findGearRequest({
            seeker,
            gearId: gear.id,
          });
          expect(searchedGearRequest).toMatchObject({
            seeker,
            status: PENDING,
            quantity,
            gearId: gear.id,
            rentalPeriod: { start: startDate, end: endDate },
          });
        });
      },
    );
    describe('When asking for an unknown gear', () => {
      it("should inform user gear doesn't exist", async () => {
        const inexistantGear = 1000;
        await expect(
          async () =>
            await gearRequestService.addAnimationRequest({
              seekerId: CHATEAU_GONFLABLE.id,
              quantity: 10,
              gearId: inexistantGear,
              start: new Date(),
              end: new Date(),
            }),
        ).rejects.toThrow(`Gear #${inexistantGear} doesn\'t exist`);
      });
    });
  });
});
