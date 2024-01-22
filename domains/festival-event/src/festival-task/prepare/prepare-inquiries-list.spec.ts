import { beforeEach, describe, expect, it } from "vitest";
import {
  installEscapeGame,
  uninstallEscapeGame,
  presentEscapeGame,
} from "../festival-task.test-util";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { PrepareFestivalTask } from "./prepare";
import { ficelle, sacPoubelle } from "../festival-task.test-util";
import { GearAlreadyRequested } from "../festival-task.error";

describe("Prepare festival task inquiries list", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const festivalTasks = new InMemoryFestivalTasks([
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
    ]);
    prepare = new PrepareFestivalTask(festivalTasks);
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
