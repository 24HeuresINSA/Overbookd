import { Duration, EndBeforeStart } from "@overbookd/time";
import { beforeEach, describe, expect, it } from "vitest";
import { TimeWindowAlreadyExists } from "../festival-activity.error.js";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory.js";
import {
  baladeEnPoney,
  escapeGame,
  justDance,
  pcSecurite,
  qgOrga,
  approvedByAllInquiryOwners,
  approvedByAllInquiryOwnersWithoutRequest,
  approvedByBarrieres,
  approvedByBarrieresWithoutRequests,
  approvedByElec,
  approvedByElecWithoutRequests,
  approvedByMatos,
  approvedByMatosAndBarrieres,
  approvedByMatosAndBarrieresWithoutRequest,
  approvedByMatosWithoutRequests,
  approvedByElecWithNoRequestAtAll,
} from "./preparation.test-utils.js";
import { PrepareFestivalActivity } from "./prepare-festival-activity.js";
import { BARRIERES, ELEC, MATOS } from "../sections/inquiry.js";
import { barrieres } from "../../common/review.js";
import {
  MAGASIN,
  LOCAL_24H,
  PARKING_EIFFEL,
} from "../../common/inquiry-request.js";
import {
  AlreadyInitialized,
  CantRemoveLastRequest,
  CantRemoveLastTimeWindow,
  NotYetInitialized,
} from "./section-aggregates/inquiries.js";
import { elec, matos } from "../../common/review.js";
import { WithInquiries } from "../sections/inquiry.js";
import {
  AssignDriveInDraft,
  InquiryAlreadyExists,
  InquiryNotFound,
} from "../../common/inquiry-request.error.js";
import {
  cinqGuirlandeLED,
  deuxMarteaux,
  friday11hToFriday15h,
  friday12hToFriday14h,
  quatreHeras,
  quinzeVaubans,
  saturday14hToSaturday18h,
  sunday14hToSunday18h,
  troisTables,
  uneMultiprise3Prises,
} from "../festival-activity.fake.js";
import { PrepareError } from "./prepare-in-review-festival-activity.js";

const branleCanisse = {
  slug: "branle-canisse",
  name: "Branle canisse",
  owner: MATOS,
} as const;

const heras = {
  slug: "heras",
  name: "Heras",
  owner: BARRIERES,
} as const;

const chargeurUsbC = {
  slug: "chargeur-usb-c",
  name: "Chargeur USB-C",
  owner: ELEC,
} as const;

describe("Inquiry section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      pcSecurite,
      justDance,
      baladeEnPoney,
      qgOrga,
      approvedByElec,
      approvedByElecWithoutRequests,
      approvedByElecWithNoRequestAtAll,
      approvedByBarrieres,
      approvedByBarrieresWithoutRequests,
      approvedByMatos,
      approvedByMatosWithoutRequests,
      approvedByMatosAndBarrieres,
      approvedByMatosAndBarrieresWithoutRequest,
      approvedByAllInquiryOwners,
      approvedByAllInquiryOwnersWithoutRequest,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe.each`
    activityName                                     | activityId                             | timeWindow                                                                                | inquiryRequest
    ${qgOrga.general.name}                           | ${qgOrga.id}                           | ${{ start: new Date("2024-05-18T11:00+02:00"), end: new Date("2024-05-18T13:00+02:00") }} | ${{ ...branleCanisse, quantity: 4 }}
    ${pcSecurite.general.name}                       | ${pcSecurite.id}                       | ${{ start: new Date("2024-05-17T16:00+02:00"), end: new Date("2024-05-20T00:00+02:00") }} | ${{ ...branleCanisse, quantity: 10 }}
    ${approvedByElecWithNoRequestAtAll.general.name} | ${approvedByElecWithNoRequestAtAll.id} | ${{ start: new Date("2024-05-17T16:00+02:00"), end: new Date("2024-05-20T00:00+02:00") }} | ${{ ...branleCanisse, quantity: 10 }}
  `(
    "when activity $activityName doesn't have any inquiry request",
    ({ activityId, timeWindow, inquiryRequest }) => {
      it("should be able to init inquiry section with first time window and first request", async () => {
        const { inquiry } = await prepareFestivalActivity.initInquiry(
          activityId,
          { timeWindow, request: inquiryRequest },
        );
        expect(inquiry.timeWindows).toHaveLength(1);
        const requests = [
          ...inquiry.barriers,
          ...inquiry.electricity,
          ...inquiry.gears,
        ];
        expect(requests).toHaveLength(1);
      });
    },
  );

  describe("when activity doesn't have any inquiry request but is already approved", () => {
    it("should indicate that inquiry section is lock", async () => {
      expect(
        async () =>
          await prepareFestivalActivity.initInquiry(
            approvedByElecWithNoRequestAtAll.id,
            {
              timeWindow: saturday14hToSaturday18h,
              request: { ...chargeurUsbC, quantity: 3 },
            },
          ),
      ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
    });
  });

  describe.each`
    activityName               | activityId
    ${escapeGame.general.name} | ${escapeGame.id}
    ${justDance.general.name}  | ${justDance.id}
  `(
    "when $activityName already have some inquiry requests",
    ({ activityId }) => {
      it("should indicate that inquiry has already been initiate", async () => {
        const timeWindow = {
          start: new Date("2024-05-18T20:00+02:00"),
          end: new Date("2024-05-18T22:00+02:00"),
        };
        const request = { ...branleCanisse, quantity: 1 };
        const initializer = { timeWindow, request };

        expect(
          async () =>
            await prepareFestivalActivity.initInquiry(activityId, initializer),
        ).rejects.toThrow(AlreadyInitialized);
      });
    },
  );

  describe("when adherent want to add a time window", () => {
    describe.each`
      start                       | end                         | activityId       | activityName
      ${"2023-05-17T18:00+02:00"} | ${"2023-05-17T20:00+02:00"} | ${escapeGame.id} | ${escapeGame.general.name}
      ${"2023-05-17T17:00+02:00"} | ${"2023-05-17T22:00+02:00"} | ${justDance.id}  | ${justDance.general.name}
    `(
      "when adding $start - $end timewindow to $activityId",
      ({ start, end, activityId }) => {
        it("should be listed in timewindows", async () => {
          const startDate = new Date(start);
          const endDate = new Date(end);
          const startTimestamp = Duration.ms(startDate.getTime());
          const endTimestamp = Duration.ms(endDate.getTime());
          const expectedId = `${startTimestamp.inMinutes}-${endTimestamp.inMinutes}`;
          const timeWindowToAdd = { start: startDate, end: endDate };

          const { inquiry } =
            await prepareFestivalActivity.addTimeWindowInInquiry(
              activityId,
              timeWindowToAdd,
            );

          const expectedTimeWindow = { ...timeWindowToAdd, id: expectedId };
          expect(inquiry.timeWindows).toContainEqual(expectedTimeWindow);
        });
      },
    );

    describe.each`
      activityName               | activityId       | existingTimeWindow
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.timeWindows[0]}
      ${justDance.general.name}  | ${justDance.id}  | ${justDance.inquiry.timeWindows[0]}
    `(
      "when adherent want to add a time window that already exists in $activityName",
      ({ activityId, existingTimeWindow }) => {
        it("should should indicate that the time window already exists", async () => {
          await expect(
            prepareFestivalActivity.addTimeWindowInInquiry(
              activityId,
              existingTimeWindow,
            ),
          ).rejects.toThrow(TimeWindowAlreadyExists);
        });
      },
    );

    describe.each`
      activityName               | activityId
      ${escapeGame.general.name} | ${escapeGame.id}
      ${justDance.general.name}  | ${justDance.id}
    `(
      "when adherent want to add a time window with end before start in $activityName",
      ({ activityId }) => {
        it("should should indicate that end should be after start", async () => {
          const invalidTimeWindow = {
            start: new Date("2023-05-17T10:00+02:00"),
            end: new Date("2023-05-17T08:00+02:00"),
          };

          await expect(
            prepareFestivalActivity.addTimeWindowInInquiry(
              activityId,
              invalidTimeWindow,
            ),
          ).rejects.toThrow(EndBeforeStart);
        });
      },
    );

    describe.each`
      activityName               | activityId
      ${pcSecurite.general.name} | ${pcSecurite.id}
    `(
      "when trying to add a time window before initiation on $activityName",
      ({ activityId }) => {
        it("should indicate that inquiry section must be initialized before", async () => {
          const timeWindow = {
            start: new Date("2024-05-18T20:00+02:00"),
            end: new Date("2024-05-18T22:00+02:00"),
          };

          expect(
            async () =>
              await prepareFestivalActivity.addTimeWindowInInquiry(
                activityId,
                timeWindow,
              ),
          ).rejects.toThrow(NotYetInitialized);
        });
      },
    );
  });

  describe.each`
    update                  | activityName                  | activity         | toUpdate                                | expectedId
    ${friday11hToFriday15h} | ${escapeGame.general.name}    | ${escapeGame}    | ${escapeGame.inquiry.timeWindows[0]}    | ${friday11hToFriday15h.id}
    ${sunday14hToSunday18h} | ${justDance.general.name}     | ${justDance}     | ${justDance.inquiry.timeWindows[1]}     | ${sunday14hToSunday18h.id}
    ${friday11hToFriday15h} | ${baladeEnPoney.general.name} | ${baladeEnPoney} | ${baladeEnPoney.inquiry.timeWindows[0]} | ${friday11hToFriday15h.id}
  `(
    "when adherent want to update a time window in $activityName",
    ({ update, activity, toUpdate, expectedId }) => {
      it("should update the time window", async () => {
        const { inquiry } =
          await prepareFestivalActivity.updateTimeWindowInInquiry(
            activity.id,
            toUpdate.id,
            update,
          );

        const expectedTimeWindow = { ...update, id: expectedId };
        expect(inquiry.timeWindows).toContainEqual(expectedTimeWindow);
      });
      describe("when adherent want to update a time window that doesn't exist", () => {
        it("should indicate that the time window doesn't exist", async () => {
          await expect(
            prepareFestivalActivity.updateTimeWindowInInquiry(
              activity.id,
              "132-456",
              friday11hToFriday15h,
            ),
          ).rejects.toThrow(PrepareError.TimeWindowNotFound);
        });
      });
      describe("when adherent want to update a time window with end before start", () => {
        it("should indicate that end should be after start", async () => {
          const invalidTimeWindow = {
            start: new Date("2023-05-17T09:00+02:00"),
            end: new Date("2023-05-17T08:00+02:00"),
          };

          await expect(
            prepareFestivalActivity.updateTimeWindowInInquiry(
              activity.id,
              toUpdate.id,
              invalidTimeWindow,
            ),
          ).rejects.toThrow(EndBeforeStart);
        });
      });
    },
  );

  describe("when adherent want to remove a time window", () => {
    it.each`
      activityName               | activityId       | timeWindowIdToRemove
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.timeWindows[0].id}
      ${justDance.general.name}  | ${justDance.id}  | ${justDance.inquiry.timeWindows[0].id}
    `(
      "should remove time window $timeWindowIdToRemove in $activityName",
      async ({ activityId, timeWindowIdToRemove }) => {
        const { inquiry } =
          await prepareFestivalActivity.removeTimeWindowFromInquiry(
            activityId,
            timeWindowIdToRemove,
          );

        const timeWindow = inquiry.timeWindows.find(
          (tw) => tw.id === timeWindowIdToRemove,
        );
        expect(timeWindow).toBeUndefined();
      },
    );
    describe("when removing the last time window from an 'In Review' activity", () => {
      it("should indicate that we can't remove the last time window", async () => {
        const timeWindowIdToRemove = baladeEnPoney.inquiry.timeWindows[0].id;

        expect(
          async () =>
            await prepareFestivalActivity.removeTimeWindowFromInquiry(
              baladeEnPoney.id,
              timeWindowIdToRemove,
            ),
        ).rejects.toThrow(CantRemoveLastTimeWindow);
      });
    });
  });

  describe("when adherent want to add an inquiry request", () => {
    describe.each`
      activityName               | activityId       | requestName           | request                              | group
      ${escapeGame.general.name} | ${escapeGame.id} | ${branleCanisse.name} | ${{ ...branleCanisse, quantity: 3 }} | ${"gears"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${heras.name}         | ${{ ...heras, quantity: 5 }}         | ${"barriers"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${chargeurUsbC.name}  | ${{ ...chargeurUsbC, quantity: 1 }}  | ${"electricity"}
      ${justDance.general.name}  | ${justDance.id}  | ${branleCanisse.name} | ${{ ...branleCanisse, quantity: 2 }} | ${"gears"}
      ${justDance.general.name}  | ${justDance.id}  | ${heras.name}         | ${{ ...heras, quantity: 10 }}        | ${"barriers"}
      ${justDance.general.name}  | ${justDance.id}  | ${chargeurUsbC.name}  | ${{ ...chargeurUsbC, quantity: 1 }}  | ${"electricity"}
    `(
      "when adding $requestName request in $activityName",
      ({ activityId, request, group }) => {
        it(`should add it as ${group} request`, async () => {
          const { owner, ...expectedRequest } = request;
          const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
            activityId,
            request,
          );
          expect(inquiry[group as keyof WithInquiries]).toContainEqual(
            expectedRequest,
          );
        });
      },
    );

    describe.each`
      activityName                  | activityId          | requestName                               | request
      ${escapeGame.general.name}    | ${escapeGame.id}    | ${escapeGame.inquiry.gears[0].name}       | ${{ ...escapeGame.inquiry.gears[0], owner: MATOS }}
      ${escapeGame.general.name}    | ${escapeGame.id}    | ${escapeGame.inquiry.barriers[0].name}    | ${{ ...escapeGame.inquiry.barriers[0], owner: BARRIERES }}
      ${escapeGame.general.name}    | ${escapeGame.id}    | ${escapeGame.inquiry.electricity[0].name} | ${{ ...escapeGame.inquiry.electricity[0], owner: ELEC }}
      ${justDance.general.name}     | ${justDance.id}     | ${justDance.inquiry.gears[0].name}        | ${{ ...justDance.inquiry.gears[0], owner: MATOS }}
      ${justDance.general.name}     | ${justDance.id}     | ${justDance.inquiry.electricity[0].name}  | ${{ ...justDance.inquiry.electricity[0], owner: ELEC }}
      ${baladeEnPoney.general.name} | ${baladeEnPoney.id} | ${baladeEnPoney.inquiry.barriers[0].name} | ${{ ...baladeEnPoney.inquiry.barriers[0], owner: BARRIERES }}
    `(
      "when adding again $requestName on $activityName",
      ({ activityId, requestName, request }) => {
        it(`should indicate that there is already a request for ${requestName}`, async () => {
          expect(
            async () =>
              await prepareFestivalActivity.addInquiryRequest(
                activityId,
                request,
              ),
          ).rejects.toThrow(InquiryAlreadyExists);
        });
      },
    );

    describe.each`
      activityName               | activityId       | requestName           | request
      ${pcSecurite.general.name} | ${pcSecurite.id} | ${branleCanisse.name} | ${{ ...branleCanisse, quantity: 40 }}
      ${pcSecurite.general.name} | ${pcSecurite.id} | ${heras.name}         | ${{ ...heras, quantity: 100 }}
      ${pcSecurite.general.name} | ${pcSecurite.id} | ${chargeurUsbC.name}  | ${{ ...chargeurUsbC, quantity: 6 }}
    `(
      "when adding $requestName on non initialized inquiry section like in $activityName",
      ({ activityId, request }) => {
        it("should indicate that inquiry section must be initialized before", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.addInquiryRequest(
                activityId,
                request,
              ),
          ).rejects.toThrow(NotYetInitialized);
        });
      },
    );
  });

  describe("when adherent want to update the quantity of an inquiry request", () => {
    describe.each`
      activityName               | activityId       | requestName                               | request                                                                  | group
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.gears[0].name}       | ${{ ...escapeGame.inquiry.gears[0], quantity: 5, owner: MATOS }}         | ${"gears"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.barriers[0].name}    | ${{ ...escapeGame.inquiry.barriers[0], quantity: 10, owner: BARRIERES }} | ${"barriers"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.electricity[0].name} | ${{ ...escapeGame.inquiry.electricity[0], quantity: 2, owner: ELEC }}    | ${"electricity"}
      ${justDance.general.name}  | ${justDance.id}  | ${justDance.inquiry.gears[0].name}        | ${{ ...justDance.inquiry.gears[0], quantity: 5, owner: MATOS }}          | ${"gears"}
      ${justDance.general.name}  | ${justDance.id}  | ${justDance.inquiry.electricity[0].name}  | ${{ ...justDance.inquiry.electricity[0], quantity: 2, owner: ELEC }}     | ${"electricity"}
    `(
      "when updating the quantity of $requestName request in $activityName",
      ({ activityId, request, group }) => {
        it(`should update the quantity of ${group} request`, async () => {
          const { owner, ...expectedRequest } = request;
          const { inquiry } =
            await prepareFestivalActivity.updateInquiryRequest(
              activityId,
              request,
            );
          expect(inquiry[group as keyof WithInquiries]).toContainEqual(
            expectedRequest,
          );
        });
      },
    );

    describe.each`
      activityName               | activityId       | requestName           | request
      ${escapeGame.general.name} | ${escapeGame.id} | ${branleCanisse.name} | ${{ ...branleCanisse, quantity: 5 }}
      ${justDance.general.name}  | ${justDance.id}  | ${heras.name}         | ${{ ...heras, quantity: 10 }}
    `(
      "when updating unexisting $requestName request in $activityName",
      ({ activityId, request }) => {
        it("should indicate that the request doesn't exist", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.updateInquiryRequest(
                activityId,
                request,
              ),
          ).rejects.toThrow(InquiryNotFound);
        });
      },
    );
  });

  describe("when adherent want to remove an inquiry request", () => {
    describe.each`
      activityName               | activityId       | requestName                               | request                              | owner          | group
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.gears[0].name}       | ${escapeGame.inquiry.gears[0]}       | ${"matos"}     | ${"gears"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.barriers[0].name}    | ${escapeGame.inquiry.barriers[0]}    | ${"barrieres"} | ${"barriers"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.electricity[0].name} | ${escapeGame.inquiry.electricity[0]} | ${"elec"}      | ${"electricity"}
      ${justDance.general.name}  | ${justDance.id}  | ${escapeGame.inquiry.gears[0].name}       | ${escapeGame.inquiry.gears[0]}       | ${"matos"}     | ${"gears"}
      ${justDance.general.name}  | ${justDance.id}  | ${escapeGame.inquiry.electricity[0].name} | ${escapeGame.inquiry.electricity[0]} | ${"elec"}      | ${"electricity"}
    `(
      "when removing $requestName from $activityName",
      ({ activityId, request, group }) => {
        it(`should remove it form ${group} requests`, async () => {
          const { inquiry } =
            await prepareFestivalActivity.removeInquiryRequest(activityId, {
              slug: request.slug,
              owner: request.owner,
            });

          expect(inquiry[group as keyof WithInquiries]).not.toContainEqual(
            request,
          );
        });
      },
    );
    describe("when removing the last request from an 'In Review' activity", () => {
      it("should indicate that we can't remove the last request", async () => {
        const requestSlug = baladeEnPoney.inquiry.barriers[0].slug;

        expect(
          async () =>
            await prepareFestivalActivity.removeInquiryRequest(
              baladeEnPoney.id,
              { slug: requestSlug, owner: barrieres },
            ),
        ).rejects.toThrow(CantRemoveLastRequest);
      });
    });
  });

  describe.each`
    activityName                  | activityId          | inquiryRequestSlug                        | drive             | owner
    ${justDance.general.name}     | ${justDance.id}     | ${justDance.inquiry.gears[0].slug}        | ${MAGASIN}        | ${matos}
    ${justDance.general.name}     | ${justDance.id}     | ${justDance.inquiry.electricity[0].slug}  | ${LOCAL_24H}      | ${elec}
    ${baladeEnPoney.general.name} | ${baladeEnPoney.id} | ${baladeEnPoney.inquiry.barriers[0].slug} | ${PARKING_EIFFEL} | ${barrieres}
  `(
    "when $owner member want to assign $drive as drive for $inquiryRequestSlug inquiry in $activityName",
    ({ activityId, inquiryRequestSlug, drive, owner }) => {
      it("should link the inquiry to the drive", async () => {
        const { inquiry } = await prepareFestivalActivity.assignInquiryToDrive(
          activityId,
          { slug: inquiryRequestSlug, drive, owner },
        );
        const requests = [
          ...inquiry.gears,
          ...inquiry.barriers,
          ...inquiry.electricity,
        ];
        expect(requests).toContainEqual({
          quantity: expect.any(Number),
          name: expect.any(String),
          drive,
          slug: inquiryRequestSlug,
        });
      });
    },
  );

  describe("when trying to assign a drive to an inquiry request from a draft festival activity", () => {
    it("should indicate that we can't assign drive to inquiry request from draft festival activity", async () => {
      const vaubanRequest = escapeGame.inquiry.barriers[0].slug;
      expect(
        async () =>
          await prepareFestivalActivity.assignInquiryToDrive(escapeGame.id, {
            slug: vaubanRequest,
            drive: PARKING_EIFFEL,
            owner: barrieres,
          }),
      ).rejects.toThrow(AssignDriveInDraft);
    });
  });

  describe.each`
    activityName                                | activity                       | approvedBy                  | gearsAvailable | barriersAvailable | elecAvailable
    ${approvedByElec.general.name}              | ${approvedByElec}              | ${[elec]}                   | ${true}        | ${true}           | ${false}
    ${approvedByBarrieres.general.name}         | ${approvedByBarrieres}         | ${[barrieres]}              | ${true}        | ${false}          | ${true}
    ${approvedByMatos.general.name}             | ${approvedByMatos}             | ${[matos]}                  | ${false}       | ${true}           | ${true}
    ${approvedByMatosAndBarrieres.general.name} | ${approvedByMatosAndBarrieres} | ${[matos, barrieres]}       | ${false}       | ${false}          | ${true}
    ${approvedByAllInquiryOwners.general.name}  | ${approvedByAllInquiryOwners}  | ${[matos, barrieres, elec]} | ${false}       | ${false}          | ${false}
  `(
    "when $activityName is already approved by $approvedBy",
    ({ activity, gearsAvailable, barriersAvailable, elecAvailable }) => {
      describe("when trying to add a time window", () => {
        it("should indicate that time window inquiry section is locked", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.addTimeWindowInInquiry(
                activity.id,
                saturday14hToSaturday18h,
              ),
          ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
        });
      });
      describe("when trying to update a time window", () => {
        it("should indicate that time window inquiry section is locked", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.updateTimeWindowInInquiry(
                activity.id,
                saturday14hToSaturday18h.id,
                friday12hToFriday14h,
              ),
          ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
        });
      });
      describe("when trying to remove a time window", () => {
        it("should indicate that time window inquiry section is locked", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.removeTimeWindowFromInquiry(
                activity.id,
                sunday14hToSunday18h.id,
              ),
          ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
        });
      });

      describe("when trying to add the first request with time window", () => {
        it("should indicate that inquiry section is already initialized", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.initInquiry(activity.id, {
                timeWindow: saturday14hToSaturday18h,
                request: { ...troisTables, owner: matos },
              }),
          ).rejects.toThrow(AlreadyInitialized);
        });
      });

      describe("when trying to add a gear inquiry request", () => {
        if (gearsAvailable) {
          it("should add it to the current requests", async () => {
            const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
              activity.id,
              { ...troisTables, owner: matos },
            );
            expect(inquiry.gears).toContainEqual(troisTables);
          });
        } else {
          it("should indicate that gears inquiry requests section is locked", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.addInquiryRequest(activity.id, {
                  ...troisTables,
                  owner: matos,
                }),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to update a gear inquiry request", () => {
        if (gearsAvailable) {
          it("should update it in the current requests", async () => {
            const { inquiry } =
              await prepareFestivalActivity.updateInquiryRequest(activity.id, {
                ...activity.inquiry.gears[0],
                quantity: 5,
                owner: matos,
              });
            expect(inquiry.gears).toContainEqual({
              ...activity.inquiry.gears[0],
              quantity: 5,
            });
          });
        } else {
          it("should indicate that gears inquiry requests section is locked", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.updateInquiryRequest(
                  activity.id,
                  {
                    ...activity.inquiry.gears[0],
                    quantity: 5,
                    owner: matos,
                  },
                ),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to remove a gear inquiry request", () => {
        if (gearsAvailable) {
          it("should remove it from the current requests", async () => {
            const { inquiry } =
              await prepareFestivalActivity.removeInquiryRequest(activity.id, {
                slug: deuxMarteaux.slug,
                owner: matos,
              });
            expect(inquiry.gears).not.toContainEqual(deuxMarteaux);
          });
        } else {
          it("should indicate that gears inquiry requests section is locked", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.removeInquiryRequest(
                  activity.id,
                  {
                    slug: deuxMarteaux.slug,
                    owner: matos,
                  },
                ),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to add a barrier inquiry request", () => {
        if (barriersAvailable) {
          it("should add it to the current requests", async () => {
            const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
              activity.id,
              { ...quatreHeras, owner: barrieres },
            );
            expect(inquiry.barriers).toContainEqual(quatreHeras);
          });
        } else {
          it("should indicate that barriers inquiry requests section is locked", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.addInquiryRequest(activity.id, {
                  ...quatreHeras,
                  owner: barrieres,
                }),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to update a barrier inquiry request", () => {
        if (barriersAvailable) {
          it("should update it in the current requests", async () => {
            const { inquiry } =
              await prepareFestivalActivity.updateInquiryRequest(activity.id, {
                ...activity.inquiry.barriers[0],
                quantity: 5,
                owner: barrieres,
              });
            expect(inquiry.barriers).toContainEqual({
              ...activity.inquiry.barriers[0],
              quantity: 5,
            });
          });
        } else {
          it("should indicate that barriers inquiry requests section is locked", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.updateInquiryRequest(
                  activity.id,
                  {
                    ...activity.inquiry.barriers[0],
                    quantity: 5,
                    owner: barrieres,
                  },
                ),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to remove a barrier inquiry request", () => {
        if (barriersAvailable) {
          it("should remove it from the current requests", async () => {
            const { inquiry } =
              await prepareFestivalActivity.removeInquiryRequest(activity.id, {
                slug: quinzeVaubans.slug,
                owner: barrieres,
              });
            expect(inquiry.barriers).not.toContainEqual(quinzeVaubans);
          });
        } else {
          it("should indicate that barriers inquiry requests section is locked", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.removeInquiryRequest(
                  activity.id,
                  {
                    slug: quinzeVaubans.slug,
                    owner: barrieres,
                  },
                ),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to add an electricity inquiry request", () => {
        if (elecAvailable) {
          it("should add it to the current requests", async () => {
            const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
              activity.id,
              { ...cinqGuirlandeLED, owner: elec },
            );
            expect(inquiry.electricity).toContainEqual(cinqGuirlandeLED);
          });
        } else {
          it("should indicate that electricty inquiry requests section is lock", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.addInquiryRequest(activity.id, {
                  ...cinqGuirlandeLED,
                  owner: elec,
                }),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to update an electricity inquiry request", () => {
        if (elecAvailable) {
          it("should update it in the current requests", async () => {
            const { inquiry } =
              await prepareFestivalActivity.updateInquiryRequest(activity.id, {
                ...activity.inquiry.electricity[0],
                quantity: 5,
                owner: elec,
              });
            expect(inquiry.electricity).toContainEqual({
              ...activity.inquiry.electricity[0],
              quantity: 5,
            });
          });
        } else {
          it("should indicate that electricty inquiry requests section is lock", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.updateInquiryRequest(
                  activity.id,
                  {
                    ...activity.inquiry.electricity[0],
                    quantity: 5,
                    owner: elec,
                  },
                ),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });

      describe("when trying to remove an electricity inquiry request", () => {
        if (elecAvailable) {
          it("should remove it from the current requests", async () => {
            const { inquiry } =
              await prepareFestivalActivity.removeInquiryRequest(activity.id, {
                slug: uneMultiprise3Prises.slug,
                owner: elec,
              });
            expect(inquiry.electricity).not.toContainEqual(
              uneMultiprise3Prises,
            );
          });
        } else {
          it("should indicate that electricty inquiry requests section is locked", async () => {
            expect(
              async () =>
                await prepareFestivalActivity.removeInquiryRequest(
                  activity.id,
                  {
                    slug: uneMultiprise3Prises.slug,
                    owner: elec,
                  },
                ),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          });
        }
      });
    },
  );

  describe.each`
    activityName                                              | activityId                                      | approvedBy            | timeWindow
    ${approvedByElecWithoutRequests.general.name}             | ${approvedByElecWithoutRequests.id}             | ${[elec]}             | ${saturday14hToSaturday18h}
    ${approvedByBarrieresWithoutRequests.general.name}        | ${approvedByBarrieresWithoutRequests.id}        | ${[barrieres]}        | ${saturday14hToSaturday18h}
    ${approvedByMatosWithoutRequests.general.name}            | ${approvedByMatosWithoutRequests.id}            | ${[matos]}            | ${saturday14hToSaturday18h}
    ${approvedByMatosAndBarrieresWithoutRequest.general.name} | ${approvedByMatosAndBarrieresWithoutRequest.id} | ${[barrieres, matos]} | ${saturday14hToSaturday18h}
  `(
    "when $activityName is already approved by $approvedBy",
    ({ activityId, timeWindow }) => {
      it("should be possible to add time window", async () => {
        const activity = await prepareFestivalActivity.addTimeWindowInInquiry(
          activityId,
          timeWindow,
        );
        expect(activity.inquiry.timeWindows).toContainEqual(timeWindow);
      });
      it("should be possible to update a time window", async () => {
        const activity =
          await prepareFestivalActivity.updateTimeWindowInInquiry(
            activityId,
            friday12hToFriday14h.id,
            timeWindow,
          );
        expect(activity.inquiry.timeWindows).toContainEqual(timeWindow);
      });
      it("should be possible to remove a time window", async () => {
        const activity =
          await prepareFestivalActivity.removeTimeWindowFromInquiry(
            activityId,
            friday12hToFriday14h.id,
          );
        expect(activity.inquiry.timeWindows).not.toContainEqual(
          friday12hToFriday14h,
        );
      });
    },
  );

  describe("when all reviewers approved inquiry that doesn't have any request", () => {
    describe("when trying to add time window", () => {
      it("should indicate that inquiry section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.addTimeWindowInInquiry(
              approvedByAllInquiryOwnersWithoutRequest.id,
              saturday14hToSaturday18h,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to update a time window", () => {
      it("should indicate that inquiry section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateTimeWindowInInquiry(
              approvedByAllInquiryOwnersWithoutRequest.id,
              saturday14hToSaturday18h.id,
              friday12hToFriday14h,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to remove a time window", () => {
      it("should indicate that inquiry section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.removeTimeWindowFromInquiry(
              approvedByAllInquiryOwnersWithoutRequest.id,
              saturday14hToSaturday18h.id,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
  });

  describe("clear inquiry section", () => {
    describe("when activity is still in draft", () => {
      it.each`
        activityName               | activityId
        ${escapeGame.general.name} | ${escapeGame.id}
        ${qgOrga.general.name}     | ${qgOrga.id}
      `(
        "should reset $activityName inquiries and time windows",
        async ({ activityId }) => {
          const activity =
            await prepareFestivalActivity.clearInquiry(activityId);
          expect(activity.inquiry.gears).toStrictEqual([]);
          expect(activity.inquiry.electricity).toStrictEqual([]);
          expect(activity.inquiry.barriers).toStrictEqual([]);
          expect(activity.inquiry.timeWindows).toStrictEqual([]);
        },
      );
    });
    describe("when activity is under review", () => {
      describe("when none of logistic team approved activity yet", () => {
        it.each`
          activityName                  | activityId
          ${justDance.general.name}     | ${justDance.id}
          ${baladeEnPoney.general.name} | ${baladeEnPoney.id}
        `(
          "should reset $activityName inquiries and time windows",
          async ({ activityId }) => {
            const activity =
              await prepareFestivalActivity.clearInquiry(activityId);
            expect(activity.inquiry.gears).toStrictEqual([]);
            expect(activity.inquiry.electricity).toStrictEqual([]);
            expect(activity.inquiry.barriers).toStrictEqual([]);
            expect(activity.inquiry.timeWindows).toStrictEqual([]);
          },
        );
      });
      describe("when one of logistic team with requests already approved activity", () => {
        it.each`
          activityName                                | activityId
          ${approvedByElec.general.name}              | ${approvedByElec.id}
          ${approvedByAllInquiryOwners.general.name}  | ${approvedByAllInquiryOwners.id}
          ${approvedByBarrieres.general.name}         | ${approvedByBarrieres.id}
          ${approvedByMatos.general.name}             | ${approvedByMatos.id}
          ${approvedByMatosAndBarrieres.general.name} | ${approvedByMatosAndBarrieres.id}
        `(
          "should indicate that $activityName is already approved by logistic team",
          async ({ activityId }) => {
            expect(
              async () =>
                await prepareFestivalActivity.clearInquiry(activityId),
            ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
          },
        );
      });
      describe("when none of logistic team with requests approved activity yet", () => {
        it.each`
          activityName                                              | activityId
          ${approvedByBarrieresWithoutRequests.general.name}        | ${approvedByBarrieresWithoutRequests.id}
          ${approvedByElecWithoutRequests.general.name}             | ${approvedByElecWithoutRequests.id}
          ${approvedByMatosWithoutRequests.general.name}            | ${approvedByMatosWithoutRequests.id}
          ${approvedByMatosAndBarrieresWithoutRequest.general.name} | ${approvedByMatosAndBarrieresWithoutRequest.id}
        `(
          "should reset $activityName inquiries and time windows",
          async ({ activityId }) => {
            const activity =
              await prepareFestivalActivity.clearInquiry(activityId);
            expect(activity.inquiry.gears).toStrictEqual([]);
            expect(activity.inquiry.electricity).toStrictEqual([]);
            expect(activity.inquiry.barriers).toStrictEqual([]);
            expect(activity.inquiry.timeWindows).toStrictEqual([]);
          },
        );
      });
    });
  });
});
