import { beforeEach, describe, expect, it } from "vitest";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory.js";
import { PrepareFestivalTask } from "./prepare.js";
import {
  noel,
  saturday10h,
  friday18hsaturday10hMobilization,
  saturday18hsaturday19hMobilization,
  leaAvailabilities,
  noelAvailabilities,
  friday10hfriday11hMobilization,
  friday9h,
  sunday04h,
  saturday04h,
  friday8h,
} from "../festival-task.test-util.js";
import {
  approvedByMatosWithoutInquiries,
  gabIsAssignedTo,
  installEscapeGame,
  rejectedByHumainAndApprovedByMatosWithoutInquiries,
  uninstallEscapeGame,
} from "../festival-task.fake.js";
import {
  presentEscapeGame,
  guardEscapeGame,
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
} from "../festival-task.fake.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";
import { APPROVED, REJECTED, RESET_REVIEW } from "../../common/action.js";
import {
  NOT_ASKING_TO_REVIEW,
  REVIEWING,
  elec,
  humain,
  matos,
} from "../../common/review.js";
import { AlreadyApprovedBy } from "../../common/review.error.js";
import { isDraft } from "../../festival-event.js";

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
      onlyApprovedByMatos,
      onlyApprovedByHumain,
      approvedByHumainRejectedByMatos,
      approvedByHumainAndElecRejectedByMatos,
      approvedByElecRejectedByMatos,
      approvedByMatosRejectedByHumainAndElec,
      gabIsAssignedTo,
      approvedByMatosWithoutInquiries,
      rejectedByHumainAndApprovedByMatosWithoutInquiries,
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

  describe("Update after approvals", () => {
    describe.each`
      taskName                                               | task
      ${onlyApprovedByHumain.general.name}                   | ${onlyApprovedByHumain}
      ${approvedByHumainRejectedByMatos.general.name}        | ${approvedByHumainRejectedByMatos}
      ${approvedByHumainAndElecRejectedByMatos.general.name} | ${approvedByHumainAndElecRejectedByMatos}
    `("when humain approved the task $taskName", ({ task }) => {
      describe("when trying to add volunteer to existing mobilization", () => {
        it("should indicate task is already approved by humain", async () => {
          const mobilization = task.mobilizations[0];
          expect(
            async () =>
              await prepare.addVolunteerToMobilization(
                task.id,
                mobilization.id,
                noel,
              ),
          ).rejects.toThrow("La FT a déjà été validée par l'équipe humain.");
        });
      });
      describe("when trying to remove volunteer from existing mobilization", () => {
        it("should indicate task is already approved by humain", async () => {
          const mobilization = task.mobilizations[0];
          const volunteer = mobilization.volunteers[0];
          expect(
            async () =>
              await prepare.removeVolunteerFromMobilization(
                task.id,
                mobilization.id,
                volunteer.id,
              ),
          ).rejects.toThrow("La FT a déjà été validée par l'équipe humain.");
        });
      });
      describe("when trying to add team to existing mobilization", () => {
        it("should indicate task is already approved by humain", async () => {
          const mobilization = task.mobilizations[0];
          const team = { team: "elec", count: 5 };
          expect(
            async () =>
              await prepare.addTeamToMobilization(
                task.id,
                mobilization.id,
                team,
              ),
          ).rejects.toThrow("La FT a déjà été validée par l'équipe humain.");
        });
      });
      describe("when trying to remove team from existing mobilization", () => {
        it("should indicate task is already approved by humain", async () => {
          const mobilization = task.mobilizations[0];
          const { team } = mobilization.teams[0];
          expect(
            async () =>
              await prepare.removeTeamFromMobilization(
                task.id,
                mobilization.id,
                team,
              ),
          ).rejects.toThrow("La FT a déjà été validée par l'équipe humain.");
        });
      });
    });

    describe("when task has no rejection", () => {
      describe.each`
        approvers   | taskName                             | task
        ${[humain]} | ${onlyApprovedByHumain.general.name} | ${onlyApprovedByHumain}
        ${[matos]}  | ${onlyApprovedByMatos.general.name}  | ${onlyApprovedByMatos}
      `(
        "when task $taskName has at least one inquiry",
        ({ approvers, task }) => {
          describe("when none of other reviewers rejects task", () => {
            describe("when trying to add mobilization", () => {
              it(`should indicate task is already approved by ${approvers}`, async () => {
                const form = friday18hsaturday10hMobilization.form;
                expect(
                  async () =>
                    await prepare.addMobilization(task.id, form, noel),
                ).rejects.toThrow(AlreadyApprovedBy);
              });
            });
            if (task.mobilizations.length > 1) {
              describe("when trying to remove mobilization which is not the last", () => {
                it(`should indicate task is already approved by ${approvers}`, async () => {
                  const mobilization = task.mobilizations[0];
                  expect(
                    async () =>
                      await prepare.removeMobilization(
                        task.id,
                        mobilization.id,
                        noel,
                      ),
                  ).rejects.toThrow(AlreadyApprovedBy);
                });
              });
            }
            describe.each`
              field                         | update
              ${"start"}                    | ${{ start: saturday10h.date }}
              ${"end"}                      | ${{ end: saturday10h.date }}
              ${"split duration"}           | ${{ durationSplitInHour: 1 }}
              ${"start and split duration"} | ${{ start: saturday10h.date, durationSplitInHour: 1 }}
            `(
              "when trying to update $field of existing mobilization",
              ({ update }) => {
                it(`should indicate task is already approved by ${approvers}`, async () => {
                  const mobilization = task.mobilizations[0];
                  expect(
                    async () =>
                      await prepare.updateMobilization(
                        task.id,
                        mobilization.id,
                        update,
                        noel,
                      ),
                  ).rejects.toThrow(AlreadyApprovedBy);
                });
              },
            );
          });
        },
      );
      describe("when task has no inquiry and is approved by at least one logistic reviewer", () => {
        const task = approvedByMatosWithoutInquiries;
        describe("when trying to add mobilization", () => {
          it("should add mobilization", async () => {
            const { mobilizations } = await prepare.addMobilization(
              task.id,
              saturday18hsaturday19hMobilization.form,
              noel,
            );
            expect(mobilizations).toHaveLength(task.mobilizations.length + 1);
          });
        });
        describe("when trying to remove mobilization which is not the last", () => {
          it("should remove mobilization", async () => {
            const mobilization = task.mobilizations[0];
            const { mobilizations } = await prepare.removeMobilization(
              task.id,
              mobilization.id,
              noel,
            );
            expect(mobilizations).toHaveLength(task.mobilizations.length - 1);
          });
        });

        describe.each`
          field                         | update                                              | start                          | end                          | durationSplitInHour
          ${"start"}                    | ${{ start: friday8h.date }}                         | ${friday8h.date}               | ${task.mobilizations[0].end} | ${task.mobilizations[0].durationSplitInHour}
          ${"end"}                      | ${{ end: saturday10h.date }}                        | ${task.mobilizations[0].start} | ${saturday10h.date}          | ${task.mobilizations[0].durationSplitInHour}
          ${"split duration"}           | ${{ durationSplitInHour: 1 }}                       | ${task.mobilizations[0].start} | ${task.mobilizations[0].end} | ${1}
          ${"start and split duration"} | ${{ start: friday8h.date, durationSplitInHour: 1 }} | ${friday8h.date}               | ${task.mobilizations[0].end} | ${1}
        `(
          "when trying to update $field of existing mobilization",
          ({ update, start, end, durationSplitInHour }) => {
            it("should update mobilization", async () => {
              const mobilization = task.mobilizations[0];
              const { mobilizations } = await prepare.updateMobilization(
                task.id,
                mobilization.id,
                update,
                noel,
              );

              const updated = mobilizations[0];
              expect(updated.start).toBe(start);
              expect(updated.end).toBe(end);
              expect(updated.durationSplitInHour).toBe(durationSplitInHour);
            });
          },
        );
      });
    });

    describe.each`
      rejectors         | humain       | matos        | elec                    | taskName                                                           | task                                                  | firstMobilizationHumanReadable
      ${[matos]}        | ${REVIEWING} | ${REJECTED}  | ${NOT_ASKING_TO_REVIEW} | ${approvedByHumainRejectedByMatos.general.name}                    | ${approvedByHumainRejectedByMatos}                    | ${"du vendredi 17 mai à 10:00 au vendredi 17 mai à 18:00"}
      ${[matos]}        | ${REVIEWING} | ${REJECTED}  | ${REVIEWING}            | ${approvedByHumainAndElecRejectedByMatos.general.name}             | ${approvedByHumainAndElecRejectedByMatos}             | ${"du vendredi 17 mai à 10:00 au vendredi 17 mai à 18:00"}
      ${[matos]}        | ${REVIEWING} | ${REJECTED}  | ${REVIEWING}            | ${approvedByElecRejectedByMatos.general.name}                      | ${approvedByElecRejectedByMatos}                      | ${"du vendredi 17 mai à 10:00 au vendredi 17 mai à 18:00"}
      ${[humain, elec]} | ${REJECTED}  | ${REVIEWING} | ${REJECTED}             | ${approvedByMatosRejectedByHumainAndElec.general.name}             | ${approvedByMatosRejectedByHumainAndElec}             | ${"du vendredi 17 mai à 10:00 au vendredi 17 mai à 18:00"}
      ${[humain]}       | ${REJECTED}  | ${REVIEWING} | ${REVIEWING}            | ${rejectedByHumainAndApprovedByMatosWithoutInquiries.general.name} | ${rejectedByHumainAndApprovedByMatosWithoutInquiries} | ${"du vendredi 17 mai à 10:00 au vendredi 17 mai à 18:00"}
    `(
      "when $rejectors rejected the task $taskName",
      ({ task, humain, matos, elec, firstMobilizationHumanReadable }) => {
        describe("when trying to add mobilization", () => {
          const form = friday10hfriday11hMobilization.form;
          it("should add mobilization", async () => {
            const { mobilizations } = await prepare.addMobilization(
              task.id,
              form,
              noel,
            );
            expect(mobilizations).toHaveLength(task.mobilizations.length + 1);
          });
          if (task.inquiries.length > 0) {
            describe("when task has inquiries", () => {
              it("should reset all approver review status to under review", async () => {
                const updated = await prepare.addMobilization(
                  task.id,
                  form,
                  noel,
                );
                if (isDraft(updated)) return;

                expect(updated.reviews.humain).toBe(humain);
                expect(updated.reviews.matos).toBe(matos);
                expect(updated.reviews.elec).toBe(elec);
              });
              it("should add RESET_REVIEW key event to history", async () => {
                const readablePeriod =
                  "du vendredi 17 mai à 10:00 au vendredi 17 mai à 11:00";
                const { history } = await prepare.addMobilization(
                  task.id,
                  form,
                  noel,
                );
                expect(history).toStrictEqual([
                  ...task.history,
                  {
                    action: RESET_REVIEW,
                    by: noel,
                    at: expect.any(Date),
                    description: `Précédentes approbations réinitialisées par l'ajout d'une mobilisation ${readablePeriod}`,
                  },
                ]);
              });
            });
          } else {
            describe("when task has no inquiries", () => {
              it("should keep all approver review status", async () => {
                const updated = await prepare.addMobilization(
                  task.id,
                  form,
                  noel,
                );
                if (isDraft(updated)) return;

                expect(updated.reviews).toStrictEqual(task.reviews);
              });
              it("should not add event to history", async () => {
                const { history } = await prepare.addMobilization(
                  task.id,
                  form,
                  noel,
                );
                expect(history).toStrictEqual(task.history);
              });
            });
          }
        });

        if (task.mobilizations.length > 1) {
          describe("when trying to remove mobilization which is not the last", () => {
            const mobilization = task.mobilizations[0];
            it("should remove mobilization", async () => {
              const { mobilizations } = await prepare.removeMobilization(
                task.id,
                mobilization.id,
                noel,
              );
              expect(mobilizations).toHaveLength(task.mobilizations.length - 1);
            });
            if (task.inquiries.length > 0) {
              describe("when task has inquiries", () => {
                it("should reset all approver review status to under review", async () => {
                  const updated = await prepare.removeMobilization(
                    task.id,
                    mobilization.id,
                    noel,
                  );
                  if (isDraft(updated)) return;

                  expect(updated.reviews.humain).toBe(humain);
                  expect(updated.reviews.matos).toBe(matos);
                  expect(updated.reviews.elec).toBe(elec);
                });
                it("should add RESET_REVIEW key event to history", async () => {
                  const { history } = await prepare.removeMobilization(
                    task.id,
                    mobilization.id,
                    noel,
                  );
                  expect(history).toStrictEqual([
                    ...task.history,
                    {
                      action: RESET_REVIEW,
                      by: noel,
                      at: expect.any(Date),
                      description: `Précédentes approbations réinitialisées par la suppression de la mobilisation ${firstMobilizationHumanReadable}`,
                    },
                  ]);
                });
              });
            } else {
              describe("when task has no inquiries", () => {
                it("should keep all approver review status", async () => {
                  const updated = await prepare.removeMobilization(
                    task.id,
                    mobilization.id,
                    noel,
                  );
                  if (isDraft(updated)) return;

                  expect(updated.reviews).toStrictEqual(task.reviews);
                });
                it("should not add event to history", async () => {
                  const { history } = await prepare.removeMobilization(
                    task.id,
                    mobilization.id,
                    noel,
                  );
                  expect(history).toStrictEqual(task.history);
                });
              });
            }
          });
        }
        describe.each`
          field                         | instigator | update                                              | start                          | end                          | durationSplitInHour
          ${"start"}                    | ${noel}    | ${{ start: friday9h.date }}                         | ${friday9h.date}               | ${task.mobilizations[0].end} | ${task.mobilizations[0].durationSplitInHour}
          ${"end"}                      | ${noel}    | ${{ end: sunday04h.date }}                          | ${task.mobilizations[0].start} | ${sunday04h.date}            | ${task.mobilizations[0].durationSplitInHour}
          ${"split duration"}           | ${noel}    | ${{ durationSplitInHour: 1 }}                       | ${task.mobilizations[0].start} | ${task.mobilizations[0].end} | ${1}
          ${"start and split duration"} | ${noel}    | ${{ start: friday9h.date, durationSplitInHour: 1 }} | ${friday9h.date}               | ${task.mobilizations[0].end} | ${1}
        `(
          "when trying to update $field of existing mobilization",
          ({ field, instigator, update, start, end, durationSplitInHour }) => {
            const mobilization = task.mobilizations[0];
            it(`should update ${field} accordingly`, async () => {
              const { mobilizations } = await prepare.updateMobilization(
                task.id,
                mobilization.id,
                update,
                instigator,
              );
              const updated = mobilizations[0];

              expect(updated?.start).toBe(start);
              expect(updated?.end).toBe(end);
              expect(updated?.durationSplitInHour).toBe(durationSplitInHour);
            });
            if (task.inquiries.length > 0) {
              describe("when task has inquiries", () => {
                it("should reset all approver review status to under review", async () => {
                  const updated = await prepare.updateMobilization(
                    task.id,
                    mobilization.id,
                    update,
                    instigator,
                  );
                  if (isDraft(updated)) return;

                  expect(updated.reviews.humain).toBe(humain);
                  expect(updated.reviews.matos).toBe(matos);
                  expect(updated.reviews.elec).toBe(elec);
                });
                it("should add RESET_REVIEW key event to history", async () => {
                  const { history } = await prepare.updateMobilization(
                    task.id,
                    mobilization.id,
                    update,
                    instigator,
                  );
                  expect(history).toStrictEqual([
                    ...task.history,
                    {
                      action: RESET_REVIEW,
                      by: instigator,
                      at: expect.any(Date),
                      description: `Précédentes approbations réinitialisées par un changement sur la mobilisation ${firstMobilizationHumanReadable}`,
                    },
                  ]);
                });
              });
            } else {
              describe("when task has no inquiries", () => {
                it("should keep all approver review status", async () => {
                  const updated = await prepare.updateMobilization(
                    task.id,
                    mobilization.id,
                    update,
                    instigator,
                  );
                  if (isDraft(updated)) return;

                  expect(updated.reviews).toStrictEqual(task.reviews);
                });
                it("should not add event to history", async () => {
                  const { history } = await prepare.updateMobilization(
                    task.id,
                    mobilization.id,
                    update,
                    instigator,
                  );
                  expect(history).toStrictEqual(task.history);
                });
              });
            }
          },
        );
      },
    );
  });
});
