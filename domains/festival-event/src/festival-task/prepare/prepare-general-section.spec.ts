import { beforeEach, describe, expect, it } from "vitest";
import {
  installEscapeGame,
  lea,
  presentEscapeGame,
  uninstallEscapeGame,
} from "../festival-task.test-util";
import { FestivalTaskNotFound } from "../festival-task.error";
import { PrepareFestivalTask } from "./prepare";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";

describe("Prepare festival task general section", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const festivalTasks = new InMemoryFestivalTasks([
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
    ]);
    prepare = new PrepareFestivalTask(festivalTasks);
  });
  describe.each`
    fields                            | taskName                            | taskId                    | update                                                                              | name                                 | administrator                                | team
    ${"name"}                         | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ name: "Install escape game on friday" }}                                        | ${"Install escape game on friday"}   | ${installEscapeGame.general.administrator}   | ${installEscapeGame.general.team}
    ${"name"}                         | ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${{ name: "Uninstall escape game on sunday" }}                                      | ${"Uninstall escape game on sunday"} | ${uninstallEscapeGame.general.administrator} | ${uninstallEscapeGame.general.team}
    ${"administrator"}                | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ administrator: lea }}                                                           | ${installEscapeGame.general.name}    | ${lea}                                       | ${installEscapeGame.general.team}
    ${"administrator"}                | ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${{ administrator: lea }}                                                           | ${uninstallEscapeGame.general.name}  | ${lea}                                       | ${uninstallEscapeGame.general.team}
    ${"team"}                         | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ team: "sports" }}                                                               | ${installEscapeGame.general.name}    | ${installEscapeGame.general.administrator}   | ${"sports"}
    ${"team"}                         | ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${{ team: "sports" }}                                                               | ${uninstallEscapeGame.general.name}  | ${uninstallEscapeGame.general.administrator} | ${"sports"}
    ${"team"}                         | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ team: null }}                                                                   | ${presentEscapeGame.general.name}    | ${presentEscapeGame.general.administrator}   | ${null}
    ${"name and team"}                | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ team: null, name: "Present escape game on saturday" }}                          | ${"Present escape game on saturday"} | ${presentEscapeGame.general.administrator}   | ${null}
    ${"name and administrator"}       | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ name: "Present escape game on saturday", administrator: lea }}                  | ${"Present escape game on saturday"} | ${lea}                                       | ${presentEscapeGame.general.team}
    ${"name, administrator and team"} | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ name: "Install escape game on saturday", administrator: lea, team: "plaizir" }} | ${"Install escape game on saturday"} | ${lea}                                       | ${"plaizir"}
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
