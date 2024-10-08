import { beforeEach, describe, expect, it } from "vitest";
import {
  installEscapeGame,
  uninstallEscapeGame,
} from "../festival-task.fake.js";
import {
  presentEscapeGame,
  guardJustDance,
  installBarbecue,
  onlyApprovedByHumain,
} from "../festival-task.fake.js";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory.js";
import { PrepareFestivalTask } from "./prepare.js";
import { ficelle, sacPoubelle } from "../festival-task.test-util.js";
import { GearAlreadyRequested } from "../festival-task.error.js";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory.js";
import { FestivalTaskTranslator } from "../volunteer-conflicts.js";
import { onlyApprovedByMatos } from "../festival-task.fake.js";
import { APPROVED } from "../../common/action.js";
import { REVIEWING } from "../../common/review.js";
import { isDraft } from "../../festival-event.js";
import { PARKING_EIFFEL } from "../../common/inquiry-request.js";
import { AssignDriveInDraft } from "../../common/inquiry-request.error.js";

describe("Prepare festival task inquiries list", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const tasks = [
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
      guardJustDance,
      installBarbecue,
      onlyApprovedByMatos,
      onlyApprovedByHumain,
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
        it("should add it to inquiries list", async () => {
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
          async () => await prepare.addInquiry(onlyApprovedByMatos.id, inquiry),
        ).rejects.toThrow("La FT a déjà été validée par l'équipe matos.");
      });
    });
    describe("when adding inquiry when only humain approved the task", () => {
      it("should add it to inquiries list", async () => {
        const task = onlyApprovedByHumain;
        const inquiry = { ...ficelle, quantity: 1 };

        const { inquiries } = await prepare.addInquiry(task.id, inquiry);

        expect(inquiries).toHaveLength(task.inquiries.length + 1);
        expect(inquiries).toContainEqual(inquiry);
      });
      it("should keep same reviews", async () => {
        const task = onlyApprovedByHumain;
        const inquiry = { ...ficelle, quantity: 1 };

        const updatedTask = await prepare.addInquiry(task.id, inquiry);
        if (isDraft(updatedTask)) throw new Error();

        expect(updatedTask.reviews.humain).toBe(APPROVED);
        expect(updatedTask.reviews.matos).toBe(REVIEWING);
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
        const inquiry = onlyApprovedByMatos.inquiries[0];
        expect(
          async () =>
            await prepare.removeInquiry(onlyApprovedByMatos.id, inquiry.slug),
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
  describe("Assign inquiry to drive", () => {
    describe("when trying to assign a drive to an inquiry request from a draft festival task", () => {
      it("should indicate that we can't assign drive to inquiry request from draft festival task", async () => {
        expect(
          async () =>
            await prepare.assignInquiryToDrive(installEscapeGame.id, {
              slug: ficelle.slug,
              drive: PARKING_EIFFEL,
            }),
        ).rejects.toThrow(AssignDriveInDraft);
      });
    });
    describe("when assigning a drive to an inquiry request", () => {
      it("should update the inquiry request", async () => {
        const task = guardJustDance;
        const inquiry = task.inquiries[0];
        const drive = PARKING_EIFFEL;

        const { inquiries } = await prepare.assignInquiryToDrive(task.id, {
          slug: inquiry.slug,
          drive,
        });

        expect(inquiries).toContainEqual({ ...inquiry, drive });
      });
    });
  });
});
