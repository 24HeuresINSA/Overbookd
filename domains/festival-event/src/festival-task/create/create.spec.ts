import { describe, expect, it } from "vitest";
import { CREATED } from "../../common/action";
import { DRAFT } from "../../common/status";
import { CreateFestivalTask } from "./create";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { noel, escapeGame } from "../festival-task.test-util";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

describe("Create festival task", () => {
  describe(`when ${noel.firstname} create Install escape game task`, async () => {
    const festivalTasks = new InMemoryFestivalTasks();
    const volunteerConflicts = new InMemoryVolunteerConflicts([], []);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    const create = new CreateFestivalTask(festivalTasks, translator);
    const installEscapeGame = await create.apply({
      name: "Install escape game",
      festivalActivity: escapeGame,
      author: noel,
    });

    const createdEvent = {
      action: CREATED,
      at: expect.any(Date),
      by: noel,
      description: "FT créée",
    };

    it("should create Install escape game task", () => {
      expect(installEscapeGame.general.name).toBe("Install escape game");
    });

    it("should set Noel as administrator of it", () => {
      expect(installEscapeGame.general.administrator).toEqual(noel);
    });

    it("should init history with CREATED key event", () => {
      expect(installEscapeGame.history).toContainEqual(createdEvent);
    });

    it(`should set the status to ${DRAFT}`, () => {
      expect(installEscapeGame.status).toBe(DRAFT);
    });

    it("should generate an id", () => {
      expect(installEscapeGame.id).toEqual(expect.any(Number));
    });

    it(`should link it to ${escapeGame.name}`, () => {
      expect(installEscapeGame.festivalActivity).toStrictEqual(escapeGame);
    });

    it("should generate general section with default value", () => {
      expect(installEscapeGame.general.team).toBeNull();
    });

    it("should generate instructions section with default value", () => {
      const { instructions } = installEscapeGame;
      const { global, inCharge, contacts, appointment } = instructions;
      expect(global).toBeNull();
      expect(inCharge.volunteers).toStrictEqual([]);
      expect(inCharge.instruction).toBeNull();
      expect(contacts).toStrictEqual([]);
      expect(appointment).toBeNull();
    });

    it("should init feedbacks with empty list", () => {
      expect(installEscapeGame.feedbacks).toStrictEqual([]);
    });

    it("should init gearInquiries with empty list", () => {
      expect(installEscapeGame.inquiries).toStrictEqual([]);
    });

    it("should init volunteerInquiries with empty list", () => {
      expect(installEscapeGame.mobilizations).toStrictEqual([]);
    });

    it("should save it to the repository", () => {
      expect(festivalTasks.all).toContainEqual(installEscapeGame);
    });
  });

  describe("when previous task id is 419", () => {
    describe(`when ${noel.firstname} create Install escape game task`, async () => {
      const festivalTasks = new InMemoryFestivalTasks();
      const volunteerConflicts = new InMemoryVolunteerConflicts([], []);
      const translator = new FestivalTaskTranslator(volunteerConflicts);
      const create = new CreateFestivalTask(festivalTasks, translator, 420);
      const installEscapeGame = await create.apply({
        name: "Install escape game",
        festivalActivity: escapeGame,
        author: noel,
      });
      it("should skip id 420", () => {
        expect(installEscapeGame.id).toBe(421);
      });
    });
  });
});
