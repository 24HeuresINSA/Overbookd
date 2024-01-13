import { describe, expect, it } from "vitest";
import { CREATED } from "../common/action";
import { DRAFT, VALIDATED } from "../common/status";
import { FestivalActivity } from "./festival-task";
import { CreateFestivalTask } from "./create";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { TimeWindow } from "../festival-activity/sections/time-window";
import { InquiryRequest } from "../common/inquiry-request";

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const friday10hfriday19h: TimeWindow = {
  start: new Date("2024-05-17T10:00+02:00"),
  end: new Date("2024-05-17T19:00+02:00"),
  id: "28598880-28599420",
};
const friday11hfriday18h: TimeWindow = {
  start: new Date("2024-05-17T11:00+02:00"),
  end: new Date("2024-05-17T18:00+02:00"),
  id: "28598940-28599360",
};

const deuxTables: InquiryRequest = {
  name: "Table",
  slug: "table",
  quantity: 2,
};

const escapeGame: FestivalActivity = {
  id: 1,
  name: "Escape game",
  status: VALIDATED,
  timeWindows: [friday11hfriday18h],
  inquiry: {
    timeWindows: [friday10hfriday19h],
    all: [deuxTables],
  },
};

describe("Create festival task", () => {
  describe(`when ${noel.firstname} create Install escape game task`, async () => {
    const festivalTasks = new InMemoryFestivalTasks();
    const create = new CreateFestivalTask(festivalTasks);
    const intsallEscapeGame = await create.apply({
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
      expect(intsallEscapeGame.general.name).toBe("Install escape game");
    });

    it("should set Noel as administrator of it", () => {
      expect(intsallEscapeGame.general.administrator).toEqual(noel);
    });

    it("should init history with CREATED key event", () => {
      expect(intsallEscapeGame.history).toContainEqual(createdEvent);
    });

    it(`should set the status to ${DRAFT}`, () => {
      expect(intsallEscapeGame.status).toBe(DRAFT);
    });

    it("should generate an id", () => {
      expect(intsallEscapeGame.id).toEqual(expect.any(Number));
    });

    it(`should link it to ${escapeGame.name}`, () => {
      expect(intsallEscapeGame.festivalActivity).toStrictEqual(escapeGame);
    });

    it("should generate general section with default value", () => {
      expect(intsallEscapeGame.general.team).toBeNull();
    });

    it("should generate instructions section with default value", () => {
      const { instructions } = intsallEscapeGame;
      const { global, inCharge, contacts, appointment } = instructions;
      expect(global).toBeNull();
      expect(inCharge.adherents).toStrictEqual([]);
      expect(inCharge.instruction).toBeNull();
      expect(contacts).toStrictEqual([]);
      expect(appointment).toBeNull();
    });

    it("should init feedbacks with empty list", () => {
      expect(intsallEscapeGame.feedbacks).toStrictEqual([]);
    });

    it("should init gearInquiries with empty list", () => {
      expect(intsallEscapeGame.gearInquiries).toStrictEqual([]);
    });

    it("should init volunteerInquiries with empty list", () => {
      expect(intsallEscapeGame.volunteerInquiries).toStrictEqual([]);
    });

    it("should save it to the repository", () => {
      expect(festivalTasks.all).toContainEqual(intsallEscapeGame);
    });
  });

  describe("when previous task id is 419", () => {
    describe(`when ${noel.firstname} create Install escape game task`, async () => {
      const festivalTasks = new InMemoryFestivalTasks();
      const create = new CreateFestivalTask(festivalTasks, 420);
      const intsallEscapeGame = await create.apply({
        name: "Install escape game",
        festivalActivity: escapeGame,
        author: noel,
      });
      it("should skip id 420", () => {
        expect(intsallEscapeGame.id).toBe(421);
      });
    });
  });
});
