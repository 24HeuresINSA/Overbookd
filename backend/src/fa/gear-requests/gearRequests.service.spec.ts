import { InMemoryGearRepository } from '../../catalog/repositories/in-memory';
import { Gear } from '../../catalog/interfaces';
import {
  GearRequest,
  GearRequestsService,
  GearSeekerType,
  PENDING,
} from './gearRequests.service';
import { InMemoryGearRequestRepository } from './repositories/gearRequest.repository.inmemory';
import { Status } from '../dto/update-fa.dto';
import { InMemoryAnimationRepository } from './repositories/animation.repository.inmemory';

const CHATEAU_GONFLABLE = {
  id: 1,
  name: 'Chateau Gonflable',
  status: Status.DRAFT,
};
const KRAVMAGA = { id: 2, name: 'Kravmaga', status: Status.DRAFT };
const BAR_DECOUVERTE = {
  id: 3,
  name: 'Bar Decouverte',
  status: Status.VALIDATED,
};

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
  const animationRepository = new InMemoryAnimationRepository([
    CHATEAU_GONFLABLE,
    KRAVMAGA,
    BAR_DECOUVERTE,
  ]);
  gearRepository.gears = GEARS;
  const gearRequestService = new GearRequestsService(
    gearRequestRepository,
    gearRepository,
    animationRepository,
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
    describe('When asking gear from a validated animation', () => {
      it('should inform user animation is already validated', async () => {
        await expect(
          async () =>
            await gearRequestService.addAnimationRequest({
              seekerId: BAR_DECOUVERTE.id,
              quantity: 10,
              gearId: CHAISE.id,
              start: new Date(),
              end: new Date(),
            }),
        ).rejects.toThrow(
          `Animation #${BAR_DECOUVERTE.id} already validated, you can't add gear request`,
        );
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
  describe('Udpate gear request', () => {
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
      quantity     | start                              | end                                | gearRequest
      ${16}        | ${undefined}                       | ${undefined}                       | ${GR_10_CHAISE_CHATEAU_GONFLABLE}
      ${undefined} | ${new Date('2022-05-22T20:15:00')} | ${undefined}                       | ${GR_10_CHAISE_CHATEAU_GONFLABLE}
      ${undefined} | ${undefined}                       | ${new Date('2022-05-24T09:15:00')} | ${GR_10_CHAISE_CHATEAU_GONFLABLE}
      ${2}         | ${new Date('2022-05-23T11:30:00')} | ${new Date('2022-05-23T21:30:00')} | ${GR_5_TABLE_CHATEAU_GONFLABLE}
    `(
      `When changing $gearRequest.seeker.type #$gearRequest.seeker.id request for $gearRequest.gear.name
      with $quantity as quantity, $start as rental start date and $end as rental end date`,
      ({ quantity, start, end, gearRequest }) => {
        let updatedGearRequest: GearRequest;

        beforeAll(async () => {
          updatedGearRequest = await gearRequestService.updateAnimationRequest(
            gearRequest.seeker.id,
            gearRequest.gear.id,
            { quantity, start, end },
          );
        });

        afterAll(() => {
          gearRequestRepository.gearRequests = [
            GR_10_CHAISE_CHATEAU_GONFLABLE,
            GR_5_TABLE_CHATEAU_GONFLABLE,
          ];
        });

        if (quantity) {
          it(`should set quantity to ${quantity}`, () => {
            expect(updatedGearRequest.quantity).toBe(quantity);
          });
        } else {
          it('should not impact quantity', () => {
            expect(updatedGearRequest.quantity).toBe(gearRequest.quantity);
          });
        }

        if (start) {
          it(`should set rental start date to ${start}`, () => {
            expect(updatedGearRequest.rentalPeriod.start).toBe(start);
          });
        } else {
          it('should not impact rental start date', () => {
            expect(updatedGearRequest.rentalPeriod.start).toBe(
              gearRequest.rentalPeriod.start,
            );
          });
        }

        if (end) {
          it(`should set rental end date to ${end}`, () => {
            expect(updatedGearRequest.rentalPeriod.end).toBe(end);
          });
        } else {
          it('should not impact rental end date', () => {
            expect(updatedGearRequest.rentalPeriod.end).toBe(
              gearRequest.rentalPeriod.end,
            );
          });
        }

        it('should not impact status', () => {
          expect(updatedGearRequest.status).toBe(PENDING);
        });
      },
    );
  });
});
