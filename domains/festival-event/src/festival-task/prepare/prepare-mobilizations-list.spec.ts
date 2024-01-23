import { beforeEach, describe, expect, it } from "vitest";
import {
  installEscapeGame,
  uninstallEscapeGame,
  presentEscapeGame,
  friday11hfriday18hMobilization,
  saturday11hsaturday18hMobilization,
  noel,
} from "../festival-task.test-util";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { PrepareFestivalTask } from "./prepare";
import {
  MobilizationAlreadyExist,
  SplitDurationIsNotPeriodDivider,
  TeamAlreadyPartOfMobilization,
} from "../festival-task.error";
import { TeamMobilization } from "../festival-task";

describe("Prepare festival task mobilizations list", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const festivalTasks = new InMemoryFestivalTasks([
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
    ]);
    prepare = new PrepareFestivalTask(festivalTasks);
  });
  describe("Add mobilization", () => {
    describe("when a new mobilization is added", () => {
      it("should add mobilization to mobilizations list", async () => {
        const task = installEscapeGame;
        const { mobilizations } = await prepare.addMobilization(
          task.id,
          friday11hfriday18hMobilization,
        );
        expect(mobilizations).toHaveLength(task.mobilizations.length + 1);
        expect(mobilizations).toContainEqual({
          ...friday11hfriday18hMobilization,
          id: expect.any(String),
        });
      });
    });
    describe("with split duration that is not period divider", () => {
      describe("when trying to add this as mobilization", () => {
        it("should indicate that split duration doesn't match period duration", async () => {
          const task = installEscapeGame;
          expect(
            async () =>
              await prepare.addMobilization(task.id, {
                ...friday11hfriday18hMobilization,
                durationSplitInHour: 2,
              }),
          ).rejects.toThrow(SplitDurationIsNotPeriodDivider);
        });
      });
    });
    describe("when adding several mobilizations in a row", () => {
      it("should add all mobilizations to mobilizations list", async () => {
        const task = installEscapeGame;
        await prepare.addMobilization(task.id, friday11hfriday18hMobilization);
        const { mobilizations } = await prepare.addMobilization(
          task.id,
          saturday11hsaturday18hMobilization,
        );
        expect(mobilizations).toHaveLength(2);
      });
    });
    describe("when adding a mobilization for the same period than an existing one", () => {
      it("should indicate an existing mobilization exist on the same period", async () => {
        const task = presentEscapeGame;
        expect(
          async () =>
            await prepare.addMobilization(
              task.id,
              saturday11hsaturday18hMobilization,
            ),
        ).rejects.toThrow(MobilizationAlreadyExist);
      });
    });
  });
  describe("Remove mobilization", () => {
    describe("when removing an existing mobilization", () => {
      it("should remove it from mobilizations list", async () => {
        const task = presentEscapeGame;
        const mobilization = task.mobilizations[0];
        const expectedLength = task.mobilizations.length - 1;

        const { mobilizations } = await prepare.removeMobilization(
          task.id,
          mobilization.id,
        );

        expect(mobilizations).toHaveLength(expectedLength);
        expect(mobilizations).not.toContainEqual(mobilization);
      });
    });
    describe("when removing an unexisting mobilization", () => {
      it("should keep mobilizations list unchanged", async () => {
        const task = presentEscapeGame;
        const mobilizationId = "1234567-2458204";

        const { mobilizations } = await prepare.removeMobilization(
          task.id,
          mobilizationId,
        );

        expect(mobilizations).toStrictEqual(task.mobilizations);
      });
    });
  });
  describe("Add team to existing mobilization", () => {
    describe("when team is not yet part of the mobilization", () => {
      it("should add team to the mobilization", async () => {
        const task = presentEscapeGame;
        const mobilization = presentEscapeGame.mobilizations[0];
        const team = { team: "hard", count: 2 };

        const { mobilizations } = await prepare.addTeamToMobilization(
          task.id,
          mobilization.id,
          team,
        );

        const mergedMobilization = {
          ...mobilization,
          teams: [...mobilization.teams, team],
        };
        expect(mobilizations).toContainEqual(mergedMobilization);
      });
    });
    describe("when team is already part of the mobilization", () => {
      it("should indicate that team is already part of the mobilization", async () => {
        const task = presentEscapeGame;
        const mobilization = task.mobilizations[0];
        const team = { team: "bénévole", count: 5 };

        expect(
          async () =>
            await prepare.addTeamToMobilization(task.id, mobilization.id, team),
        ).rejects.toThrow(TeamAlreadyPartOfMobilization);
      });
    });
  });
  describe("Remove team from existing mobilization", () => {
    describe("when team is part of the mobilization", () => {
      it("should remove it from mobilization teams list mobilization", async () => {
        const task = presentEscapeGame;
        const mobilization = presentEscapeGame.mobilizations[0];
        const teams: TeamMobilization[] = [];
        const team = "bénévole";

        const { mobilizations } = await prepare.removeTeamFromMobilization(
          task.id,
          mobilization.id,
          team,
        );

        const expectedMobilization = { ...mobilization, teams };
        expect(mobilizations).toContainEqual(expectedMobilization);
      });
    });
    describe("when team is not part of the mobilization", () => {
      it("should keep mobilization unchanged", async () => {
        const task = presentEscapeGame;
        const mobilization = task.mobilizations[0];
        const team = "hard";

        const { mobilizations } = await prepare.removeTeamFromMobilization(
          task.id,
          mobilization.id,
          team,
        );

        expect(mobilizations).toContainEqual(mobilization);
      });
    });
  });
  describe("Add volunteer to existing mobilization", () => {
    describe("when volunteer is not yet part of the mobilization", () => {
      it("should add volunteer to the mobilization", async () => {
        const task = presentEscapeGame;
        const mobilization = presentEscapeGame.mobilizations[0];
        const volunteer = {
          firstname: "Georges",
          lastname: "Hette",
          nickname: "gh",
          id: 100,
        };

        const { mobilizations } = await prepare.addVolunteerToMobilization(
          task.id,
          mobilization.id,
          volunteer,
        );

        const mergedMobilization = {
          ...mobilization,
          volunteers: [...mobilization.volunteers, volunteer],
        };
        expect(mobilizations).toContainEqual(mergedMobilization);
      });
    });
    describe("when volunteer is alredy part of the mobilization", () => {
      it("should keep mobilization unchanged", async () => {
        const task = presentEscapeGame;
        const mobilization = presentEscapeGame.mobilizations[0];
        const volunteer = noel;

        const { mobilizations } = await prepare.addVolunteerToMobilization(
          task.id,
          mobilization.id,
          volunteer,
        );
        expect(mobilizations).toStrictEqual(task.mobilizations);
      });
    });
  });
  describe("Remove volunteer from existing mobilization", () => {
    describe("when volunteer is part of the mobilization", () => {
      it("should remove it from mobilization volunteers list", async () => {
        const task = presentEscapeGame;
        const mobilization = task.mobilizations[0];
        const volunteerId = noel.id;
        const expectedMobilization = { ...mobilization, volunteers: [] };

        const { mobilizations } = await prepare.removeVolunteerFromMobilization(
          task.id,
          mobilization.id,
          volunteerId,
        );

        expect(mobilizations).toContainEqual(expectedMobilization);
      });
    });
    describe("when volunteer is not part of the mobilization", () => {
      it("should keep mobilization unchanged", async () => {
        const task = presentEscapeGame;
        const mobilization = task.mobilizations[0];
        const volunteerId = -1;

        const { mobilizations } = await prepare.removeVolunteerFromMobilization(
          task.id,
          mobilization.id,
          volunteerId,
        );

        expect(mobilizations).toContainEqual(mobilization);
      });
    });
  });
});
