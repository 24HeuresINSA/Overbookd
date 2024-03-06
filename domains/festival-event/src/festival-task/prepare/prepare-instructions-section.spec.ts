import { beforeEach, describe, expect, it } from "vitest";
import {
  installBarbecue,
  george,
  guardJustDance,
  humaGrass,
  installEscapeGame,
  lea,
  leaContact,
  noel,
  noelContact,
  presentEscapeGame,
  serveWaterOnJustDance,
  uninstallEscapeGame,
  mdeHall,
  onlyApprovedByHumain,
  approvedByHumainRejectedByMatos,
  approvedByHumainAndElecRejectedByMatos,
  approvedByElecRejectedByMatos,
  approvedByMatosRejectedByHumainAndElec,
  onlyApprovedByMatos,
  uninstallBarbecue,
} from "../festival-task.test-util";
import { PrepareFestivalTask } from "./prepare";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { FestivalTaskNotFound } from "../festival-task.error";
import { FestivalTaskTranslator } from "../volunteer-conflicts";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { AlreadyApprovedBy } from "../../common/review.error";
import { isDraft } from "../../festival-event";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  elec,
  humain,
  matos,
} from "../../common/review";
import { APPROVED, REJECTED, RESET_REVIEW } from "../../common/action";

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
      onlyApprovedByHumain,
      onlyApprovedByMatos,
      approvedByHumainRejectedByMatos,
      approvedByHumainAndElecRejectedByMatos,
      approvedByElecRejectedByMatos,
      approvedByMatosRejectedByHumainAndElec,
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

  describe("Update after approvals", () => {
    describe.each`
      approvers         | rejectors         | humain       | matos        | elec                    | taskName                                               | task
      ${[humain]}       | ${[]}             | ${APPROVED}  | ${REVIEWING} | ${NOT_ASKING_TO_REVIEW} | ${onlyApprovedByHumain.general.name}                   | ${onlyApprovedByHumain}
      ${[matos]}        | ${[]}             | ${REVIEWING} | ${APPROVED}  | ${NOT_ASKING_TO_REVIEW} | ${onlyApprovedByMatos.general.name}                    | ${onlyApprovedByMatos}
      ${[humain]}       | ${[matos]}        | ${REVIEWING} | ${REJECTED}  | ${NOT_ASKING_TO_REVIEW} | ${approvedByHumainRejectedByMatos.general.name}        | ${approvedByHumainRejectedByMatos}
      ${[humain, elec]} | ${[matos]}        | ${REVIEWING} | ${REJECTED}  | ${REVIEWING}            | ${approvedByHumainAndElecRejectedByMatos.general.name} | ${approvedByHumainAndElecRejectedByMatos}
      ${[elec]}         | ${[matos]}        | ${REVIEWING} | ${REJECTED}  | ${REVIEWING}            | ${approvedByElecRejectedByMatos.general.name}          | ${approvedByElecRejectedByMatos}
      ${[matos]}        | ${[humain, elec]} | ${REJECTED}  | ${REVIEWING} | ${REJECTED}             | ${approvedByMatosRejectedByHumainAndElec.general.name} | ${approvedByMatosRejectedByHumainAndElec}
    `(
      "when $approvers approved the task $taskName",
      ({ approvers, task, rejectors, humain, matos, elec }) => {
        if (approvers.includes(humain)) {
          describe("humain ownership", () => {
            describe("when trying to update appointment location", () => {
              it("should indicate task is already approved by humain", () => {
                const update = { appointment: mdeHall };
                expect(
                  async () =>
                    await prepare.updateInstructionsSection(
                      task.id,
                      update,
                      noel,
                    ),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
            describe("when trying to add a contact", () => {
              it("should indicate task is already approved by humain", () => {
                expect(
                  async () => await prepare.addContact(task.id, leaContact),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
            describe("when trying to remove a contact", () => {
              it("should indicate task is already approved by humain", () => {
                const contactId = task.instructions.contacts.at(0).id;
                expect(
                  async () => await prepare.removeContact(task.id, contactId),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
            describe("when trying to add an in charge volunteer", () => {
              it("should indicate task is already approved by humain", () => {
                expect(
                  async () => await prepare.addInChargeVolunteer(task.id, lea),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
            describe("when trying to remove an in charge volunteer", () => {
              it("should indicate task is already approved by humain", () => {
                const volunteerId =
                  task.instructions.inCharge.volunteers.at(0).id;
                expect(
                  async () =>
                    await prepare.removeInChargeVolunteer(task.id, volunteerId),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
          });
        }
        if (rejectors.length === 0) {
          describe("when none of other reviewers rejects task", () => {
            describe.each`
              field                       | update
              ${"global instructions"}    | ${{ global: "Update global instruction" }}
              ${"in charge instructions"} | ${{ inCharge: "Update global instruction" }}
            `("when trying to update $field on $taskName", ({ update }) => {
              it(`should indicate task is already approved by ${approvers}`, () => {
                expect(
                  async () =>
                    await prepare.updateInstructionsSection(
                      task.id,
                      update,
                      noel,
                    ),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
            describe("when trying to clear in charge section", () => {
              it("should indicate task is already approved", () => {
                expect(
                  async () => await prepare.clearInCharge(task.id, noel),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
            describe("when trying to init in charge section", () => {
              it("should indicate task is already approved", () => {
                const form = {
                  volunteers: [noel],
                  instruction: "Some instruction",
                };
                expect(
                  async () => await prepare.initInCharge(task.id, form, noel),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
          });
        } else {
          describe("when another reviewer rejects task", () => {
            describe("when trying to update global instructions", () => {
              const instigator = noel;
              const update = { global: "Update global instruction" };
              it("should update it", async () => {
                const { instructions } =
                  await prepare.updateInstructionsSection(
                    task.id,
                    update,
                    instigator,
                  );
                expect(instructions.global).toBe(update.global);
              });
              it("should reset all approver review status to under review", async () => {
                const updated = await prepare.updateInstructionsSection(
                  task.id,
                  update,
                  instigator,
                );
                if (isDraft(updated)) return;

                expect(updated.reviews.humain).toBe(humain);
                expect(updated.reviews.matos).toBe(matos);
                expect(updated.reviews.elec).toBe(elec);
              });
              it("should add RESET_REVIEW key event to history", async () => {
                const { history } = await prepare.updateInstructionsSection(
                  task.id,
                  update,
                  instigator,
                );
                expect(history).toStrictEqual([
                  ...task.history,
                  {
                    action: RESET_REVIEW,
                    by: instigator,
                    at: expect.any(Date),
                    description:
                      "Précédentes approbations réinitialisées par un changement sur le champ instructions",
                  },
                ]);
              });
            });
            if (task.instructions.inCharge.volunteers.length > 0) {
              describe("when trying to update in charge instructions", () => {
                const instigator = noel;
                const update = { inCharge: "Update global instruction" };
                it("should update it", async () => {
                  const { instructions } =
                    await prepare.updateInstructionsSection(
                      task.id,
                      update,
                      instigator,
                    );
                  expect(instructions.inCharge.instruction).toBe(
                    update.inCharge,
                  );
                });
                it("should reset all approver review status to under review", async () => {
                  const updated = await prepare.updateInstructionsSection(
                    task.id,
                    update,
                    instigator,
                  );
                  if (isDraft(updated)) return;

                  expect(updated.reviews.humain).toBe(humain);
                  expect(updated.reviews.matos).toBe(matos);
                  expect(updated.reviews.elec).toBe(elec);
                });
                it("should add RESET_REVIEW key event to history", async () => {
                  const { history } = await prepare.updateInstructionsSection(
                    task.id,
                    update,
                    instigator,
                  );
                  expect(history).toStrictEqual([
                    ...task.history,
                    {
                      action: RESET_REVIEW,
                      by: instigator,
                      at: expect.any(Date),
                      description:
                        "Précédentes approbations réinitialisées par un changement sur le champ instructions des responsables",
                    },
                  ]);
                });
              });
            }
            if (
              task.instructions.inCharge.instruction ||
              task.instructions.inCharge.volunteers.length > 0
            ) {
              describe("when trying to clear in charge section when exists", () => {
                const instigator = noel;
                it("should clear it", async () => {
                  const { instructions } = await prepare.clearInCharge(
                    task.id,
                    instigator,
                  );
                  expect(instructions.inCharge.volunteers).toHaveLength(0);
                  expect(instructions.inCharge.instruction).toBe(null);
                });
                it("should reset all approver review status to under review", async () => {
                  const updated = await prepare.clearInCharge(
                    task.id,
                    instigator,
                  );
                  if (isDraft(updated)) return;

                  expect(updated.reviews.humain).toBe(humain);
                  expect(updated.reviews.matos).toBe(matos);
                  expect(updated.reviews.elec).toBe(elec);
                });
                it("should add RESET_REVIEW key event to history", async () => {
                  const { history } = await prepare.clearInCharge(
                    task.id,
                    instigator,
                  );
                  expect(history).toStrictEqual([
                    ...task.history,
                    {
                      action: RESET_REVIEW,
                      by: instigator,
                      at: expect.any(Date),
                      description:
                        "Précédentes approbations réinitialisées par la suppression des instructions des responsables",
                    },
                  ]);
                });
              });
            } else {
              describe("when trying to initialize in charge section", () => {
                const volunteers = [noel, lea];
                const instruction = "Some instruction";
                const form = { volunteers, instruction };
                const instigator = noel;
                it("should initialize it", async () => {
                  const { instructions } = await prepare.initInCharge(
                    task.id,
                    form,
                    instigator,
                  );
                  expect(instructions.inCharge.volunteers).toStrictEqual(
                    volunteers,
                  );
                  expect(instructions.inCharge.instruction).toBe(instruction);
                });
                it("should reset all approver review status to under review", async () => {
                  const updated = await prepare.initInCharge(
                    task.id,
                    form,
                    instigator,
                  );
                  if (isDraft(updated)) return;

                  expect(updated.reviews.humain).toBe(humain);
                  expect(updated.reviews.matos).toBe(matos);
                  expect(updated.reviews.elec).toBe(elec);
                });
                it("should add RESET_REVIEW key event to history", async () => {
                  const { history } = await prepare.initInCharge(
                    task.id,
                    form,
                    instigator,
                  );
                  expect(history).toStrictEqual([
                    ...task.history,
                    {
                      action: RESET_REVIEW,
                      by: instigator,
                      at: expect.any(Date),
                      description:
                        "Précédentes approbations réinitialisées par l'initialisation des instructions des responsables",
                    },
                  ]);
                });
              });
            }
          });
        }
      },
    );
  });

  describe("Reset review event after update", () => {
    const updateGlobal = { global: "Update global instruction" };
    const updateInCharge = { inCharge: "Update in charge instruction" };
    const messageGlobal =
      "Précédentes approbations réinitialisées par un changement sur le champ instructions";
    const messageInCharge =
      "Précédentes approbations réinitialisées par un changement sur le champ instructions des responsables";
    describe("when updating IN REVIEW task with some approvals", () => {
      it.each`
        task                    | approver
        ${onlyApprovedByHumain} | ${humain}
        ${onlyApprovedByMatos}  | ${matos}
      `(
        "should indicate task is already approved by $approver",
        async ({ task }) => {
          expect(
            async () =>
              await prepare.updateInstructionsSection(
                task.id,
                updateGlobal,
                noel,
              ),
          ).rejects.toThrow(AlreadyApprovedBy);
        },
      );
    });
    describe("when updating IN REVIEW task with non approvals", () => {
      it.each`
        task                     | update
        ${guardJustDance}        | ${updateGlobal}
        ${serveWaterOnJustDance} | ${updateInCharge}
      `(
        "should NOT add RESET_REVIEW key event to history",
        async ({ task, update }) => {
          const { history } = await prepare.updateInstructionsSection(
            task.id,
            update,
            noel,
          );
          expect(history.at(-1)).not.toMatchObject({
            action: RESET_REVIEW,
            by: noel,
          });
        },
      );
    });
    describe("when updating REFUSED task with some approvals", () => {
      it.each`
        task                                      | update            | message
        ${approvedByElecRejectedByMatos}          | ${updateGlobal}   | ${messageGlobal}
        ${approvedByMatosRejectedByHumainAndElec} | ${updateInCharge} | ${messageInCharge}
      `(
        "should add RESET_REVIEW key event to history",
        async ({ task, update, message }) => {
          const { history } = await prepare.updateInstructionsSection(
            task.id,
            update,
            noel,
          );
          expect(history).toStrictEqual([
            ...task.history,
            {
              action: RESET_REVIEW,
              by: noel,
              at: expect.any(Date),
              description: message,
            },
          ]);
        },
      );
    });
    describe("when updating REFUSED task with non approvals", () => {
      it.each`
        task                 | update
        ${installBarbecue}   | ${updateGlobal}
        ${uninstallBarbecue} | ${updateGlobal}
      `(
        "should NOT add RESET_REVIEW key event to history",
        async ({ task, update }) => {
          const { history } = await prepare.updateInstructionsSection(
            task.id,
            update,
            noel,
          );
          expect(history.at(-1)).not.toMatchObject({
            action: RESET_REVIEW,
            by: noel,
          });
        },
      );
    });
  });
});
