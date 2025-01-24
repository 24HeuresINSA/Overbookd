import { beforeEach, describe, expect, it } from "vitest";
import { lea, leaContact, noel, mdeHall } from "../festival-task.test-util.js";
import {
  approvedByMatosWithoutInquiries,
  gabIsAssignedTo,
  installEscapeGame,
  parcoursCollageTrajetA,
  rejectedByHumainAndApprovedByMatosWithoutInquiries,
  uninstallEscapeGame,
} from "../festival-task.fake.js";
import {
  installBarbecue,
  guardJustDance,
  presentEscapeGame,
  serveWaterOnJustDance,
  onlyApprovedByHumain,
  approvedByHumainRejectedByMatos,
  approvedByHumainAndElecRejectedByMatos,
  approvedByElecRejectedByMatos,
  approvedByMatosRejectedByHumainAndElec,
  onlyApprovedByMatos,
  uninstallBarbecue,
} from "../festival-task.fake.js";
import { PrepareFestivalTask } from "./prepare.js";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory.js";
import { ForceUpdateError } from "../festival-task.error.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";
import { AlreadyApprovedBy } from "../../common/review.error.js";
import { isDraft } from "../../festival-event.js";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  elec,
  humain,
  matos,
} from "../../common/review.js";
import { FORCED_UPDATE, REJECTED, RESET_REVIEW } from "../../common/action.js";

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
      gabIsAssignedTo,
      parcoursCollageTrajetA,
      approvedByMatosWithoutInquiries,
      rejectedByHumainAndApprovedByMatosWithoutInquiries,
    ];
    const festivalTasks = new InMemoryFestivalTasks(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    prepare = new PrepareFestivalTask(festivalTasks, translator);
  });

  describe("Update after approvals", () => {
    describe.each`
      taskName                                               | task
      ${onlyApprovedByHumain.general.name}                   | ${onlyApprovedByHumain}
      ${approvedByHumainRejectedByMatos.general.name}        | ${approvedByHumainRejectedByMatos}
      ${approvedByHumainAndElecRejectedByMatos.general.name} | ${approvedByHumainAndElecRejectedByMatos}
    `("when humain approved the task $taskName", ({ task }) => {
      describe("when trying to update appointment location", () => {
        it("should indicate task is already approved by humain", () => {
          const update = { appointment: mdeHall };
          expect(
            async () =>
              await prepare.updateInstructionsSection(task.id, update, noel),
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
          const volunteerId = task.instructions.inCharge.volunteers.at(0).id;
          expect(
            async () =>
              await prepare.removeInChargeVolunteer(task.id, volunteerId),
          ).rejects.toThrow(AlreadyApprovedBy);
        });
      });
    });

    describe.each`
      rejectors         | humainAfterReset | matosAfterReset | elecAfterReset          | taskName                                               | task
      ${[matos]}        | ${REVIEWING}     | ${REJECTED}     | ${NOT_ASKING_TO_REVIEW} | ${approvedByHumainRejectedByMatos.general.name}        | ${approvedByHumainRejectedByMatos}
      ${[matos]}        | ${REVIEWING}     | ${REJECTED}     | ${REVIEWING}            | ${approvedByHumainAndElecRejectedByMatos.general.name} | ${approvedByHumainAndElecRejectedByMatos}
      ${[matos]}        | ${REVIEWING}     | ${REJECTED}     | ${REVIEWING}            | ${approvedByElecRejectedByMatos.general.name}          | ${approvedByElecRejectedByMatos}
      ${[humain, elec]} | ${REJECTED}      | ${REVIEWING}    | ${REJECTED}             | ${approvedByMatosRejectedByHumainAndElec.general.name} | ${approvedByMatosRejectedByHumainAndElec}
      ${[humain, elec]} | ${REJECTED}      | ${REVIEWING}    | ${REJECTED}             | ${approvedByMatosRejectedByHumainAndElec.general.name} | ${approvedByMatosRejectedByHumainAndElec}
    `(
      "when $rejectors rejected the task $taskName",
      ({ task, humainAfterReset, matosAfterReset, elecAfterReset }) => {
        describe("when another reviewer rejects task", () => {
          describe("when trying to update global instructions", () => {
            const instigator = noel;
            const update = { global: "Update global instruction" };
            it("should update it", async () => {
              const { instructions } = await prepare.updateInstructionsSection(
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

              expect(updated.reviews.humain).toBe(humainAfterReset);
              expect(updated.reviews.matos).toBe(matosAfterReset);
              expect(updated.reviews.elec).toBe(elecAfterReset);
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
                expect(instructions.inCharge.instruction).toBe(update.inCharge);
              });
              it("should reset all approver review status to under review", async () => {
                const updated = await prepare.updateInstructionsSection(
                  task.id,
                  update,
                  instigator,
                );
                if (isDraft(updated)) return;

                expect(updated.reviews.humain).toBe(humainAfterReset);
                expect(updated.reviews.matos).toBe(matosAfterReset);
                expect(updated.reviews.elec).toBe(elecAfterReset);
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

                expect(updated.reviews.humain).toBe(humainAfterReset);
                expect(updated.reviews.matos).toBe(matosAfterReset);
                expect(updated.reviews.elec).toBe(elecAfterReset);
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

                expect(updated.reviews.humain).toBe(humainAfterReset);
                expect(updated.reviews.matos).toBe(matosAfterReset);
                expect(updated.reviews.elec).toBe(elecAfterReset);
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
      },
    );

    describe("when task has no rejection", () => {
      describe.each`
        approvers   | taskName                             | task
        ${[humain]} | ${onlyApprovedByHumain.general.name} | ${onlyApprovedByHumain}
        ${[matos]}  | ${onlyApprovedByMatos.general.name}  | ${onlyApprovedByMatos}
      `(
        "when task $taskName has at least one inquiry",
        ({ approvers, task }) => {
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
        },
      );

      describe("when task has no inquiry and is approved by at least one logistic reviewer", () => {
        const task = approvedByMatosWithoutInquiries;
        describe.each`
          field                                  | update                                          | global                         | inCharge
          ${"global instructions"}               | ${{ global: "Update global instruction" }}      | ${"Update global instruction"} | ${task.instructions.inCharge.instruction}
          ${"in charge instructions"}            | ${{ inCharge: "Update in charge instruction" }} | ${task.instructions.global}    | ${"Update in charge instruction"}
          ${"global and in charge instructions"} | ${{ global: "Global", inCharge: "In charge" }}  | ${"Global"}                    | ${"In charge"}
        `(
          "when trying to update $field on $taskName",
          ({ update, global, inCharge }) => {
            it(`should update it`, async () => {
              const { instructions } = await prepare.updateInstructionsSection(
                task.id,
                update,
                noel,
              );
              expect(instructions.global).toBe(global);
              expect(instructions.inCharge.instruction).toBe(inCharge);
            });
          },
        );
        describe("when trying to clear in charge section", () => {
          it("should update it", async () => {
            const { instructions } = await prepare.clearInCharge(task.id, noel);
            expect(instructions.inCharge.volunteers).toHaveLength(0);
          });
        });
        describe("when trying to init in charge section", () => {
          it("should update it", async () => {
            const form = {
              volunteers: [noel],
              instruction: "Some instruction",
            };
            const { instructions } = await prepare.initInCharge(
              task.id,
              form,
              noel,
            );
            expect(instructions.inCharge.volunteers).toStrictEqual(
              form.volunteers,
            );
            expect(instructions.inCharge.instruction).toBe(form.instruction);
          });
        });
      });
    });
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

  describe("Force instructions update", () => {
    describe.each`
      fields                   | instructions                                        | approvers   | taskName                               | task
      ${"global"}              | ${{ global: "C'est push" }}                         | ${[humain]} | ${parcoursCollageTrajetA.general.name} | ${parcoursCollageTrajetA}
      ${"inCharge"}            | ${{ inCharge: "C'est push" }}                       | ${[noel]}   | ${parcoursCollageTrajetA.general.name} | ${parcoursCollageTrajetA}
      ${"global and inCharge"} | ${{ inCharge: "C'est push", global: "Avec force" }} | ${[noel]}   | ${parcoursCollageTrajetA.general.name} | ${parcoursCollageTrajetA}
    `(
      "when forcing $fields instructions on $taskName",
      ({ fields, instructions, task }) => {
        it(`should update ${fields} instructions`, async () => {
          const updated = await prepare.forceInstructions(
            task.id,
            instructions,
            noel,
          );
          expect(updated.instructions.global).toBe(
            instructions?.global ?? task.instructions.global,
          );
          expect(updated.instructions.inCharge.instruction).toBe(
            instructions?.inCharge ?? task.instructions.inCharge.instruction,
          );
        });
        it("should should add FORCED_UPDATE key event to history", async () => {
          const message = "Mise à jour forcée des instructions";
          const updated = await prepare.forceInstructions(
            task.id,
            instructions,
            noel,
          );
          expect(updated.history).toStrictEqual([
            ...task.history,
            {
              action: FORCED_UPDATE,
              by: noel,
              at: expect.any(Date),
              description: message,
            },
          ]);
        });
      },
    );
    describe("when trying to force update on a task in draft", () => {
      it("should indicate task is in draft", async () => {
        const taskId = installEscapeGame.id;
        const update = { global: "C'est push" };
        expect(
          async () => await prepare.forceInstructions(taskId, update, noel),
        ).rejects.toThrow(ForceUpdateError.isDraft(taskId));
      });
    });
    describe("when trying to force update on a task without approval", () => {
      it("should indicate task is not approved", async () => {
        const taskId = guardJustDance.id;
        const update = { global: "C'est push" };
        expect(
          async () => await prepare.forceInstructions(taskId, update, noel),
        ).rejects.toThrow(ForceUpdateError.noApprovals(taskId));
      });
    });
  });
});
