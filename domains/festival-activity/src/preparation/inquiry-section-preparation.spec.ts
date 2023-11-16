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
import {
  BARRIERES,
  ELEC,
  MATOS,
  PrepareInquiryRequestCreation,
} from "./prepare-festival-activity.model";
import {
  AlreadyInitialized,
  CantRemoveLastTimeWindow,
  NotYetInitialized,
} from "./inquiries";

const branleCanisse = {
  slug: "branle-canisse",
  name: "Branle canisse",
  owner: MATOS,
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
    describe("when removed time window is the last one on In Review activity", () => {
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

  describe("when adherent want to add a gear inquiry", () => {
    it("should add the gear inquiry", async () => {
      const inquiryToAdd: PrepareInquiryRequestCreation = {
        ...branleCanisse,
        quantity: 3,
      };

      const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
        escapeGame.id,
        inquiryToAdd,
      );

      const expectedInquiry = {
        slug: inquiryToAdd.slug,
        name: inquiryToAdd.name,
        quantity: inquiryToAdd.quantity,
      };
      expect(inquiry.gears).toContainEqual(expectedInquiry);
    });

    describe("when adherent want to add a gear inquiry that already exists", () => {
      it("should should indicate that the gear inquiry already exists", async () => {
        const existingGearInquiry = escapeGame.inquiry.gears[0];
        const inquiryToAdd: PrepareInquiryRequestCreation = {
          ...existingGearInquiry,
          owner: MATOS,
        };

        await expect(
          prepareFestivalActivity.addInquiryRequest(
            escapeGame.id,
            inquiryToAdd,
          ),
        ).rejects.toThrow(InquiryAlreadyExists);
      });
    });
  });

  describe("when adherent want to remove a gear inquiry", () => {
    it("should remove the gear inquiry", async () => {
      const inquiryToRemove = escapeGame.inquiry.gears[0];

      const { inquiry } = await prepareFestivalActivity.removeInquiryRequest(
        escapeGame.id,
        inquiryToRemove.slug,
      );

      expect(inquiry.gears).not.toContainEqual(inquiryToRemove);
    });
  });

  describe("when adherent want to add a barrier inquiry", () => {
    it("should add the barrier inquiry", async () => {
      const inquiryToAdd: PrepareInquiryRequestCreation = {
        slug: "heras",
        name: "Heras",
        quantity: 5,
        owner: BARRIERES,
      };

      const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
        escapeGame.id,
        inquiryToAdd,
      );

      const expectedInquiry = {
        slug: inquiryToAdd.slug,
        name: inquiryToAdd.name,
        quantity: inquiryToAdd.quantity,
      };
      expect(inquiry.barriers).toContainEqual(expectedInquiry);
    });

    describe("when adherent want to add a barrier inquiry that already exists", () => {
      it("should should indicate that the barrier inquiry already exists", async () => {
        const existingBarrierInquiry = escapeGame.inquiry.barriers[0];
        const inquiryToAdd: PrepareInquiryRequestCreation = {
          ...existingBarrierInquiry,
          owner: BARRIERES,
        };

        await expect(
          prepareFestivalActivity.addInquiryRequest(
            escapeGame.id,
            inquiryToAdd,
          ),
        ).rejects.toThrow(InquiryAlreadyExists);
      });
    });
  });

  describe("when adherent want to remove a barrier inquiry", () => {
    it("should remove the barrier inquiry", async () => {
      const inquiryToRemove = escapeGame.inquiry.barriers[0];

      const { inquiry } = await prepareFestivalActivity.removeInquiryRequest(
        escapeGame.id,
        inquiryToRemove.slug,
      );

      expect(inquiry.barriers).not.toContainEqual(inquiryToRemove);
    });
  });

  describe("when adherent want to add an electricity inquiry", () => {
    it("should add the electricity inquiry", async () => {
      const inquiryToAdd: PrepareInquiryRequestCreation = {
        slug: "chargeur-usb-c",
        name: "Chargeur USB-C",
        quantity: 1,
        owner: ELEC,
      };

      const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
        escapeGame.id,
        inquiryToAdd,
      );

      const expectedInquiry = {
        slug: inquiryToAdd.slug,
        name: inquiryToAdd.name,
        quantity: inquiryToAdd.quantity,
      };
      expect(inquiry.electricity).toContainEqual(expectedInquiry);
    });

    describe("when adherent want to add an electricity inquiry that already exists", () => {
      it("should indicate that the electricity inquiry already exists", async () => {
        const existingElecInquiry = escapeGame.inquiry.electricity[0];
        const inquiryToAdd: PrepareInquiryRequestCreation = {
          ...existingElecInquiry,
          owner: ELEC,
        };

        await expect(
          prepareFestivalActivity.addInquiryRequest(
            escapeGame.id,
            inquiryToAdd,
          ),
        ).rejects.toThrow(InquiryAlreadyExists);
      });
    });
  });

  describe("when adherent want to remove an electricity inquiry", () => {
    it("should remove the electricity inquiry", async () => {
      const inquiryToRemove = escapeGame.inquiry.electricity[0];

      const { inquiry } = await prepareFestivalActivity.removeInquiryRequest(
        escapeGame.id,
        inquiryToRemove.slug,
      );

      expect(inquiry.electricity).not.toContainEqual(inquiryToRemove);
    });
  });
});
