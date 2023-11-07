import { Duration, EndBeforeStart } from "@overbookd/period";
import { beforeEach, describe, expect, it } from "vitest";
import {
  InquiryAlreadyExists,
  TimeWindowAlreadyExists,
} from "../festival-activity.error";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import { escapeGame } from "./preparation.test-utils";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import {
  BARRIER,
  ELECTRICITY,
  GEAR,
  PrepareInquiryRequestCreation,
} from "./prepare-festival-activity.model";

describe("Inquiry section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe("when adherent want to add a time window", () => {
    it("should add the time window", async () => {
      const timeWindowToAdd = {
        start: new Date("2023-05-17T18:00+02:00"),
        end: new Date("2023-05-17T20:00+02:00"),
      };

      const { inquiry } = await prepareFestivalActivity.addTimeWindowInInquiry(
        escapeGame.id,
        timeWindowToAdd,
      );

      const startDuration = Duration.ms(timeWindowToAdd.start.getTime());
      const endDuration = Duration.ms(timeWindowToAdd.end.getTime());
      const timeWindowId = `${escapeGame.id}-${startDuration.inMinutes}-${endDuration.inMinutes}`;

      const timeWindow = inquiry.timeWindows.find(
        (tw) => tw.id === timeWindowId,
      );

      expect(timeWindow?.id).toBe(timeWindowId);
      expect(timeWindow?.start).toBe(timeWindowToAdd.start);
      expect(timeWindow?.end).toBe(timeWindowToAdd.end);
    });

    describe("when adherent want to add a time window that already exists", () => {
      it("should should indicate that the time window already exists", async () => {
        const existingTimeWindow = escapeGame.inquiry.timeWindows[0];

        await expect(
          prepareFestivalActivity.addTimeWindowInInquiry(
            escapeGame.id,
            existingTimeWindow,
          ),
        ).rejects.toThrow(TimeWindowAlreadyExists);
      });
    });

    describe("when adherent want to add a time window with end before start", () => {
      it("should should indicate that end should be after start", async () => {
        const invalidTimeWindow = {
          start: new Date("2023-05-17T10:00+02:00"),
          end: new Date("2023-05-17T08:00+02:00"),
        };

        await expect(
          prepareFestivalActivity.addTimeWindowInInquiry(
            escapeGame.id,
            invalidTimeWindow,
          ),
        ).rejects.toThrow(EndBeforeStart);
      });
    });
  });

  describe("when adherent want to remove a time window", () => {
    it("should remove the time window", async () => {
      const timeWindowIdToRemove = "1-28071900-28072140";

      const { inquiry } =
        await prepareFestivalActivity.removeTimeWindowFromInquiry(
          escapeGame.id,
          timeWindowIdToRemove,
        );

      const timeWindow = inquiry.timeWindows.find(
        (tw) => tw.id === timeWindowIdToRemove,
      );
      expect(timeWindow).toBeUndefined();
    });
  });

  describe("when adherent want to add a gear inquiry", () => {
    it("should add the gear inquiry", async () => {
      const inquiryToAdd: PrepareInquiryRequestCreation = {
        slug: "branle-canisse",
        quantity: 3,
        category: GEAR,
      };

      const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
        escapeGame.id,
        inquiryToAdd,
      );

      const category = inquiryToAdd.category.toLowerCase();
      const inquiryId = `${escapeGame.id}-${category}-${inquiryToAdd.slug}`;
      const gearInquiry = inquiry.gears.find((inq) => inq.id === inquiryId);

      expect(gearInquiry?.id).toBe(inquiryId);
      expect(gearInquiry?.quantity).toBe(inquiryToAdd.quantity);
      expect(gearInquiry?.slug).toBe(inquiryToAdd.slug);
    });

    describe("when adherent want to add a gear inquiry that already exists", () => {
      it("should should indicate that the gear inquiry already exists", async () => {
        const existingGearInquiry = escapeGame.inquiry.gears[0];
        const inquiryToAdd: PrepareInquiryRequestCreation = {
          ...existingGearInquiry,
          category: GEAR,
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
      const gearInquiryIdToRemove = "1-gear-marteau";

      const { inquiry } = await prepareFestivalActivity.removeInquiryRequest(
        escapeGame.id,
        gearInquiryIdToRemove,
      );

      const gearInquiry = inquiry.gears.find(
        (inq) => inq.id === gearInquiryIdToRemove,
      );
      expect(gearInquiry).toBeUndefined();
    });
  });

  describe("when adherent want to add a barrier inquiry", () => {
    it("should add the barrier inquiry", async () => {
      const inquiryToAdd: PrepareInquiryRequestCreation = {
        slug: "heras",
        quantity: 5,
        category: BARRIER,
      };

      const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
        escapeGame.id,
        inquiryToAdd,
      );

      const category = inquiryToAdd.category.toLowerCase();
      const inquiryId = `${escapeGame.id}-${category}-${inquiryToAdd.slug}`;
      const barrierInquiry = inquiry.barriers.find(
        (inq) => inq.id === inquiryId,
      );

      expect(barrierInquiry?.id).toBe(inquiryId);
      expect(barrierInquiry?.quantity).toBe(inquiryToAdd.quantity);
      expect(barrierInquiry?.slug).toBe(inquiryToAdd.slug);
    });

    describe("when adherent want to add a barrier inquiry that already exists", () => {
      it("should should indicate that the barrier inquiry already exists", async () => {
        const existingBarrierInquiry = escapeGame.inquiry.barriers[0];
        const inquiryToAdd: PrepareInquiryRequestCreation = {
          ...existingBarrierInquiry,
          category: BARRIER,
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
      const barrierInquiryIdToRemove = "1-barrier-vauban";

      const { inquiry } = await prepareFestivalActivity.removeInquiryRequest(
        escapeGame.id,
        barrierInquiryIdToRemove,
      );

      const barrierInquiry = inquiry.barriers.find(
        (inq) => inq.id === barrierInquiryIdToRemove,
      );
      expect(barrierInquiry).toBeUndefined();
    });
  });

  describe("when adherent want to add an electricity inquiry", () => {
    it("should add the electricity inquiry", async () => {
      const inquiryToAdd: PrepareInquiryRequestCreation = {
        slug: "chargeur-usb-c",
        quantity: 1,
        category: ELECTRICITY,
      };

      const { inquiry } = await prepareFestivalActivity.addInquiryRequest(
        escapeGame.id,
        inquiryToAdd,
      );

      const category = inquiryToAdd.category.toLowerCase();
      const inquiryId = `${escapeGame.id}-${category}-${inquiryToAdd.slug}`;
      const elecInquiry = inquiry.electricity.find(
        (inq) => inq.id === inquiryId,
      );

      expect(elecInquiry?.id).toBe(inquiryId);
      expect(elecInquiry?.quantity).toBe(inquiryToAdd.quantity);
      expect(elecInquiry?.slug).toBe(inquiryToAdd.slug);
    });

    describe("when adherent want to add an electricity inquiry that already exists", () => {
      it("should should indicate that the electricity inquiry already exists", async () => {
        const existingElecInquiry = escapeGame.inquiry.electricity[0];
        const inquiryToAdd: PrepareInquiryRequestCreation = {
          ...existingElecInquiry,
          category: ELECTRICITY,
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
      const elecInquiryIdToRemove = "1-electricity-prise-murale";

      const { inquiry } = await prepareFestivalActivity.removeInquiryRequest(
        escapeGame.id,
        elecInquiryIdToRemove,
      );

      const elecInquiry = inquiry.electricity.find(
        (inq) => inq.id === elecInquiryIdToRemove,
      );
      expect(elecInquiry).toBeUndefined();
    });
  });
});
