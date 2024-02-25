import { beforeEach, describe, expect, it } from "vitest";
import {
  installEscapeGame,
  uninstallEscapeGame,
  presentEscapeGame,
  guardJustDance,
  installBarbecue,
} from "../festival-task.test-util";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { PrepareFestivalTask } from "./prepare";
import { ficelle, sacPoubelle } from "../festival-task.test-util";
import { GearAlreadyRequested } from "../festival-task.error";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";
import { approvedByMatos } from "../festival-task.test-util";

describe("Prepare festival task inquiries list", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const tasks = [
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
      guardJustDance,
      installBarbecue,
      approvedByMatos,
    ];
    const festivalTasks = new InMemoryFestivalTasks(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    prepare = new PrepareFestivalTask(festivalTasks, translator);
  });
  describe("Add inquiry", () => {
    describe("when inquiry is about a new gear", () => {
      it("should add inquiry to the list", async () => {
        const task = installEscapeGame;
        const inquiry = { ...ficelle, quantity: 1 };

        const { inquiries } = await prepare.addInquiry(task.id, inquiry);

        expect(inquiries).toHaveLength(task.inquiries.length + 1);
        expect(inquiries).toContainEqual(inquiry);
      });
    });
    describe("when adding several inquiries in a row", () => {
      it("should add all inquiries to the list", async () => {
        const task = installEscapeGame;
        const ficelleInquiry = { ...ficelle, quantity: 1 };
        const sacPoubelleInquiry = { ...sacPoubelle, quantity: 2 };

        await prepare.addInquiry(task.id, ficelleInquiry);
        const { inquiries } = await prepare.addInquiry(
          task.id,
          sacPoubelleInquiry,
        );

        expect(inquiries).toContainEqual(ficelleInquiry);
        expect(inquiries).toContainEqual(sacPoubelleInquiry);
      });
    });
    describe("when addinq inquiry in an in review task", () => {
      it("should add inquiry to the list", async () => {
        const task = guardJustDance;
        const inquiry = { ...ficelle, quantity: 1 };

        const { inquiries } = await prepare.addInquiry(task.id, inquiry);

        expect(inquiries).toHaveLength(task.inquiries.length + 1);
        expect(inquiries).toContainEqual(inquiry);
      });
    });
    describe.each`
      taskName                        | taskStatus                | task               | inquiry
      ${guardJustDance.general.name}  | ${guardJustDance.status}  | ${guardJustDance}  | ${{ ...ficelle, quantity: 2 }}
      ${installBarbecue.general.name} | ${installBarbecue.status} | ${installBarbecue} | ${{ ...sacPoubelle, quantity: 1 }}
    `(
      "when adding inquiry from $taskName task with status $taskStatus",
      ({ task, inquiry }) => {
        it("should remove it from inquiries list", async () => {
          const { inquiries } = await prepare.addInquiry(task.id, inquiry);

          expect(inquiries).toHaveLength(task.inquiries.length + 1);
          expect(inquiries).toContainEqual(inquiry);
        });
      },
    );
    describe("when adding inquiry when matos approved the task", () => {
      it("should indicate that inquiries are locked", async () => {
        const inquiry = { ...ficelle, quantity: 1 };
        expect(
          async () => await prepare.addInquiry(approvedByMatos.id, inquiry),
        ).rejects.toThrow("La FT a déjà été validée par l'équipe matos.");
      });
    });
    describe("when inquiry is about an already required gear", () => {
      it("should indicate that there is already a request for it", () => {
        const task = uninstallEscapeGame;
        const inquiry = { ...sacPoubelle, quantity: 1 };
        expect(
          async () => await prepare.addInquiry(task.id, inquiry),
        ).rejects.toThrow(GearAlreadyRequested);
      });
    });
  });
  describe("Remove inquiry", () => {
    describe("when removing a requested inquiry", () => {
      it("should remove it from inquiries list", async () => {
        const task = uninstallEscapeGame;
        const inquiry = task.inquiries[0];
        const expectedLength = task.inquiries.length - 1;

        const { inquiries } = await prepare.removeInquiry(
          task.id,
          inquiry.slug,
        );

        expect(inquiries).toHaveLength(expectedLength);
      });
    });
    describe.each`
      taskName                        | taskStatus                | task               | inquiry
      ${guardJustDance.general.name}  | ${guardJustDance.status}  | ${guardJustDance}  | ${guardJustDance.inquiries[0]}
      ${installBarbecue.general.name} | ${installBarbecue.status} | ${installBarbecue} | ${installBarbecue.inquiries[0]}
    `(
      "when removing inquiry from $taskName task with status $taskStatus",
      ({ task, inquiry }) => {
        it("should remove it from inquiries list", async () => {
          const { inquiries } = await prepare.removeInquiry(
            task.id,
            inquiry.slug,
          );

          expect(inquiries).toHaveLength(task.inquiries.length - 1);
        });
      },
    );
    describe("when removing inquiry when matos approved the task", () => {
      it("should indicate that inquiries are locked", async () => {
        const inquiry = { ...ficelle, quantity: 1 };
        expect(
          async () => await prepare.addInquiry(approvedByMatos.id, inquiry),
        ).rejects.toThrow("La FT a déjà été validée par l'équipe matos.");
      });
    });
    describe("when removing not requested inquiry", () => {
      it("should keep inquiries list unchanged", async () => {
        const task = uninstallEscapeGame;
        const slug = "not-requested-inquiry";

        const { inquiries } = await prepare.removeInquiry(task.id, slug);

        expect(inquiries).toStrictEqual(task.inquiries);
      });
    });
  });
});
