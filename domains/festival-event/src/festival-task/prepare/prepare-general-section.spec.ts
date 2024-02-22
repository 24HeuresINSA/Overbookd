import { beforeEach, describe, expect, it } from "vitest";
import {
  guardJustDance,
  installEscapeGame,
  lea,
  noel,
  presentEscapeGame,
  uninstallEscapeGame,
  animateEscapeGame,
} from "../festival-task.test-util";
import { FestivalTaskNotFound } from "../festival-task.error";
import { PrepareFestivalTask } from "./prepare";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

describe("Prepare festival task general section", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const tasks = [
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
      guardJustDance,
      animateEscapeGame,
    ];
    const festivalTasks = new InMemoryFestivalTasks(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    prepare = new PrepareFestivalTask(festivalTasks, translator);
  });
  describe.each`
    fields                            | taskName                            | taskId                    | update                                                                                     | name                                         | administrator                                | team
    ${"name"}                         | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ name: "Install escape game on friday" }}                                               | ${"Install escape game on friday"}           | ${installEscapeGame.general.administrator}   | ${installEscapeGame.general.team}
    ${"name"}                         | ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${{ name: "Uninstall escape game on sunday" }}                                             | ${"Uninstall escape game on sunday"}         | ${uninstallEscapeGame.general.administrator} | ${uninstallEscapeGame.general.team}
    ${"administrator"}                | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ administrator: lea }}                                                                  | ${installEscapeGame.general.name}            | ${lea}                                       | ${installEscapeGame.general.team}
    ${"administrator"}                | ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${{ administrator: lea }}                                                                  | ${uninstallEscapeGame.general.name}          | ${lea}                                       | ${uninstallEscapeGame.general.team}
    ${"team"}                         | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ team: "sports" }}                                                                      | ${installEscapeGame.general.name}            | ${installEscapeGame.general.administrator}   | ${"sports"}
    ${"team"}                         | ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${{ team: "sports" }}                                                                      | ${uninstallEscapeGame.general.name}          | ${uninstallEscapeGame.general.administrator} | ${"sports"}
    ${"team"}                         | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ team: null }}                                                                          | ${presentEscapeGame.general.name}            | ${presentEscapeGame.general.administrator}   | ${null}
    ${"name and team"}                | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ team: null, name: "Present escape game on saturday" }}                                 | ${"Present escape game on saturday"}         | ${presentEscapeGame.general.administrator}   | ${null}
    ${"name and administrator"}       | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ name: "Present escape game on saturday", administrator: lea }}                         | ${"Present escape game on saturday"}         | ${lea}                                       | ${presentEscapeGame.general.team}
    ${"name, administrator and team"} | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ name: "Install escape game on saturday", administrator: lea, team: "plaizir" }}        | ${"Install escape game on saturday"}         | ${lea}                                       | ${"plaizir"}
    ${"name"}                         | ${guardJustDance.general.name}      | ${guardJustDance.id}      | ${{ name: "Guard just dance on friday and saturday" }}                                     | ${"Guard just dance on friday and saturday"} | ${noel}                                      | ${"plaizir"}
    ${"name, administrator and team"} | ${guardJustDance.general.name}      | ${guardJustDance.id}      | ${{ name: "Guard just dance on friday and saturday", administrator: lea, team: "humain" }} | ${"Guard just dance on friday and saturday"} | ${lea}                                       | ${"humain"}
  `(
    "when updating $fields from $taskName",
    ({ fields, taskId, update, name, administrator, team }) => {
      it(`should only update ${fields}`, async () => {
        const { general } = await prepare.updateGeneralSection(taskId, update);

        expect(general.name).toBe(name);
        expect(general.administrator).toStrictEqual(administrator);
        expect(general.team).toBe(team);
      });
    },
  );
  describe("when trying to clear mandatory field of an in review task", () => {
    it("should indicate the mandatory field is required", async () => {
      const update = { team: null };
      expect(
        async () =>
          await prepare.updateGeneralSection(guardJustDance.id, update),
      ).rejects.toThrow("Une équipe responsable est nécessaire");
    });
  });
  describe("when trying to update field of a refused task", () => {
    it("should update field", async () => {
      const name = "Refused FT";
      const { general } = await prepare.updateGeneralSection(
        animateEscapeGame.id,
        { name },
      );

      expect(general.name).toBe(name);
    });
  });
  describe("when trying to update an unexisting task", () => {
    it("should indicate task not found", async () => {
      expect(
        async () => await prepare.updateGeneralSection(10000, { name: "Test" }),
      ).rejects.toThrow(FestivalTaskNotFound);
    });
  });
  describe("Several update on same task", () => {
    describe("when updating name then team consecutively", () => {
      it("should update both name and team", async () => {
        const updateName = { name: "Install escape game on friday" };
        const updateTeam = { team: "plaizir" };
        await prepare.updateGeneralSection(installEscapeGame.id, updateName);
        const { general } = await prepare.updateGeneralSection(
          installEscapeGame.id,
          updateTeam,
        );

        expect(general.name).toBe(updateName.name);
        expect(general.team).toBe(updateTeam.team);
      });
    });
  });
});
