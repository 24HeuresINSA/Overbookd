import { beforeEach, describe, expect, it } from "vitest";
import {
  george,
  humaGrass,
  lea,
  leaContact,
  noel,
  noelContact,
} from "../festival-task.test-util.js";
import {
  installEscapeGame,
  uninstallEscapeGame,
} from "../festival-task.fake.js";
import {
  installBarbecue,
  guardJustDance,
  presentEscapeGame,
  serveWaterOnJustDance,
  uninstallBarbecue,
} from "../festival-task.fake.js";
import { PrepareFestivalTask } from "./prepare.js";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory.js";
import { FestivalTaskNotFound } from "../festival-task.error.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";

describe("Prepare festival task instructions section", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const tasks = [
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
      guardJustDance,
      serveWaterOnJustDance,
      installBarbecue,
      uninstallBarbecue,
    ];
    const festivalTasks = new InMemoryFestivalTasks(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    prepare = new PrepareFestivalTask(festivalTasks, translator);
  });
  describe.each`
    fields                                | taskName                              | taskId                      | update                                                                                                                  | appointment                                       | global                                       | inCharge
    ${"appointment"}                      | ${installEscapeGame.general.name}     | ${installEscapeGame.id}     | ${{ appointment: humaGrass }}                                                                                           | ${humaGrass}                                      | ${installEscapeGame.instructions.global}     | ${installEscapeGame.instructions.inCharge.instruction}
    ${"appointment"}                      | ${uninstallEscapeGame.general.name}   | ${uninstallEscapeGame.id}   | ${{ appointment: null }}                                                                                                | ${null}                                           | ${uninstallEscapeGame.instructions.global}   | ${uninstallEscapeGame.instructions.inCharge.instruction}
    ${"global"}                           | ${installEscapeGame.general.name}     | ${installEscapeGame.id}     | ${{ global: "Some instruction for everyone" }}                                                                          | ${installEscapeGame.instructions.appointment}     | ${"Some instruction for everyone"}           | ${installEscapeGame.instructions.inCharge.instruction}
    ${"global"}                           | ${presentEscapeGame.general.name}     | ${presentEscapeGame.id}     | ${{ global: null }}                                                                                                     | ${presentEscapeGame.instructions.appointment}     | ${null}                                      | ${presentEscapeGame.instructions.inCharge.instruction}
    ${"inCharge"}                         | ${installEscapeGame.general.name}     | ${installEscapeGame.id}     | ${{ inCharge: "Some instruction for incharge only" }}                                                                   | ${installEscapeGame.instructions.appointment}     | ${installEscapeGame.instructions.global}     | ${"Some instruction for incharge only"}
    ${"inCharge"}                         | ${presentEscapeGame.general.name}     | ${presentEscapeGame.id}     | ${{ inCharge: null }}                                                                                                   | ${presentEscapeGame.instructions.appointment}     | ${presentEscapeGame.instructions.global}     | ${null}
    ${"global and inCharge"}              | ${presentEscapeGame.general.name}     | ${presentEscapeGame.id}     | ${{ inCharge: null, global: null }}                                                                                     | ${presentEscapeGame.instructions.appointment}     | ${null}                                      | ${null}
    ${"global and inCharge"}              | ${installEscapeGame.general.name}     | ${installEscapeGame.id}     | ${{ inCharge: "Some instruction for in charge only", global: "Some instruction for everyone" }}                         | ${presentEscapeGame.instructions.appointment}     | ${"Some instruction for everyone"}           | ${"Some instruction for in charge only"}
    ${"global, inCharge and appointment"} | ${installEscapeGame.general.name}     | ${installEscapeGame.id}     | ${{ inCharge: "Some instruction for in charge only", global: "Some instruction for everyone", appointment: humaGrass }} | ${humaGrass}                                      | ${"Some instruction for everyone"}           | ${"Some instruction for in charge only"}
    ${"global"}                           | ${guardJustDance.general.name}        | ${guardJustDance.id}        | ${{ global: "Some instruction for everyone" }}                                                                          | ${guardJustDance.instructions.appointment}        | ${"Some instruction for everyone"}           | ${guardJustDance.instructions.inCharge.instruction}
    ${"global and appointment"}           | ${guardJustDance.general.name}        | ${guardJustDance.id}        | ${{ global: "Some instruction for everyone", appointment: humaGrass }}                                                  | ${humaGrass}                                      | ${"Some instruction for everyone"}           | ${guardJustDance.instructions.inCharge.instruction}
    ${"inCharge"}                         | ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance.id} | ${{ inCharge: "Il faut aller chercher l'eau dans les toilettes" }}                                                      | ${serveWaterOnJustDance.instructions.appointment} | ${serveWaterOnJustDance.instructions.global} | ${"Il faut aller chercher l'eau dans les toilettes"}
    ${"global"}                           | ${installBarbecue.general.name}       | ${installBarbecue.id}       | ${{ global: "Some instruction for everyone" }}                                                                          | ${installBarbecue.instructions.appointment}       | ${"Some instruction for everyone"}           | ${installBarbecue.instructions.inCharge.instruction}
  `(
    "when updating $fields from $taskName",
    ({ fields, taskId, update, appointment, global, inCharge }) => {
      it(`should only update ${fields}`, async () => {
        const { instructions } = await prepare.updateInstructionsSection(
          taskId,
          update,
          noel,
        );

        expect(instructions.appointment).toBe(appointment);
        expect(instructions.global).toStrictEqual(global);
        expect(instructions.inCharge.instruction).toBe(inCharge);
      });
    },
  );
  describe.each`
    task               | update                               | expectedError
    ${guardJustDance}  | ${{ global: null }}                  | ${"Des instructions sont nécessaires"}
    ${guardJustDance}  | ${{ inCharge: "Some instructions" }} | ${"Des responsables sont nécessaires pour les instructions spécifiques"}
    ${guardJustDance}  | ${{ appointment: null }}             | ${"Un lieu de rendez-vous est nécessaire"}
    ${installBarbecue} | ${{ global: null }}                  | ${"Des instructions sont nécessaires"}
  `(
    "when trying to clear mandatory field of an in review task",
    ({ task, update, expectedError }) => {
      it("should indicate the mandatory field is required", async () => {
        expect(
          async () =>
            await prepare.updateInstructionsSection(task.id, update, noel),
        ).rejects.toThrow(expectedError);
      });
    },
  );
  describe("when trying to update an unexisting task", () => {
    it("should indicate task not found", async () => {
      expect(
        async () =>
          await prepare.updateInstructionsSection(
            10000,
            { global: "Test" },
            noel,
          ),
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
          noel,
        );
        const { instructions } = await prepare.updateInstructionsSection(
          installEscapeGame.id,
          updateAppointment,
          noel,
        );

        expect(instructions.global).toBe(updateGlobal.global);
        expect(instructions.appointment).toBe(updateAppointment.appointment);
      });
    });
  });

  describe("Add contacts", () => {
    describe.each`
      taskName                              | task                     | contact
      ${installEscapeGame.general.name}     | ${installEscapeGame}     | ${noelContact}
      ${presentEscapeGame.general.name}     | ${presentEscapeGame}     | ${leaContact}
      ${guardJustDance.general.name}        | ${guardJustDance}        | ${leaContact}
      ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${leaContact}
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

  describe("Remove contact", () => {
    describe.each`
      taskName                              | task                     | contactId
      ${uninstallEscapeGame.general.name}   | ${uninstallEscapeGame}   | ${noelContact.id}
      ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${noelContact.id}
    `("when removing a known contact on $taskName", ({ task, contactId }) => {
      it("should remove it from contacts list", async () => {
        const expectedLength = task.instructions.contacts.length - 1;

        const { instructions } = await prepare.removeContact(
          task.id,
          contactId,
        );

        expect(instructions.contacts).toHaveLength(expectedLength);
      });
    });
    describe("when removing an unknown contact", () => {
      it("should keep contacts list unchanged", async () => {
        const task = uninstallEscapeGame;
        const contactId = -1;

        const { instructions } = await prepare.removeContact(
          task.id,
          contactId,
        );

        expect(instructions.contacts).toStrictEqual(task.instructions.contacts);
      });
    });
  });

  describe("Add in charge volunteers", () => {
    describe.each`
      taskName                              | task                     | volunteer
      ${uninstallEscapeGame.general.name}   | ${uninstallEscapeGame}   | ${noel}
      ${presentEscapeGame.general.name}     | ${presentEscapeGame}     | ${lea}
      ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${lea}
    `(
      "when a new in charge volunteer is added to $taskName",
      ({ task, volunteer }) => {
        it("should add vounteer to in charge volunteers list", async () => {
          const { instructions } = await prepare.addInChargeVolunteer(
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
        const { instructions } = await prepare.addInChargeVolunteer(
          task.id,
          volunteer,
        );
        expect(instructions.inCharge.volunteers).toStrictEqual(
          task.instructions.inCharge.volunteers,
        );
      });
    });
    describe("when task is under review and doesn't have in charge instructions", () => {
      it("should indicate instructions are also required", async () => {
        expect(
          async () =>
            await prepare.addInChargeVolunteer(guardJustDance.id, noelContact),
        ).rejects.toThrow(
          "Des instructions spécifiques sont nécessaires pour les responsables",
        );
      });
    });
  });

  describe("Remove in charge volunteers", () => {
    describe.each`
      taskName                              | task                     | volunteerId
      ${uninstallEscapeGame.general.name}   | ${uninstallEscapeGame}   | ${lea.id}
      ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance} | ${george.id}
    `(
      "when removing a known volunteer on $taskName",
      ({ task, volunteerId }) => {
        it("should remove it from volunteers list", async () => {
          const expectedLength =
            task.instructions.inCharge.volunteers.length - 1;

          const { instructions } = await prepare.removeInChargeVolunteer(
            task.id,
            volunteerId,
          );

          expect(instructions.inCharge.volunteers).toHaveLength(expectedLength);
        });
      },
    );
    describe("when removing an unknown volunteer", () => {
      it("should keep in charge volunteers list unchanged", async () => {
        const volunteerId = -1;
        const task = uninstallEscapeGame;

        const { instructions } = await prepare.removeInChargeVolunteer(
          task.id,
          volunteerId,
        );

        expect(instructions).toStrictEqual(task.instructions);
      });
    });
  });

  describe("Clear in charge", () => {
    it.each`
      taskName                              | task
      ${uninstallEscapeGame.general.name}   | ${uninstallEscapeGame}
      ${serveWaterOnJustDance.general.name} | ${serveWaterOnJustDance}
    `(
      "should clear $taskName in charge instructions section",
      async ({ task }) => {
        const { instructions } = await prepare.clearInCharge(task.id, noel);
        expect(instructions.inCharge.volunteers).toHaveLength(0);
        expect(instructions.inCharge.instruction).toBe(null);
      },
    );
  });

  describe("Initialize in charge section when task is in review", () => {
    it("should init in charge section", async () => {
      const task = guardJustDance;
      const volunteers = [noel, lea];
      const instruction = "Some instructions for in charge only";
      const { instructions } = await prepare.initInCharge(
        task.id,
        { volunteers, instruction },
        noel,
      );
      expect(instructions.inCharge.volunteers).toStrictEqual(volunteers);
      expect(instructions.inCharge.instruction).toBe(instruction);
    });
  });
});