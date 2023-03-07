import { Gear } from '../catalog/interfaces';
import { InMemoryGearRepository } from '../catalog/repositories/in-memory';
import { Status } from '../fa/dto/update-fa.dto';
import {
  APPROVED,
  GearRequest,
  GearRequestsService,
  GearSeekerType,
  PENDING,
  Task,
  taskStatus,
} from './gearRequests.service';
import { InMemoryAnimationRepository } from './repositories/animation.repository.inmemory';
import { InMemoryGearRequestRepository } from './repositories/gearRequest.repository.inmemory';
import { InMemoryPeriodRepository } from './repositories/period.repository.inmemory';
import { InMemoryTaskRepository } from './repositories/task.repository.inmemory';

const MAGASIN = 'Magasin';

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
const INSTALLER_CHATEAU_GONFLABLE: Task = {
  id: 1,
  name: 'Installer le Chateau Gonflable',
  status: taskStatus.DRAFT,
};
const GARDIENNER_CHATEAU_GONFLABLE: Task = {
  id: 2,
  name: 'Gardienner le Chateau Gonflable',
  status: taskStatus.VALIDATED,
};
const DEMONTER_CHATEAU_GONFLABLE: Task = {
  id: 3,
  name: 'Demonter le Chateau Gonflable',
  status: taskStatus.READY,
};

const TABLE: Gear = {
  id: 1,
  name: 'Table',
  slug: 'table',
  isPonctualUsage: false,
  isConsumable: false,
};
const CHAISE: Gear = {
  id: 2,
  name: 'Chaise',
  slug: 'chaise',
  isPonctualUsage: false,
  isConsumable: false,
};
const MARTEAU: Gear = {
  id: 3,
  name: 'Marteau',
  slug: 'marteau',
  isPonctualUsage: true,
  isConsumable: false,
};
const GANT: Gear = {
  id: 4,
  name: 'Gant',
  slug: 'gant',
  isPonctualUsage: true,
  isConsumable: false,
};
const SCOTCH: Gear = {
  id: 5,
  name: 'Scotch',
  slug: 'scotch',
  isPonctualUsage: true,
  isConsumable: true,
};
const SAC_POUBELLE: Gear = {
  id: 6,
  name: 'Sac Poubelle',
  slug: 'sac-poubelle',
  isPonctualUsage: false,
  isConsumable: true,
};
const GEARS = [TABLE, CHAISE, MARTEAU, GANT, SCOTCH, SAC_POUBELLE];

const GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE: GearRequest = {
  seeker: {
    type: GearSeekerType.Animation,
    id: CHATEAU_GONFLABLE.id,
    name: CHATEAU_GONFLABLE.name,
  },
  quantity: 5,
  status: PENDING,
  gear: TABLE,
  rentalPeriod: MAY_24_1,
};
const GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE: GearRequest = {
  seeker: {
    type: GearSeekerType.Animation,
    id: CHATEAU_GONFLABLE.id,
    name: CHATEAU_GONFLABLE.name,
  },
  quantity: 10,
  status: PENDING,
  gear: CHAISE,
  rentalPeriod: MAY_23,
};

const GR_10_CHAISE_MAY_24_CHATEAU_GONFLABLE: GearRequest = {
  seeker: {
    type: GearSeekerType.Animation,
    id: CHATEAU_GONFLABLE.id,
    name: CHATEAU_GONFLABLE.name,
  },
  quantity: 10,
  status: PENDING,
  gear: CHAISE,
  rentalPeriod: MAY_24_1,
};

const GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE: GearRequest = {
  seeker: {
    type: GearSeekerType.Animation,
    id: CHATEAU_GONFLABLE.id,
    name: CHATEAU_GONFLABLE.name,
  },
  quantity: 2,
  status: APPROVED,
  gear: CHAISE,
  rentalPeriod: MAY_24_2,
  drive: MAGASIN,
};

const GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE: GearRequest = {
  seeker: {
    type: GearSeekerType.Task,
    id: INSTALLER_CHATEAU_GONFLABLE.id,
    name: INSTALLER_CHATEAU_GONFLABLE.name,
  },
  quantity: 10,
  status: PENDING,
  gear: GANT,
  rentalPeriod: MAY_24_1,
};

const GEAR_REQUESTS = [
  GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE,
  GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE,
  GR_10_CHAISE_MAY_24_CHATEAU_GONFLABLE,
  GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE,
  GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE,
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
  const taskRepository = new InMemoryTaskRepository([
    INSTALLER_CHATEAU_GONFLABLE,
    GARDIENNER_CHATEAU_GONFLABLE,
    DEMONTER_CHATEAU_GONFLABLE,
  ]);
  gearRepository.gears = GEARS;
  const gearRequestService = new GearRequestsService(
    gearRequestRepository,
    gearRepository,
    animationRepository,
    periodRepository,
    taskRepository,
  );
  describe('Create gear requests', () => {
    describe('For Animations', () => {
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
                id: fa.id,
                name: fa.name,
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
                seeker: { ...seeker, name: fa.name },
                status: PENDING,
                quantity,
                gear,
                rentalPeriod: { start: startDate, end: endDate },
              });
            });
          },
        );
      });

      describe('When asking a gear for an exiting period', () => {
        it('should link gear request to the existing period', async () => {
          const createdGearRequest =
            await gearRequestService.addAnimationRequest({
              seekerId: KRAVMAGA.id,
              quantity: 3,
              periodId: MAY_23.id,
              gearId: CHAISE.id,
            });
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
    describe('For Tasks', () => {
      describe('When asking for the first gear request for a period', () => {
        describe.each`
          ft                             | gear       | quantity | startDate                          | endDate                            | excepectedStatus
          ${INSTALLER_CHATEAU_GONFLABLE} | ${GANT}    | ${10}    | ${new Date('2022-05-23T09:15:00')} | ${new Date('2022-05-23T19:15:00')} | ${PENDING}
          ${INSTALLER_CHATEAU_GONFLABLE} | ${MARTEAU} | ${5}     | ${new Date('2022-05-23T09:15:00')} | ${new Date('2022-05-23T19:15:00')} | ${PENDING}
        `(
          'When task $ft.name ask for $quantity $gear.name from $startDate to $endDate',
          ({ ft, gear, quantity, startDate, endDate, excepectedStatus }) => {
            let gearRequest: any;
            beforeAll(
              async () =>
                (gearRequest = await gearRequestService.addTaskRequest({
                  seekerId: ft.id,
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
            it(`should link the request to ${ft.name} as gear seeker`, () => {
              expect(gearRequest.seeker).toEqual({
                type: GearSeekerType.Task,
                id: ft.id,
                name: ft.name,
              });
            });
            it('should be accessible after', async () => {
              const seeker = {
                type: GearSeekerType.Task,
                id: ft.id,
              };
              const searchedGearRequest =
                await gearRequestService.findGearRequest({
                  seeker,
                  gearId: gear.id,
                  rentalPeriodId: gearRequest.rentalPeriod.id,
                });
              expect(searchedGearRequest).toMatchObject({
                seeker: { ...seeker, name: ft.name },
                status: PENDING,
                quantity,
                gear,
                rentalPeriod: { start: startDate, end: endDate },
              });
            });
          },
        );
      });

      describe('When asking a gear for an exiting period', () => {
        it('should link gear request to the existing period', async () => {
          const createdGearRequest = await gearRequestService.addTaskRequest({
            seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
            quantity: 5,
            periodId: MAY_23.id,
            gearId: MARTEAU.id,
          });
          expect(createdGearRequest.rentalPeriod).toBe(MAY_23);
        });
      });

      describe('When asking for an unknown gear', () => {
        it("should inform user gear doesn't exist", async () => {
          const inexistantGear = 1000;
          await expect(
            async () =>
              await gearRequestService.addTaskRequest({
                seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
                quantity: 10,
                gearId: inexistantGear,
                start: new Date(),
                end: new Date(),
              }),
          ).rejects.toThrow(`Gear #${inexistantGear} doesn\'t exist`);
        });
      });

      describe('When asking gear from a validated task', () => {
        it('should inform user task is already validated', async () => {
          await expect(
            async () =>
              await gearRequestService.addTaskRequest({
                seekerId: GARDIENNER_CHATEAU_GONFLABLE.id,
                quantity: 10,
                gearId: MARTEAU.id,
                start: new Date(),
                end: new Date(),
              }),
          ).rejects.toThrow(
            `Task #${GARDIENNER_CHATEAU_GONFLABLE.id} already validated, you can't add gear request`,
          );
        });
      });

      describe('When asking gear from a ready task', () => {
        it('should inform user task is already ready', async () => {
          await expect(
            async () =>
              await gearRequestService.addTaskRequest({
                seekerId: DEMONTER_CHATEAU_GONFLABLE.id,
                quantity: 10,
                gearId: MARTEAU.id,
                start: new Date(),
                end: new Date(),
              }),
          ).rejects.toThrow(
            `Task #${DEMONTER_CHATEAU_GONFLABLE.id} already ready, you can't add gear request`,
          );
        });
      });
    });
    describe('For Consumable gear', () => {
      describe('When asking for "scotch" gear for a task', () => {
        describe('When the request period doesnt exist', () => {
          beforeEach(() => {
            gearRequestRepository.gearRequests = [];
          });
          it('should create a gear request', async () => {
            const start = new Date('2022-05-23T09:15:00');
            const end = new Date('2022-05-24T19:15:00');
            const createdGearRequest = await gearRequestService.addTaskRequest({
              seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
              quantity: 10,
              gearId: SCOTCH.id,
              start,
              end,
            });
            expect(createdGearRequest).toMatchObject({
              seeker: {
                id: INSTALLER_CHATEAU_GONFLABLE.id,
                type: GearSeekerType.Task,
              },
              quantity: 10,
              gear: SCOTCH,
              status: PENDING,
              rentalPeriod: { start, end },
            });
          });
          describe('When scotch is already requested for another period', () => {
            it('should merge to a unique gear request', async () => {
              const previousGearRequestStart = new Date('2022-05-23T09:15:00');
              const previousGearRequestEnd = new Date('2022-05-23T19:15:00');
              await gearRequestService.addTaskRequest({
                seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
                quantity: 10,
                gearId: SCOTCH.id,
                start: previousGearRequestStart,
                end: previousGearRequestEnd,
              });
              const newGearRequestStart = new Date('2022-05-24T09:15:00');
              const newGearRequestEnd = new Date('2022-05-24T19:15:00');
              const createdGearRequest =
                await gearRequestService.addTaskRequest({
                  seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
                  quantity: 10,
                  gearId: SCOTCH.id,
                  start: newGearRequestStart,
                  end: newGearRequestEnd,
                });
              expect(createdGearRequest.rentalPeriod).toMatchObject({
                start: previousGearRequestStart,
                end: newGearRequestEnd,
              });
            });
          });
        });
        describe('When the request period already exists', () => {
          beforeAll(async () => {
            gearRequestRepository.gearRequests = [];
            await gearRequestService.addTaskRequest({
              seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_23.id,
              gearId: MARTEAU.id,
            });
          });
          it('should link gear request to the existing period', async () => {
            const createdGearRequest = await gearRequestService.addTaskRequest({
              seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_23.id,
              gearId: SCOTCH.id,
            });
            expect(createdGearRequest.rentalPeriod).toBe(MAY_23);
          });
        });
        describe('When there is several request period existing', () => {
          beforeAll(async () => {
            gearRequestRepository.gearRequests = [];
            await gearRequestService.addTaskRequest({
              seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_23.id,
              gearId: MARTEAU.id,
            });
            await gearRequestService.addTaskRequest({
              seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_24_1.id,
              gearId: MARTEAU.id,
            });
          });
          it('should create dedicated request period for "scotch" gear requests', async () => {
            await gearRequestService.addTaskRequest({
              seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_23.id,
              gearId: SCOTCH.id,
            });
            const secondGearRequest = await gearRequestService.addTaskRequest({
              seekerId: INSTALLER_CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_24_1.id,
              gearId: SCOTCH.id,
            });
            expect(secondGearRequest.rentalPeriod).toMatchObject({
              start: MAY_23.start,
              end: MAY_24_1.end,
            });
          });
        });
      });
      describe('When asking for "Sac poubelle" gear for an activity', () => {
        describe('When the request period doesnt exist', () => {
          beforeEach(() => {
            gearRequestRepository.gearRequests = [];
          });
          it('should create a gear request', async () => {
            const start = new Date('2022-05-23T09:15:00');
            const end = new Date('2022-05-24T19:15:00');
            const createdGearRequest =
              await gearRequestService.addAnimationRequest({
                seekerId: CHATEAU_GONFLABLE.id,
                quantity: 10,
                gearId: SAC_POUBELLE.id,
                start,
                end,
              });
            expect(createdGearRequest).toMatchObject({
              seeker: {
                id: CHATEAU_GONFLABLE.id,
                type: GearSeekerType.Animation,
              },
              quantity: 10,
              gear: SAC_POUBELLE,
              status: PENDING,
              rentalPeriod: { start, end },
            });
          });
          describe('When sac poubelle is already requested for another period', () => {
            it('should merge to a unique gear request', async () => {
              const previousGearRequestStart = new Date('2022-05-23T09:15:00');
              const previousGearRequestEnd = new Date('2022-05-23T19:15:00');
              await gearRequestService.addAnimationRequest({
                seekerId: CHATEAU_GONFLABLE.id,
                quantity: 10,
                gearId: SAC_POUBELLE.id,
                start: previousGearRequestStart,
                end: previousGearRequestEnd,
              });
              const newGearRequestStart = new Date('2022-05-24T09:15:00');
              const newGearRequestEnd = new Date('2022-05-24T19:15:00');
              const createdGearRequest =
                await gearRequestService.addAnimationRequest({
                  seekerId: CHATEAU_GONFLABLE.id,
                  quantity: 10,
                  gearId: SAC_POUBELLE.id,
                  start: newGearRequestStart,
                  end: newGearRequestEnd,
                });
              expect(createdGearRequest.rentalPeriod).toMatchObject({
                start: previousGearRequestStart,
                end: newGearRequestEnd,
              });
            });
          });
        });
        describe('When the request period already exists', () => {
          beforeAll(async () => {
            gearRequestRepository.gearRequests = [];
            await gearRequestService.addAnimationRequest({
              seekerId: CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_23.id,
              gearId: TABLE.id,
            });
          });
          it('should link gear request to the existing period', async () => {
            const createdGearRequest =
              await gearRequestService.addAnimationRequest({
                seekerId: CHATEAU_GONFLABLE.id,
                quantity: 5,
                periodId: MAY_23.id,
                gearId: SAC_POUBELLE.id,
              });
            expect(createdGearRequest.rentalPeriod).toBe(MAY_23);
          });
        });
        describe('When there is several request period existing', () => {
          beforeAll(async () => {
            gearRequestRepository.gearRequests = [];
            await gearRequestService.addAnimationRequest({
              seekerId: CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_23.id,
              gearId: TABLE.id,
            });
            await gearRequestService.addAnimationRequest({
              seekerId: CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_24_1.id,
              gearId: TABLE.id,
            });
          });
          it('should create dedicated request period for "Sac Poubelle" gear requests', async () => {
            await gearRequestService.addAnimationRequest({
              seekerId: CHATEAU_GONFLABLE.id,
              quantity: 5,
              periodId: MAY_23.id,
              gearId: SAC_POUBELLE.id,
            });
            const secondGearRequest =
              await gearRequestService.addAnimationRequest({
                seekerId: CHATEAU_GONFLABLE.id,
                quantity: 5,
                periodId: MAY_24_1.id,
                gearId: SAC_POUBELLE.id,
              });
            expect(secondGearRequest.rentalPeriod).toMatchObject({
              start: MAY_23.start,
              end: MAY_24_1.end,
            });
          });
        });
      });
    });
  });
  describe('Update gear request', () => {
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
      ${16}        | ${undefined}                       | ${undefined}                       | ${GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE}
      ${undefined} | ${new Date('2022-05-22T20:15:00')} | ${undefined}                       | ${GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE}
      ${undefined} | ${undefined}                       | ${new Date('2022-05-24T09:15:00')} | ${GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE}
    `(
      `When changing $gearRequest.seeker.type #$gearRequest.seeker.id request for $gearRequest.gear.name
      with $quantity as quantity, $start as rental start date and $end as rental end date`,
      ({ quantity, start, end, gearRequest }) => {
        let updatedGearRequest: GearRequest;

        beforeAll(async () => {
          switch (gearRequest.seeker.type) {
            case GearSeekerType.Animation:
              updatedGearRequest =
                await gearRequestService.updateAnimationRequest(
                  gearRequest.seeker.id,
                  gearRequest.gear.id,
                  gearRequest.rentalPeriod.id,
                  { quantity, start, end },
                );
              break;
            case GearSeekerType.Task:
              updatedGearRequest = await gearRequestService.updateTaskRequest(
                gearRequest.seeker.id,
                gearRequest.gear.id,
                gearRequest.rentalPeriod.id,
                { quantity, start, end },
              );
              break;
            default:
              updatedGearRequest =
                await gearRequestService.updateAnimationRequest(
                  gearRequest.seeker.id,
                  gearRequest.gear.id,
                  gearRequest.rentalPeriod.id,
                  { quantity, start, end },
                );
          }
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

        it('should set status to PENDING', () => {
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
    describe('For animation', () => {
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

    describe('For Task', () => {
      describe('When deleting an existing gear request', () => {
        it('should remove gear request from persistance', async () => {
          await gearRequestService.removeTaskRequest(
            GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.seeker.id,
            GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.gear.id,
            GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.rentalPeriod.id,
          );
          await expect(
            async () =>
              await gearRequestService.findGearRequest({
                seeker: GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.seeker,
                gearId: GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.gear.id,
                rentalPeriodId:
                  GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.rentalPeriod.id,
              }),
          ).rejects.toThrow(
            `Request for gear #${GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.gear.id} from ${GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.seeker.type} #${GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE.seeker.id} not found`,
          );
        });
      });
      describe('When deleting an inexisting gear request', () => {
        it('should go smoothly', async () => {
          await gearRequestService.removeAnimationRequest(45, 67, 4);
        });
      });
    });
  });
  describe('List gear requests', () => {
    const gearRequestsCopy = [...GEAR_REQUESTS];
    afterAll(() => {
      gearRequestRepository.gearRequests = [];
    });
    beforeAll(() => {
      gearRequestRepository.gearRequests = gearRequestsCopy;
    });
    describe('For Animations', () => {
      describe.each`
        fa                   | expectedRequests
        ${CHATEAU_GONFLABLE} | ${[GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE, GR_5_TABLE_MAY_24_CHATEAU_GONFLABLE, GR_10_CHAISE_MAY_24_CHATEAU_GONFLABLE, GR_2_CHAISE_MAY_24_NIGHT_CHATEAU_GONFLABLE]}
        ${KRAVMAGA}          | ${[]}
      `(
        'When looking for all gear requests for FA $fa.name',
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
      describe('When looking for all gear requests', () => {
        it(`should retrieve all ${gearRequestsCopy.length} gear requests`, async () => {
          const gearRequests = await gearRequestService.getAllRequests();
          expect(gearRequests).toHaveLength(gearRequestsCopy.length);
        });
      });
    });
    describe('For Tasks', () => {
      describe.each`
        ft                              | expectedRequests
        ${INSTALLER_CHATEAU_GONFLABLE}  | ${[GR_10_GANT_MAY_24_INSTALLER_CHATEAU_GONFLABLE]}
        ${GARDIENNER_CHATEAU_GONFLABLE} | ${[]}
      `(
        'When looking for all gear request for Task $ft.name',
        ({ ft, expectedRequests }) => {
          it(`should find ${expectedRequests.length} requests`, async () => {
            const gearRequests = await gearRequestService.getTaskRequests(
              ft.id,
            );
            expect(gearRequests).toHaveLength(expectedRequests.length);
            expect(gearRequests).toMatchObject(expectedRequests);
          });
        },
      );
    });
  });
  describe('Approve gear requests', () => {
    beforeAll(() => {
      gearRequestRepository.gearRequests = [...GEAR_REQUESTS];
    });
    describe('when logistical team approve a gear request', () => {
      const {
        gear: { id: gearId },
        seeker,
        rentalPeriod: { id: rentalPeriodId },
      } = GR_10_CHAISE_MAY_23_CHATEAU_GONFLABLE;
      const gearRequestId = {
        gearId,
        seeker,
        rentalPeriodId,
      };
      it('should update gear requests status to approved', async () => {
        const approvedGearReques = await gearRequestService.approveGearRequest(
          gearRequestId,
          MAGASIN,
        );
        expect(approvedGearReques.status).toBe(APPROVED);
        const searchedGearRequest = await gearRequestService.findGearRequest({
          gearId,
          seeker,
          rentalPeriodId,
        });
        expect(searchedGearRequest.status).toBe(APPROVED);
      });
      it('should update gear requests with a drive', async () => {
        const approvedGearRequest = await gearRequestService.approveGearRequest(
          gearRequestId,
          MAGASIN,
        );
        expect(approvedGearRequest.drive).toBe(MAGASIN);
        const searchedGearRequest = await gearRequestService.findGearRequest({
          gearId,
          seeker,
          rentalPeriodId,
        });
        expect(searchedGearRequest.drive).toBe(MAGASIN);
      });
    });
  });
});
