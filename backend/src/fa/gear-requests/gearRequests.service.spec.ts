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
import { InMemoryPeriodRepository } from './repositories/period.repository.inmemory';

const MAY_24_1 = {
  id: 1,
  start: new Date('2022-05-24T09:15:00'),
  end: new Date('2022-05-24T19:15:00'),
};

const MAY_24_2 = {
  id: 3,
  start: new Date('2022-05-24T20:30:00'),
  end: new Date('2022-05-25T03:00:00'),
};

const MAY_23 = {
  id: 2,
  start: new Date('2022-05-23T09:15:00'),
  end: new Date('2022-05-23T19:15:00'),
};

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

const GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE: GearRequest = {
  seeker: { type: GearSeekerType.Animation, id: CHATEAU_GONFLABLE.id },
  quantity: 5,
  status: PENDING,
  gear: TABLE,
  rentalPeriod: MAY_24_1,
};
const GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE: GearRequest = {
  seeker: { type: GearSeekerType.Animation, id: CHATEAU_GONFLABLE.id },
  quantity: 10,
  status: PENDING,
  gear: CHAISE,
  rentalPeriod: MAY_23,
};

const GR_10_CHAISE_MAY_24_CHATEAU_GONFLABLE: GearRequest = {
  seeker: { type: GearSeekerType.Animation, id: CHATEAU_GONFLABLE.id },
  quantity: 10,
  status: PENDING,
  gear: CHAISE,
  rentalPeriod: MAY_24_1,
};

const GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE: GearRequest = {
  seeker: { type: GearSeekerType.Animation, id: CHATEAU_GONFLABLE.id },
  quantity: 2,
  status: PENDING,
  gear: CHAISE,
  rentalPeriod: MAY_24_2,
};

const GEAR_REQUESTS = [
  GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE,
  GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE,
  GR_10_CHAISE_MAY_24_CHATEAU_GONFLABLE,
  GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE,
];
describe('Gear requests', () => {
  const periodRepository = new InMemoryPeriodRepository([
    MAY_23,
    MAY_24_1,
    MAY_24_2,
  ]);
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
    periodRepository,
  );
  describe('Create gear requests', () => {
    describe('When asking for the first gear request for a period', () => {
      describe.each`
        fa                   | gear      | quantity | startDate                          | endDate                            | excepectedStatus
        ${CHATEAU_GONFLABLE} | ${TABLE}  | ${10}    | ${new Date('2022-05-23T09:15:00')} | ${new Date('2022-05-23T19:15:00')} | ${PENDING}
        ${CHATEAU_GONFLABLE} | ${CHAISE} | ${5}     | ${new Date('2022-05-24T09:15:00')} | ${new Date('2022-05-24T19:15:00')} | ${PENDING}
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
            expect(gearRequest.rentalPeriod).toMatchObject({
              id: expect.any(Number),
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
            const searchedGearRequest =
              await gearRequestService.findGearRequest({
                seeker,
                gearId: gear.id,
                rentalPeriodId: gearRequest.rentalPeriod.id,
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
    });

    describe('When asing a gear for an exiting period', () => {
      it('should link gear request to the existing period', async () => {
        const createdGearRequest = await gearRequestService.addAnimationRequest(
          {
            seekerId: KRAVMAGA.id,
            quantity: 3,
            periodId: MAY_23.id,
            gearId: CHAISE.id,
          },
        );
        expect(createdGearRequest.rentalPeriod).toBe(MAY_23);
      });
    });

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
      gearRequestRepository.gearRequests = [...GEAR_REQUESTS];
    });
    describe.each`
      fa                   | expectedRequests
      ${CHATEAU_GONFLABLE} | ${[GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE, GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE, GR_10_CHAISE_MAY_24_CHATEAU_GONFLABLE, GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE]}
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
      gearRequestRepository.gearRequests = [...GEAR_REQUESTS];
    });
    describe.each`
      quantity     | start                              | end                                | gearRequest
      ${16}        | ${undefined}                       | ${undefined}                       | ${GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE}
      ${undefined} | ${new Date('2022-05-22T20:15:00')} | ${undefined}                       | ${GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE}
      ${undefined} | ${undefined}                       | ${new Date('2022-05-24T09:15:00')} | ${GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE}
      ${2}         | ${new Date('2022-05-24T11:30:00')} | ${new Date('2022-05-24T21:30:00')} | ${GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE}
      ${undefined} | ${new Date('2022-05-24T11:30:00')} | ${new Date('2022-05-24T21:30:00')} | ${GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE}
    `(
      `When changing $gearRequest.seeker.type #$gearRequest.seeker.id request for $gearRequest.gear.name
      with $quantity as quantity, $start as rental start date and $end as rental end date`,
      ({ quantity, start, end, gearRequest }) => {
        let updatedGearRequest: GearRequest;

        beforeAll(async () => {
          updatedGearRequest = await gearRequestService.updateAnimationRequest(
            gearRequest.seeker.id,
            gearRequest.gear.id,
            gearRequest.rentalPeriod.id,
            { quantity, start, end },
          );
        });

        afterAll(() => {
          gearRequestRepository.gearRequests = [...GEAR_REQUESTS];
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

        it('should not impact gear requests from other period', async () => {
          const otherGearRequests = GEAR_REQUESTS.filter(
            (gr) =>
              gr.seeker.id !== gearRequest.seeker.id ||
              gr.gear.id !== gearRequest.gear.id ||
              gr.rentalPeriod.id !== gearRequest.rentalPeriod.id,
          );
          const gearRequests = await gearRequestService.getAnimationRequests(
            gearRequest.seeker.id,
          );
          otherGearRequests.every((gearRequest) =>
            expect(gearRequests).toContain(gearRequest),
          );
        });

        it('should update all gear requests from the same period', async () => {
          const otherGearRequests = GEAR_REQUESTS.filter(
            (gr) => gr.rentalPeriod.id === gearRequest.rentalPeriod.id,
          );
          otherGearRequests.every((gr) =>
            expect(gr.rentalPeriod).toEqual(gearRequest.rentalPeriod),
          );
        });
      },
    );
  });
  describe('Remove gear request', () => {
    afterAll(() => {
      gearRequestRepository.gearRequests = [];
    });
    beforeAll(() => {
      gearRequestRepository.gearRequests = [...GEAR_REQUESTS];
    });
    describe('When deleting an existing gear request', () => {
      it('should remove gear request from persistance', async () => {
        await gearRequestService.removeAnimationRequest(
          GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.seeker.id,
          GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.gear.id,
          GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.rentalPeriod.id,
        );
        await expect(
          async () =>
            await gearRequestService.findGearRequest({
              seeker: GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.seeker,
              gearId: GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.gear.id,
              rentalPeriodId:
                GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.rentalPeriod.id,
            }),
        ).rejects.toThrow(
          `Request for gear #${GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.gear.id} from ${GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.seeker.type} #${GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE.seeker.id} not found`,
        );
      });
    });
    describe('When deleting an inexisting gear request', () => {
      it('should go smoothly', async () => {
        await gearRequestService.removeAnimationRequest(45, 67, 4);
      });
    });
  });
  describe('List gear requests', () => {
    afterAll(() => {
      gearRequestRepository.gearRequests = [];
    });
    beforeAll(() => {
      gearRequestRepository.gearRequests = [...GEAR_REQUESTS];
    });
    describe.each`
      fa                   | expectedRequests
      ${CHATEAU_GONFLABLE} | ${[GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE, GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE, GR_10_CHAISE_MAY_24_CHATEAU_GONFLABLE, GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE]}
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
