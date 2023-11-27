import { Duration, EndBeforeStart } from "@overbookd/period";
import { beforeEach, describe, expect, it } from "vitest";
import {
  InquiryAlreadyExists,
  TimeWindowAlreadyExists,
} from "../festival-activity.error";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import {
  baladeEnPoney,
  escapeGame,
  justDance,
  pcSecurite,
  qgOrga,
} from "./preparation.test-utils";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { BARRIERES, ELEC, MATOS } from "../festival-activity";
import {
  MAGASIN,
  LOCAL_24H,
  PARKING_EIFFEL,
  barrieres,
} from "../festival-activity";
import {
  AlreadyInitialized,
  CantRemoveLastRequest,
  CantRemoveLastTimeWindow,
  NotYetInitialized,
} from "./section-aggregates/inquiries";
import { WithInquiries, elec, matos } from "../festival-activity";
import { AssignDriveInDraftActivity } from "./prepare-draft-festival-activity";

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
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe.each`
    activityName               | activityId       | timeWindow                                                                                | inquiryRequest
    ${qgOrga.general.name}     | ${qgOrga.id}     | ${{ start: new Date("2024-05-18T11:00+02:00"), end: new Date("2024-05-18T13:00+02:00") }} | ${{ ...branleCanisse, quantity: 4 }}
    ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ start: new Date("2024-05-17T16:00+02:00"), end: new Date("2024-05-20T00:00+02:00") }} | ${{ ...branleCanisse, quantity: 10 }}
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

  describe("when adherent want to remove an inquiry request", () => {
    describe.each`
      activityName               | activityId       | requestName                               | request                              | group
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.gears[0].name}       | ${escapeGame.inquiry.gears[0]}       | ${"gears"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.barriers[0].name}    | ${escapeGame.inquiry.barriers[0]}    | ${"barriers"}
      ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.inquiry.electricity[0].name} | ${escapeGame.inquiry.electricity[0]} | ${"electricity"}
      ${justDance.general.name}  | ${justDance.id}  | ${escapeGame.inquiry.gears[0].name}       | ${escapeGame.inquiry.gears[0]}       | ${"gears"}
      ${justDance.general.name}  | ${justDance.id}  | ${escapeGame.inquiry.electricity[0].name} | ${escapeGame.inquiry.electricity[0]} | ${"electricity"}
    `(
      "when removing $requestName from $activityName",
      ({ activityId, request, group }) => {
        it(`should remove it form ${group} requests`, async () => {
          const { inquiry } =
            await prepareFestivalActivity.removeInquiryRequest(
              activityId,
              request.slug,
            );

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
              requestSlug,
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
      ).rejects.toThrow(AssignDriveInDraftActivity);
    });
  });
});
