import { beforeEach, describe, expect, it } from "vitest";
import {
  installEscapeGame,
  uninstallEscapeGame,
  presentEscapeGame,
  friday11hfriday18hMobilization,
  saturday11hsaturday18hMobilization,
} from "../festival-task.test-util";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { PrepareFestivalTask } from "./prepare";
import {
  MobilizationAlreadyExist,
  SplitDurationIsNotPeriodDivider,
} from "../festival-task.error";

describe("Prepare festival task mobilizations list", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const festivalTasks = new InMemoryFestivalTasks([
      installEscapeGame,
      uninstallEscapeGame,
      presentEscapeGame,
    ]);
    prepare = new PrepareFestivalTask(festivalTasks);
  });
  describe("Add mobilization", () => {
    describe("when a new mobilization is added", () => {
      it("should add mobilization to mobilizations list", async () => {
        const task = installEscapeGame;
        const { mobilizations } = await prepare.addMobilization(
          task.id,
          friday11hfriday18hMobilization,
        );
        expect(mobilizations).toHaveLength(task.mobilizations.length + 1);
        expect(mobilizations).toContainEqual({
          ...friday11hfriday18hMobilization,
          id: expect.any(String),
        });
      });
    });
    describe("with split duration that is not period divider", () => {
      describe("when trying to add this as mobilization", () => {
        it("should indicate that split duration doesn't match period duration", async () => {
          const task = installEscapeGame;
          expect(
            async () =>
              await prepare.addMobilization(task.id, {
                ...friday11hfriday18hMobilization,
                durationSplitInHour: 2,
              }),
          ).rejects.toThrow(SplitDurationIsNotPeriodDivider);
        });
      });
    });
    describe("when adding several mobilizations in a row", () => {
      it("should add all mobilizations to mobilizations list", async () => {
        const task = installEscapeGame;
        await prepare.addMobilization(task.id, friday11hfriday18hMobilization);
        const { mobilizations } = await prepare.addMobilization(
          task.id,
          saturday11hsaturday18hMobilization,
        );
        expect(mobilizations).toHaveLength(2);
      });
    });
    describe("when adding a mobilization for the same period than an existing one", () => {
      it("should indicate an existing mobilization exist on the same period", async () => {
        const task = presentEscapeGame;
        expect(
          async () =>
            await prepare.addMobilization(
              task.id,
              saturday11hsaturday18hMobilization,
            ),
        ).rejects.toThrow(MobilizationAlreadyExist);
      });
    });
  });
});
