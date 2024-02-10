import { describe, expect, it } from "vitest";
import { CreateFestivalActivity } from "./creation";
import { KeyEvent } from "../festival-activity";
import { CREATED } from "../../common/action";
import { DRAFT } from "../../common/status";
import { Adherent } from "../../common/adherent";
import { InMemoryCreateFestivalActivityRepository } from "./festival-activities.inmemory";

const noel: Adherent = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

describe("Festival activity creation", () => {
  describe(`when ${noel.firstname} create Escape game activity`, async () => {
    const repository = new InMemoryCreateFestivalActivityRepository();
    const festivalActivity = new CreateFestivalActivity(repository);
    const escapeGame = await festivalActivity.create({
      name: "Escape game",
      author: noel,
    });

    const createdEvent: KeyEvent = {
      action: CREATED,
      at: expect.any(Date),
      by: noel,
      description: "FA créée",
    };

    it("should create Escape game activity", () => {
      expect(escapeGame.general.name).toBe("Escape game");
    });

    it("should set Noel in charge of it", () => {
      expect(escapeGame.inCharge.adherent).toEqual(noel);
    });

    it("should init history with CREATED key event", () => {
      expect(escapeGame.history).toContainEqual(createdEvent);
    });

    it(`should set the status to ${DRAFT}`, () => {
      expect(escapeGame.status).toBe(DRAFT);
    });

    it("should generate an id", () => {
      expect(escapeGame.id).toEqual(expect.any(Number));
    });

    it("should generate general section with default value", () => {
      expect(escapeGame.general.description).toBeNull();
      expect(escapeGame.general.categories).toEqual([]);
      expect(escapeGame.general.toPublish).toEqual(false);
      expect(escapeGame.general.photoLink).toBeNull();
      expect(escapeGame.general.isFlagship).toEqual(false);
      expect(escapeGame.general.timeWindows).toEqual([]);
    });

    it("should generate in charge section with default value", () => {
      expect(escapeGame.inCharge.team).toBeNull();
      expect(escapeGame.inCharge.contractors).toEqual([]);
    });

    it("should generate signa section with default value", () => {
      expect(escapeGame.signa.location).toBeNull();
      expect(escapeGame.signa.signages).toEqual([]);
    });

    it("should generate security section with default value", () => {
      expect(escapeGame.security.specialNeed).toBeNull();
      expect(escapeGame.security.freePass).toEqual(0);
    });

    it("should generate supply section with default value", () => {
      expect(escapeGame.supply.electricity).toEqual([]);
      expect(escapeGame.supply.water).toBeNull();
    });

    it("should generate inquiry section with default value", () => {
      expect(escapeGame.inquiry.timeWindows).toEqual([]);
      expect(escapeGame.inquiry.gears).toEqual([]);
      expect(escapeGame.inquiry.electricity).toEqual([]);
      expect(escapeGame.inquiry.barriers).toEqual([]);
    });

    it("should match festival activity json structure", () => {
      expect(escapeGame).toEqual({
        id: expect.any(Number),
        status: DRAFT,
        general: {
          name: "Escape game",
          description: null,
          categories: [],
          toPublish: false,
          photoLink: null,
          isFlagship: false,
          timeWindows: [],
        },
        inCharge: {
          adherent: noel,
          team: null,
          contractors: [],
        },
        signa: {
          location: null,
          signages: [],
        },
        security: {
          specialNeed: null,
          freePass: 0,
        },
        supply: {
          electricity: [],
          water: null,
        },
        inquiry: {
          timeWindows: [],
          gears: [],
          electricity: [],
          barriers: [],
        },
        feedbacks: [],
        history: [createdEvent],
        tasks: [],
      });
    });
  });
});
