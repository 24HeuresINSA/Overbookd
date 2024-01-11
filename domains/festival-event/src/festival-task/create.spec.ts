import { describe, expect, it } from "vitest";
import { numberGenerator } from "@overbookd/list";
import { PreviewFestivalActivity } from "../preview/festival-activity";
import { Feedback } from "../common/feedback";
import { CREATED, APPROVED } from "../common/action";
import { DRAFT, VALIDATED } from "../common/status";
import { Adherent } from "../common/adherent";

const noel = {
  id: 1,
  lastname: "Ertsemud",
  firstname: "Noel",
};

const escapeGame: PreviewFestivalActivity = {
  id: 1,
  name: "Escape game",
  status: VALIDATED,
  adherent: noel,
  team: "plaizir",
  reviews: {
    humain: APPROVED,
    signa: APPROVED,
    secu: APPROVED,
    matos: APPROVED,
    elec: APPROVED,
    barrieres: APPROVED,
    communication: APPROVED,
  },
};

type FestivalTaskCreation = {
  name: string;
  festivalActivity: PreviewFestivalActivity;
  author: Adherent;
};

const FT_420 = 420;

type Contact = Adherent & {
  phone: string;
};

type KeyEvent = {
  action: typeof CREATED;
  by: Adherent;
  at: Date;
  description: string;
};

type Draft = {
  id: number;
  status: typeof DRAFT;
  name: string;
  festivalActivity: PreviewFestivalActivity;
  inCharge: {
    administrator: Adherent;
    adherents: Adherent[];
    team: string | null;
    contacts: Contact[];
  };
  instructions: {
    global: string | null;
    adherentsInCharge: string | null;
  };
  history: KeyEvent[];
  feedbacks: Feedback[];
  volunteerInquiries: unknown[];
  gearInquiries: unknown[];
};

class FestivalTaskKeyEvents {
  static created(by: Adherent): KeyEvent {
    const at = this.computeAt();
    return { action: CREATED, by, at, description: "FT créée" };
  }
  private static computeAt() {
    const at = new Date();
    at.setMilliseconds(0);
    return at;
  }
}

type FestivalTasks = {
  add(festivalTask: Draft): Promise<Draft>;
};

class CreateFestivalTask {
  private idGenerator: Generator<number>;

  constructor(
    private readonly festivalTasks: FestivalTasks,
    startId: number = 1,
  ) {
    this.idGenerator = numberGenerator(startId, [FT_420]);
  }

  async apply({
    name,
    author,
    festivalActivity,
  }: FestivalTaskCreation): Promise<Draft> {
    const festivalTask: Draft = {
      name,
      id: this.generateId(),
      status: DRAFT,
      festivalActivity,
      inCharge: {
        administrator: author,
        adherents: [],
        team: null,
        contacts: [],
      },
      instructions: {
        global: null,
        adherentsInCharge: null,
      },
      history: [FestivalTaskKeyEvents.created(noel)],
      feedbacks: [],
      volunteerInquiries: [],
      gearInquiries: [],
    };

    return this.festivalTasks.add(festivalTask);
  }

  private generateId(): number {
    return this.idGenerator.next().value;
  }
}

class InMemoryFestivalTasks implements FestivalTasks {
  constructor(private festivalTasks: Draft[] = []) {}

  add(festivalTask: Draft): Promise<Draft> {
    this.festivalTasks = [...this.festivalTasks, festivalTask];
    return Promise.resolve(festivalTask);
  }

  get all(): Draft[] {
    return this.festivalTasks;
  }
}

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
      expect(intsallEscapeGame.name).toBe("Install escape game");
    });

    it("should set Noel as administrator of it", () => {
      expect(intsallEscapeGame.inCharge.administrator).toEqual(noel);
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

    it("should generate in charge section with default value", () => {
      expect(intsallEscapeGame.inCharge.adherents).toStrictEqual([]);
      expect(intsallEscapeGame.inCharge.team).toBeNull();
      expect(intsallEscapeGame.inCharge.contacts).toStrictEqual([]);
    });

    it("should generate instructions section with default value", () => {
      expect(intsallEscapeGame.instructions.global).toBeNull();
      expect(intsallEscapeGame.instructions.adherentsInCharge).toBeNull();
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
