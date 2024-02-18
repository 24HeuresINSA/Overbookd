import { beforeEach, describe, expect, it } from "vitest";
import { EndBeforeStart } from "@overbookd/period";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { PrepareFestivalTask } from "./prepare";
import {
  MobilizationAlreadyExist,
  MobilizationNotFound,
  SplitDurationIsNotPeriodDivider,
  TeamAlreadyPartOfMobilization,
} from "../festival-task.error";
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
  saturday18hsaturday19hMobilization,
  friday10hfriday18hMobilization,
  lea,
  saturday08hsaturday11hMobilization,
  saturday12h,
  saturday9h,
  saturday7h,
  saturday8h,
  leaAvailabilities,
  noelAvailabilities,
  guardJustDance,
  serveWaterOnJustDance,
  george,
} from "../festival-task.test-util";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

describe("Prepare festival task mobilizations list", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const tasks = [
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
      guardEscapeGame,
      guardJustDance,
      serveWaterOnJustDance,
    ];
    const availabilities = [noelAvailabilities, leaAvailabilities];
    const festivalTasks = new InMemoryFestivalTasks(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(
      tasks,
      availabilities,
    );
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    prepare = new PrepareFestivalTask(festivalTasks, translator);
  });
  describe("Add mobilization", () => {
    describe("when a new mobilization is added", () => {
      it.each`
        explaination                    | task                 | form                                       | expectedMobilization
        ${"whitout team nor volunteer"} | ${installEscapeGame} | ${friday18hsaturday10hMobilization.form}   | ${friday18hsaturday10hMobilization.mobilization}
        ${"with team and volunteer"}    | ${installEscapeGame} | ${friday11hfriday18hMobilization.form}     | ${friday11hfriday18hMobilization.mobilization}
        ${"with team only"}             | ${installEscapeGame} | ${friday10hfriday18hMobilization.form}     | ${friday10hfriday18hMobilization.mobilization}
        ${"with volunteer only"}        | ${installEscapeGame} | ${saturday18hsaturday19hMobilization.form} | ${saturday18hsaturday19hMobilization.mobilization}
        ${"with team and volunteer"}    | ${guardJustDance}    | ${friday11hfriday18hMobilization.form}     | ${friday11hfriday18hMobilization.mobilization}
        ${"with team only"}             | ${guardJustDance}    | ${friday10hfriday18hMobilization.form}     | ${friday10hfriday18hMobilization.mobilization}
        ${"with volunteer only"}        | ${guardJustDance}    | ${saturday18hsaturday19hMobilization.form} | ${saturday18hsaturday19hMobilization.mobilization}
      `(
        "should add mobilization $explaination to mobilizations list",
        async ({ task, form, expectedMobilization }) => {
          const { mobilizations } = await prepare.addMobilization(
            task.id,
            form,
          );
          expect(mobilizations).toHaveLength(task.mobilizations.length + 1);
          expect(mobilizations).toContainEqual(expectedMobilization);
        },
      );

      describe("when task is under review and mobilization has not volunteer nor team requested", () => {
        it("should indicate a mobilization should have at least one volunteer or team", async () => {
          const task = guardJustDance;
          const form = friday18hsaturday10hMobilization.form;
          expect(
            async () => await prepare.addMobilization(task.id, form),
          ).rejects.toThrow(
            "Toutes les mobilisations doivent demander au moins une personne (nominativement ou via les équipes)",
          );
        });
      });

      describe.each`
        indication                       | task                 | start          | end
        ${"period with same boundaries"} | ${presentEscapeGame} | ${saturday8h}  | ${saturday11h}
        ${"larger period"}               | ${presentEscapeGame} | ${saturday7h}  | ${saturday12h}
        ${"smaller period"}              | ${presentEscapeGame} | ${saturday9h}  | ${saturday10h}
        ${"overlapping period on start"} | ${presentEscapeGame} | ${saturday7h}  | ${saturday10h}
        ${"overlapping period on start"} | ${presentEscapeGame} | ${saturday7h}  | ${saturday9h}
        ${"overlapping period on end"}   | ${presentEscapeGame} | ${saturday10h} | ${saturday12h}
      `(
        "when volunteer is requested on $indication on any mobilization",
        ({ task, start, end }) => {
          it("should list tasks that are requesting the same volunteer at the same time", async () => {
            const helper = saturday08hsaturday11hMobilization
              .withStart(start)
              .withEnd(end);
            const { mobilizations } = await prepare.addMobilization(
              task.id,
              helper.form,
            );
            const mobilization = mobilizations.find(
              (mobilization) => mobilization.id === helper.mobilization.id,
            );
            const volunteer = mobilization?.volunteers.find(
              (volunteer) => volunteer.id === lea.id,
            );
            const expectedRequestedBy = [
              {
                id: guardEscapeGame.id,
                name: guardEscapeGame.general.name,
              },
            ];
            expect(volunteer?.conflicts.tasks).toEqual(expectedRequestedBy);
            expect(
              mobilizations.flatMap(({ volunteers }) =>
                volunteers.flatMap(({ conflicts: { tasks } }) =>
                  tasks.flatMap(({ id }) => id),
                ),
              ),
            ).not.toContain(task.id);
          });
        },
      );

      describe.each`
        indication    | task                 | start          | end
        ${"previous"} | ${presentEscapeGame} | ${saturday7h}  | ${saturday8h}
        ${"next"}     | ${presentEscapeGame} | ${saturday11h} | ${saturday12h}
      `(
        "when volunteer is requested on contigous $indication period on any mobilization",
        ({ task, start, end }) => {
          it("shouldn't list it as task that are requesting the same volunteer at the same time", async () => {
            const helper = saturday08hsaturday11hMobilization
              .withStart(start)
              .withEnd(end);
            const { mobilizations } = await prepare.addMobilization(
              task.id,
              helper.form,
            );
            const mobilization = mobilizations.find(
              (mobilization) => mobilization.id === helper.mobilization.id,
            );
            const volunteer = mobilization?.volunteers.find(
              (volunteer) => volunteer.id === lea.id,
            );
            expect(volunteer?.conflicts.tasks).toEqual([]);
          });
        },
      );

      describe.each`
        indication                       | task                 | start          | end            | hasAvailabilityConflict
        ${"period with same boundaries"} | ${presentEscapeGame} | ${saturday8h}  | ${saturday11h} | ${false}
        ${"including period"}            | ${presentEscapeGame} | ${saturday9h}  | ${saturday10h} | ${false}
        ${"overlapping period"}          | ${presentEscapeGame} | ${saturday7h}  | ${saturday12h} | ${true}
        ${"overlapping period on start"} | ${presentEscapeGame} | ${saturday7h}  | ${saturday10h} | ${true}
        ${"overlapping period on end"}   | ${presentEscapeGame} | ${saturday10h} | ${saturday12h} | ${true}
      `(
        "when volunteer is requested on any mobilization and available on $indication",
        ({ task, start, end, hasAvailabilityConflict }) => {
          it(`should indicate that availability conflict is ${hasAvailabilityConflict}`, async () => {
            const helper = saturday08hsaturday11hMobilization
              .withStart(start)
              .withEnd(end);
            const { mobilizations } = await prepare.addMobilization(
              task.id,
              helper.form,
            );
            const mobilization = mobilizations.find(
              (mobilization) => mobilization.id === helper.mobilization.id,
            );
            const volunteer = mobilization?.volunteers.find(
              (volunteer) => volunteer.id === lea.id,
            );
            expect(volunteer?.conflicts.availability).toBe(
              hasAvailabilityConflict,
            );
          });
        },
      );
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
      it.each`
        taskName                              | task                     | mobilization
        ${presentEscapeGame.general.name}     | ${presentEscapeGame}     | ${presentEscapeGame.mobilizations[0]}
        ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${serveWaterOnJustDance.mobilizations[0]}
      `(
        "should remove it from $taskName mobilizations list",
        async ({ task, mobilization }) => {
          const expectedLength = task.mobilizations.length - 1;

          const { mobilizations } = await prepare.removeMobilization(
            task.id,
            mobilization.id,
          );

          expect(mobilizations).toHaveLength(expectedLength);
          expect(mobilizations).not.toContainEqual(mobilization);
        },
      );
      describe("when removing the last mobilization of an under review task", () => {
        it("should indicate that at least one mobilization is mandatory", async () => {
          const task = guardJustDance;
          const mobilization = guardJustDance.mobilizations[0];
          expect(
            async () =>
              await prepare.removeMobilization(task.id, mobilization.id),
          ).rejects.toThrow("Au moins une mobilisation est nécessaire");
        });
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
        ${["durationSplitInHours"]}                 | ${guardJustDance}    | ${{ durationSplitInHour: 1 }}                                                 | ${guardJustDance.mobilizations[0]}    | ${{ ...guardJustDance.mobilizations[0], durationSplitInHour: 1 }}
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
      it.each`
        taskName                          | task                 | mobilization                          | team
        ${presentEscapeGame.general.name} | ${presentEscapeGame} | ${presentEscapeGame.mobilizations[0]} | ${{ team: "hard", count: 2 }}
        ${guardJustDance.general.name}    | ${guardJustDance}    | ${guardJustDance.mobilizations[0]}    | ${{ team: "hard", count: 2 }}
      `(
        "should add team to $taskName mobilization",
        async ({ task, mobilization, team }) => {
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
        },
      );
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
      it.each`
        taskName                          | task                 | mobilization                          | team          | expectedTeams
        ${presentEscapeGame.general.name} | ${presentEscapeGame} | ${presentEscapeGame.mobilizations[0]} | ${"bénévole"} | ${[]}
        ${guardJustDance.general.name}    | ${guardJustDance}    | ${guardJustDance.mobilizations[0]}    | ${"bénévole"} | ${[{ team: "confiance", count: 1 }]}
      `(
        "should remove it from $taskName mobilization teams list mobilization",
        async ({ task, mobilization, team, expectedTeams }) => {
          const { mobilizations } = await prepare.removeTeamFromMobilization(
            task.id,
            mobilization.id,
            team,
          );

          const expectedMobilization = {
            ...mobilization,
            teams: expectedTeams,
          };
          expect(mobilizations).toContainEqual(expectedMobilization);
        },
      );
      describe("when removing the last team of an under review task", () => {
        it("should indicate that at least one team or one volunteer is mandatory", async () => {
          const task = serveWaterOnJustDance;
          const mobilization = serveWaterOnJustDance.mobilizations[0];
          const team = "bénévole";
          expect(
            async () =>
              await prepare.removeTeamFromMobilization(
                task.id,
                mobilization.id,
                team,
              ),
          ).rejects.toThrow(
            "Toutes les mobilisations doivent demander au moins une personne (nominativement ou via les équipes)",
          );
        });
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
      it.each`
        taskName                          | task                 | mobilization                          | volunteer
        ${presentEscapeGame.general.name} | ${presentEscapeGame} | ${presentEscapeGame.mobilizations[0]} | ${{ ...george, conflicts: { tasks: [], availability: true } }}
        ${guardJustDance.general.name}    | ${guardJustDance}    | ${guardJustDance.mobilizations[0]}    | ${{ ...george, conflicts: { tasks: [], availability: true } }}
      `(
        "should add volunteer to $taskName mobilization",
        async ({ task, mobilization, volunteer }) => {
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
        },
      );
    });
    describe("when volunteer is already part of the mobilization", () => {
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
      it.each`
        taskName                              | task                     | mobilization                              | volunteerId | expectedMobilization
        ${presentEscapeGame.general.name}     | ${presentEscapeGame}     | ${presentEscapeGame.mobilizations[0]}     | ${noel.id}  | ${{ ...presentEscapeGame.mobilizations[0], volunteers: [] }}
        ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${serveWaterOnJustDance.mobilizations[1]} | ${noel.id}  | ${{ ...serveWaterOnJustDance.mobilizations[1], volunteers: [{ ...george, conflicts: { tasks: [], availability: true } }] }}
      `(
        "should remove it from $taskName mobilization volunteers list",
        async ({ task, mobilization, volunteerId, expectedMobilization }) => {
          const { mobilizations } =
            await prepare.removeVolunteerFromMobilization(
              task.id,
              mobilization.id,
              volunteerId,
            );

          expect(mobilizations).toContainEqual(expectedMobilization);
        },
      );
      describe("when removing the last volunteer of an under review task", () => {
        it("should indicate that at least one volunteer or one team is mandatory", async () => {
          const task = serveWaterOnJustDance;
          const mobilization = serveWaterOnJustDance.mobilizations[2];
          const volunteerId = george.id;
          expect(
            async () =>
              await prepare.removeVolunteerFromMobilization(
                task.id,
                mobilization.id,
                volunteerId,
              ),
          ).rejects.toThrow(
            "Toutes les mobilisations doivent demander au moins une personne (nominativement ou via les équipes)",
          );
        });
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
