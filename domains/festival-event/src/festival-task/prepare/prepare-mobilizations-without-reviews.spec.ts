import { beforeEach, describe, expect, it } from "vitest";
import { EndBeforeStart } from "@overbookd/time";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory.js";
import { PrepareFestivalTask } from "./prepare.js";
import {
  MobilizationAlreadyExist,
  MobilizationNotFound,
  SplitDurationIsNotPeriodDivider,
} from "../festival-task.error.js";
import {
  friday11hfriday18hMobilization,
  saturday11hsaturday18hMobilization,
  noel,
  saturday19h,
  saturday10h,
  friday19h,
  saturday11h,
  friday18hsaturday10hMobilization,
  saturday18hsaturday19hMobilization,
  friday10hfriday18hMobilization,
  lea,
  saturday08hsaturday11hMobilization,
  saturday12h,
  saturday09h,
  saturday07h,
  saturday08h,
  leaAvailabilities,
  noelAvailabilities,
  george,
  requestGabMobilization,
  gab,
  saturday14h,
} from "../festival-task.test-util.js";
import {
  gabIsAssignedTo,
  installEscapeGame,
  uninstallEscapeGame,
} from "../festival-task.fake.js";
import {
  presentEscapeGame,
  guardEscapeGame,
  guardJustDance,
  serveWaterOnJustDance,
  installBarbecue,
  uninstallBarbecue,
} from "../festival-task.fake.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";

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
      installBarbecue,
      uninstallBarbecue,
      gabIsAssignedTo,
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
            noel,
          );
          expect(mobilizations).toHaveLength(task.mobilizations.length + 1);
          expect(mobilizations).toContainEqual(expectedMobilization);
        },
      );
      describe.each`
        taskName                        | taskStatus                | task               | mobilization
        ${guardJustDance.general.name}  | ${guardJustDance.status}  | ${guardJustDance}  | ${friday18hsaturday10hMobilization}
        ${installBarbecue.general.name} | ${installBarbecue.status} | ${installBarbecue} | ${friday18hsaturday10hMobilization}
      `(
        "when $taskName task is $taskStatus and mobilization has not volunteer nor team requested",
        ({ task, mobilization }) => {
          it("should indicate a mobilization should have at least one volunteer or team", async () => {
            expect(
              async () =>
                await prepare.addMobilization(task.id, mobilization.form, noel),
            ).rejects.toThrow(
              "Toutes les mobilisations doivent demander au moins une personne (nominativement ou via les équipes)",
            );
          });
        },
      );
      describe.each`
        indication                       | task                 | start          | end
        ${"period with same boundaries"} | ${presentEscapeGame} | ${saturday08h} | ${saturday11h}
        ${"larger period"}               | ${presentEscapeGame} | ${saturday07h} | ${saturday12h}
        ${"smaller period"}              | ${presentEscapeGame} | ${saturday09h} | ${saturday10h}
        ${"overlapping period on start"} | ${presentEscapeGame} | ${saturday07h} | ${saturday10h}
        ${"overlapping period on start"} | ${presentEscapeGame} | ${saturday07h} | ${saturday09h}
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
              noel,
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
        indication                       | task                 | start          | end
        ${"period with same boundaries"} | ${presentEscapeGame} | ${saturday08h} | ${saturday12h}
        ${"larger period"}               | ${presentEscapeGame} | ${saturday07h} | ${saturday14h}
        ${"smaller period"}              | ${presentEscapeGame} | ${saturday09h} | ${saturday11h}
        ${"overlapping period on start"} | ${presentEscapeGame} | ${saturday07h} | ${saturday09h}
        ${"overlapping period on end"}   | ${presentEscapeGame} | ${saturday11h} | ${saturday14h}
      `(
        "when volunteer is assigned on $indication on any assignment",
        ({ task, start, end }) => {
          it("should list tasks that are requesting the same volunteer at the same time", async () => {
            const helper = requestGabMobilization.withStart(start).withEnd(end);
            const { mobilizations } = await prepare.addMobilization(
              task.id,
              helper.form,
              noel,
            );
            const mobilization = mobilizations.find(
              (mobilization) => mobilization.id === helper.mobilization.id,
            );
            const volunteer = mobilization?.volunteers.find(
              (volunteer) => volunteer.id === gab.id,
            );
            const assignedOn = [
              {
                id: gabIsAssignedTo.id,
                name: gabIsAssignedTo.general.name,
              },
            ];
            expect(volunteer?.conflicts.assignments).toEqual(assignedOn);
          });
        },
      );

      describe.each`
        indication    | task                 | start          | end
        ${"previous"} | ${presentEscapeGame} | ${saturday07h} | ${saturday08h}
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
              noel,
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
        ${"period with same boundaries"} | ${presentEscapeGame} | ${saturday08h} | ${saturday11h} | ${false}
        ${"including period"}            | ${presentEscapeGame} | ${saturday09h} | ${saturday10h} | ${false}
        ${"overlapping period"}          | ${presentEscapeGame} | ${saturday07h} | ${saturday12h} | ${true}
        ${"overlapping period on start"} | ${presentEscapeGame} | ${saturday07h} | ${saturday10h} | ${true}
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
              noel,
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
              await prepare.addMobilization(task.id, mobilization.form, noel),
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
          noel,
        );
        const { mobilizations } = await prepare.addMobilization(
          task.id,
          saturday11hsaturday18hMobilization.form,
          noel,
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
              noel,
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
            noel,
          );

          expect(mobilizations).toHaveLength(expectedLength);
          expect(mobilizations).not.toContainEqual(mobilization);
        },
      );
      describe.each`
        taskName                          | taskStatus                  | task                 | mobilization
        ${guardJustDance.general.name}    | ${guardJustDance.status}    | ${guardJustDance}    | ${guardJustDance.mobilizations[0]}
        ${uninstallBarbecue.general.name} | ${uninstallBarbecue.status} | ${uninstallBarbecue} | ${uninstallBarbecue.mobilizations[0]}
      `(
        "when removing the last mobilization of $taskName task with status $taskStatus",
        ({ task, mobilization }) => {
          it("should indicate that at least one mobilization is mandatory", async () => {
            expect(
              async () =>
                await prepare.removeMobilization(
                  task.id,
                  mobilization.id,
                  noel,
                ),
            ).rejects.toThrow("Au moins une mobilisation est nécessaire");
          });
        },
      );
    });
    describe("when removing an unexisting mobilization", () => {
      it("should keep mobilizations list unchanged", async () => {
        const task = presentEscapeGame;
        const mobilizationId = "1234567-2458204";

        const { mobilizations } = await prepare.removeMobilization(
          task.id,
          mobilizationId,
          noel,
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
              noel,
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
                  noel,
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
                  noel,
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
            await prepare.updateMobilization(
              task.id,
              mobilizationId,
              update,
              noel,
            ),
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
      it.each`
        taskName                          | task                 | mobilization                          | team                               | expectedTeams
        ${presentEscapeGame.general.name} | ${presentEscapeGame} | ${presentEscapeGame.mobilizations[0]} | ${{ team: "bénévole", count: 1 }}  | ${[{ team: "bénévole", count: 1 }]}
        ${guardJustDance.general.name}    | ${guardJustDance}    | ${guardJustDance.mobilizations[0]}    | ${{ team: "confiance", count: 5 }} | ${[{ count: 2, team: "bénévole" }, { team: "confiance", count: 5 }]}
      `(
        "should override team to $taskName mobilization",
        async ({ task, mobilization, team, expectedTeams }) => {
          const { mobilizations } = await prepare.addTeamToMobilization(
            task.id,
            mobilization.id,
            team,
          );

          const mergedMobilization = { ...mobilization, teams: expectedTeams };
          expect(mobilizations).toContainEqual(mergedMobilization);
        },
      );
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
      describe.each`
        taskName                              | taskStatus                      | task                     | mobilization                              | team
        ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance.status} | ${serveWaterOnJustDance} | ${serveWaterOnJustDance.mobilizations[0]} | ${"bénévole"}
        ${installBarbecue.general.name}       | ${installBarbecue.status}       | ${installBarbecue}       | ${installBarbecue.mobilizations[1]}       | ${"vieux"}
      `(
        "when removing the last team of a $taskName task with status $taskStatus",
        ({ task, mobilization, team }) => {
          it("should indicate that at least one team or one volunteer is mandatory", async () => {
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
        },
      );
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
        ${presentEscapeGame.general.name} | ${presentEscapeGame} | ${presentEscapeGame.mobilizations[0]} | ${{ ...george, conflicts: { tasks: [], availability: true, assignments: [] } }}
        ${guardJustDance.general.name}    | ${guardJustDance}    | ${guardJustDance.mobilizations[0]}    | ${{ ...george, conflicts: { tasks: [], availability: true, assignments: [] } }}
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
        ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${serveWaterOnJustDance.mobilizations[1]} | ${noel.id}  | ${{ ...serveWaterOnJustDance.mobilizations[1], volunteers: [{ ...george, conflicts: { tasks: [], availability: true, assignments: [] } }] }}
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
      describe.each`
        taskName                              | taskStatus                      | task                     | mobilization                              | volunteer
        ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance.status} | ${serveWaterOnJustDance} | ${serveWaterOnJustDance.mobilizations[2]} | ${george}
        ${installBarbecue.general.name}       | ${installBarbecue.status}       | ${installBarbecue}       | ${installBarbecue.mobilizations[0]}       | ${george}
      `(
        "when removing the last volunteer of a $taskName task with status $taskStatus",
        ({ task, mobilization, volunteer }) => {
          it("should indicate that at least one team or one volunteer is mandatory", async () => {
            expect(
              async () =>
                await prepare.removeVolunteerFromMobilization(
                  task.id,
                  mobilization.id,
                  volunteer.id,
                ),
            ).rejects.toThrow(
              "Toutes les mobilisations doivent demander au moins une personne (nominativement ou via les équipes)",
            );
          });
        },
      );
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
