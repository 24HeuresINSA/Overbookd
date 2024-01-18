import { beforeEach, describe, expect, it } from "vitest";
import {
  humaGrass,
  installEscapeGame,
  lea,
  leaContact,
  noel,
  noelContact,
  presentEscapeGame,
  uninstallEscapeGame,
} from "../festival-task.test-util";
import { PrepareFestivalTask } from "./prepare";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { FestivalTaskNotFound } from "../festival-task.error";

describe("Prepare festival task instructions section", () => {
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
    fields                                | taskName                            | taskId                    | update                                                                                                                  | appointment                                   | global                                     | inCharge
    ${"appointment"}                      | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ appointment: humaGrass }}                                                                                           | ${humaGrass}                                  | ${installEscapeGame.instructions.global}   | ${installEscapeGame.instructions.inCharge.instruction}
    ${"appointment"}                      | ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${{ appointment: null }}                                                                                                | ${null}                                       | ${uninstallEscapeGame.instructions.global} | ${uninstallEscapeGame.instructions.inCharge.instruction}
    ${"global"}                           | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ global: "Some instruction for everyone" }}                                                                          | ${installEscapeGame.instructions.appointment} | ${"Some instruction for everyone"}         | ${installEscapeGame.instructions.inCharge.instruction}
    ${"global"}                           | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ global: null }}                                                                                                     | ${presentEscapeGame.instructions.appointment} | ${null}                                    | ${presentEscapeGame.instructions.inCharge.instruction}
    ${"inCharge"}                         | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ inCharge: "Some instruction for incharge only" }}                                                                   | ${installEscapeGame.instructions.appointment} | ${installEscapeGame.instructions.global}   | ${"Some instruction for incharge only"}
    ${"inCharge"}                         | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ inCharge: null }}                                                                                                   | ${presentEscapeGame.instructions.appointment} | ${presentEscapeGame.instructions.global}   | ${null}
    ${"global and inCharge"}              | ${presentEscapeGame.general.name}   | ${presentEscapeGame.id}   | ${{ inCharge: null, global: null }}                                                                                     | ${presentEscapeGame.instructions.appointment} | ${null}                                    | ${null}
    ${"global and inCharge"}              | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ inCharge: "Some instruction for in charge only", global: "Some instruction for everyone" }}                         | ${presentEscapeGame.instructions.appointment} | ${"Some instruction for everyone"}         | ${"Some instruction for in charge only"}
    ${"global, inCharge and appointment"} | ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${{ inCharge: "Some instruction for in charge only", global: "Some instruction for everyone", appointment: humaGrass }} | ${humaGrass}                                  | ${"Some instruction for everyone"}         | ${"Some instruction for in charge only"}
  `(
    "when updating $fields from $taskName",
    ({ fields, taskId, update, appointment, global, inCharge }) => {
      it(`should only update ${fields}`, async () => {
        const { instructions } = await prepare.updateInstructionsSection(
          taskId,
          update,
        );

        expect(instructions.appointment).toBe(appointment);
        expect(instructions.global).toStrictEqual(global);
        expect(instructions.inCharge.instruction).toBe(inCharge);
      });
    },
  );
  describe("when trying to update an unexisting task", () => {
    it("should indicate task not found", async () => {
      expect(
        async () =>
          await prepare.updateInstructionsSection(10000, { global: "Test" }),
      ).rejects.toThrow(FestivalTaskNotFound);
    });
  });
  describe("Several update on same task", () => {
    describe("when updating global then appointment consecutively", () => {
      it("should update both global and appointment", async () => {
        const updateGlobal = { global: "Some instructions for everyone" };
        const updateAppointment = { appointment: humaGrass };
        await prepare.updateInstructionsSection(
          installEscapeGame.id,
          updateGlobal,
        );
        const { instructions } = await prepare.updateInstructionsSection(
          installEscapeGame.id,
          updateAppointment,
        );

        expect(instructions.global).toBe(updateGlobal.global);
        expect(instructions.appointment).toBe(updateAppointment.appointment);
      });
    });
  });

  describe("Add contacts", () => {
    describe.each`
      taskName                          | task                 | contact
      ${installEscapeGame.general.name} | ${installEscapeGame} | ${noelContact}
      ${presentEscapeGame.general.name} | ${presentEscapeGame} | ${leaContact}
    `("when a new contact is added to $taskName", ({ task, contact }) => {
      it("add contact to contacts list", async () => {
        const { instructions } = await prepare.addContact(task.id, contact);
        expect(instructions.contacts).toContainEqual(contact);
        expect(instructions.contacts).toHaveLength(
          task.instructions.contacts.length + 1,
        );
      });
    });
    describe("when an already registered contact is added", () => {
      it("should keep contacts list unchanged", async () => {
        const { instructions } = await prepare.addContact(
          uninstallEscapeGame.id,
          noelContact,
        );
        expect(instructions.contacts).toStrictEqual(
          uninstallEscapeGame.instructions.contacts,
        );
      });
    });
  });

  describe("Add in charge volunteers", () => {
    describe.each`
      taskName                            | task                   | volunteer
      ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame} | ${noel}
      ${presentEscapeGame.general.name}   | ${presentEscapeGame}   | ${lea}
    `(
      "when a new in charge volunteer is added to $taskName",
      ({ task, volunteer }) => {
        it("should add vounteer to in charge volunteers list", async () => {
          const { instructions } = await prepare.addInchargeVolunteer(
            task.id,
            volunteer,
          );
          expect(instructions.inCharge.volunteers).toContainEqual(volunteer);
          expect(instructions.inCharge.volunteers).toHaveLength(
            task.instructions.inCharge.volunteers.length + 1,
          );
        });
      },
    );
    describe("when an already registered in charge volunteer is added", () => {
      it("should keep in charge voulunteers list unchanged", async () => {
        const volunteer = lea;
        const task = uninstallEscapeGame;
        const { instructions } = await prepare.addInchargeVolunteer(
          task.id,
          volunteer,
        );
        expect(instructions.inCharge.volunteers).toStrictEqual(
          task.instructions.inCharge.volunteers,
        );
      });
    });
  });
});