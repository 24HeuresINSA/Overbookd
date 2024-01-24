import { beforeEach, describe, expect, it } from "vitest";
import {
  installEscapeGame,
  uninstallEscapeGame,
  presentEscapeGame,
  friday11hfriday18hMobilization,
  saturday11hsaturday18hMobilization,
  noel,
  saturday19h,
  saturday10h,
  guardEscapeGame,
  friday19h,
  saturday11h,
  friday18hsaturday10hMobilization,
} from "../festival-task.test-util";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { PrepareFestivalTask } from "./prepare";
import {
  MobilizationAlreadyExist,
  MobilizationNotFound,
  SplitDurationIsNotPeriodDivider,
  TeamAlreadyPartOfMobilization,
} from "../festival-task.error";
import { TeamMobilization } from "../festival-task";
import { EndBeforeStart } from "@overbookd/period";

describe("Prepare festival task mobilizations list", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const festivalTasks = new InMemoryFestivalTasks([
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
      guardEscapeGame,
    ]);
    prepare = new PrepareFestivalTask(festivalTasks);
  });
  describe("Add mobilization", () => {
    describe("when a new mobilization is added", () => {
      it("should add mobilization to mobilizations list", async () => {
        const task = installEscapeGame;
        const { mobilizations } = await prepare.addMobilization(
          task.id,
          friday11hfriday18hMobilization.form,
        );
        expect(mobilizations).toHaveLength(task.mobilizations.length + 1);
        expect(mobilizations).toContainEqual(
          friday11hfriday18hMobilization.mobilization,
        );
      });
    });
    describe("with split duration that is not period divider", () => {
      describe("when trying to add this as mobilization", () => {
        it("should indicate that split duration doesn't match period duration", async () => {
          const task = installEscapeGame;
          const mobilization =
            friday11hfriday18hMobilization.withDurationSplit(2);
          expect(
            async () =>
              await prepare.addMobilization(task.id, mobilization.form),
          ).rejects.toThrow(SplitDurationIsNotPeriodDivider);
        });
      });
    });
    describe("when adding several mobilizations in a row", () => {
      it("should add all mobilizations to mobilizations list", async () => {
        const task = installEscapeGame;
        await prepare.addMobilization(
          task.id,
          friday11hfriday18hMobilization.form,
        );
        const { mobilizations } = await prepare.addMobilization(
          task.id,
          saturday11hsaturday18hMobilization.form,
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
              saturday11hsaturday18hMobilization.form,
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
  describe("Update mobilization", () => {
    describe("when updating an existing mobilization", () => {
      describe.each`
        fields                                      | task                 | update                                                                        | currentMobilization                   | expectedMobilization
        ${["durationSplitInHours"]}                 | ${presentEscapeGame} | ${{ durationSplitInHour: 1 }}                                                 | ${presentEscapeGame.mobilizations[0]} | ${{ ...presentEscapeGame.mobilizations[0], durationSplitInHour: 1 }}
        ${["end"]}                                  | ${presentEscapeGame} | ${{ end: saturday19h.date }}                                                  | ${presentEscapeGame.mobilizations[0]} | ${{ ...presentEscapeGame.mobilizations[0], end: saturday19h.date, id: "28600380-28600860" }}
        ${["start"]}                                | ${presentEscapeGame} | ${{ start: saturday10h.date }}                                                | ${presentEscapeGame.mobilizations[0]} | ${{ ...presentEscapeGame.mobilizations[0], start: saturday10h.date, id: "28600320-28600800" }}
        ${["start", "durationSplitInHours"]}        | ${presentEscapeGame} | ${{ start: saturday10h.date, durationSplitInHour: 1 }}                        | ${presentEscapeGame.mobilizations[0]} | ${{ ...presentEscapeGame.mobilizations[0], start: saturday10h.date, id: "28600320-28600800", durationSplitInHour: 1 }}
        ${["start", "end", "durationSplitInHours"]} | ${presentEscapeGame} | ${{ start: saturday10h.date, durationSplitInHour: 3, end: saturday19h.date }} | ${presentEscapeGame.mobilizations[0]} | ${{ ...presentEscapeGame.mobilizations[0], start: saturday10h.date, end: saturday19h.date, id: "28600320-28600860", durationSplitInHour: 3 }}
      `(
        "when updating $fields with valid data",
        ({
          fields,
          task,
          update,
          currentMobilization,
          expectedMobilization,
        }) => {
          it(`should only update ${fields} on ${task.general.name}`, async () => {
            const { mobilizations } = await prepare.updateMobilization(
              task.id,
              currentMobilization.id,
              update,
            );
            expect(mobilizations).toContainEqual(expectedMobilization);
            expect(mobilizations).toHaveLength(task.mobilizations.length);
          });
        },
      );
      describe("when updating with split duration that is not period divider", () => {
        it.each`
          task                 | update                        | mobilization
          ${presentEscapeGame} | ${{ durationSplitInHour: 2 }} | ${presentEscapeGame.mobilizations[0]}
          ${guardEscapeGame}   | ${{ start: friday19h.date }}  | ${guardEscapeGame.mobilizations[0]}
          ${guardEscapeGame}   | ${{ end: saturday11h.date }}  | ${guardEscapeGame.mobilizations[0]}
        `(
          "should indicate that split duration doesn't match period duration",
          async ({ task, update, mobilization }) => {
            expect(
              async () =>
                await prepare.updateMobilization(
                  task.id,
                  mobilization.id,
                  update,
                ),
            ).rejects.toThrow(SplitDurationIsNotPeriodDivider);
          },
        );
      });
      describe("when updating with wrong period boundary", () => {
        it.each`
          task                 | update                         | mobilization
          ${presentEscapeGame} | ${{ start: saturday19h.date }} | ${presentEscapeGame.mobilizations[0]}
          ${presentEscapeGame} | ${{ end: saturday10h.date }}   | ${presentEscapeGame.mobilizations[0]}
        `(
          "should indicate that period is not valid",
          async ({ task, update, mobilization }) => {
            expect(
              async () =>
                await prepare.updateMobilization(
                  task.id,
                  mobilization.id,
                  update,
                ),
            ).rejects.toThrow(EndBeforeStart);
          },
        );
      });
    });
    describe("when updating an inexisting mobilization", () => {
      it("should indicate that mobilization is not found", async () => {
        const task = presentEscapeGame;
        const mobilizationId = friday18hsaturday10hMobilization.mobilization.id;
        const update = { durationSplitInHour: null };

        expect(
          async () =>
            await prepare.updateMobilization(task.id, mobilizationId, update),
        ).rejects.toThrow(MobilizationNotFound);
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
