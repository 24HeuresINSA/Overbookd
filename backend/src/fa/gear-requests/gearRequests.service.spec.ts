import { InMemoryGearRepository } from '../../catalog/repositories/in-memory';
import { Gear } from '../../catalog/interfaces';
import {
  GearRequest,
  GearRequestsService,
  GearSeekerType,
  PENDING,
} from './gearRequests.service';
import { InMemoryGearRequestRepository } from './repositories/gearRequest.repository.inmemory';

const CHATEAU_GONFLABLE = { id: 1, name: 'Chateau Gonflable' };
const KRAVMAGA = { id: 2, name: 'Kravmaga' };

const TABLE: Gear = { id: 1, name: 'Table', slug: 'table' };
const CHAISE: Gear = { id: 2, name: 'Chaise', slug: 'chaise' };
const GEARS = [TABLE, CHAISE];

const GR_5_TABLE_CHATEAU_GONFLABLE: GearRequest = {
  seeker: { type: GearSeekerType.Animation, id: CHATEAU_GONFLABLE.id },
  quantity: 5,
  status: PENDING,
  gear: TABLE,
  rentalPeriod: {
    start: new Date('2022-05-23T09:15:00'),
    end: new Date('2022-05-23T19:15:00'),
  },
};
const GR_10_CHAISE_CHATEAU_GONFLABLE: GearRequest = {
  seeker: { type: GearSeekerType.Animation, id: CHATEAU_GONFLABLE.id },
  quantity: 10,
  status: PENDING,
  gear: CHAISE,
  rentalPeriod: {
    start: new Date('2022-05-23T09:15:00'),
    end: new Date('2022-05-23T19:15:00'),
  },
};

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
        afterAll(() => {
          gearRequestRepository.gearRequests = [];
        });
        it(`should set the gear request to ${excepectedStatus}`, () => {
          expect(gearRequest.status).toBe(excepectedStatus);
        });
        it(`should set the gear request quantity to ${quantity}`, () => {
          expect(gearRequest.quantity).toBe(quantity);
        });
        it(`should link the gear request ${gear.name} gear`, () => {
          expect(gearRequest.gear).toEqual(gear);
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
            gear,
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
  describe('List gear requests', () => {
    afterAll(() => {
      gearRequestRepository.gearRequests = [];
    });
    beforeAll(() => {
      gearRequestRepository.gearRequests = [
        GR_10_CHAISE_CHATEAU_GONFLABLE,
        GR_5_TABLE_CHATEAU_GONFLABLE,
      ];
    });
    describe.each`
      fa                   | expectedRequests
      ${CHATEAU_GONFLABLE} | ${[GR_10_CHAISE_CHATEAU_GONFLABLE, GR_5_TABLE_CHATEAU_GONFLABLE]}
      ${KRAVMAGA}          | ${[]}
    `(
      'When looking for all gear requests for $fa.name',
      ({ fa, expectedRequests }) => {
        it(`should find ${expectedRequests.length} requests`, async () => {
          const gearRequests = await gearRequestService.getAnimationRequests(
            fa.id,
          );
          expect(gearRequests).toHaveLength(expectedRequests.length);
          expect(gearRequests).toMatchObject(expectedRequests);
        });
      },
    );
  });
});
