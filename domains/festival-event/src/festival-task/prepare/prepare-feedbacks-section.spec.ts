import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalTask } from "./prepare";
import {
  installEscapeGame,
  lea,
  noel,
  presentEscapeGame,
  uninstallEscapeGame,
} from "../festival-task.test-util";
import { InMemoryFestivalTasks } from "./festival-tasks.inmemory";
import { InMemoryVolunteerConflicts } from "../volunteer-conflicts.inmemory";
import { FestivalTaskTranslator } from "../volunteer-conflicts";

describe("Prepare festival task feedbacks section", () => {
  let prepare: PrepareFestivalTask;
  beforeEach(() => {
    const tasks = [installEscapeGame, uninstallEscapeGame, presentEscapeGame];
    const festivalTasks = new InMemoryFestivalTasks(tasks);
    const volunteerConflicts = new InMemoryVolunteerConflicts(tasks, []);
    const translator = new FestivalTaskTranslator(volunteerConflicts);
    prepare = new PrepareFestivalTask(festivalTasks, translator);
  });
  it.each`
    taskName                            | taskId                    | author  | content
    ${installEscapeGame.general.name}   | ${installEscapeGame.id}   | ${noel} | ${"Tu devrais ajouter des détails dans la description."}
    ${uninstallEscapeGame.general.name} | ${uninstallEscapeGame.id} | ${lea}  | ${"Ça me parait beaucoup comme demande matos"}
  `(
    "should be able to publish a feedback on $taskName",
    async ({ taskId, author, content }) => {
      const { feedbacks } = await prepare.publishFeedback(taskId, {
        author,
        content,
      });
      expect(feedbacks).toContainEqual({
        author,
        content,
        publishedAt: expect.any(Date),
      });
    },
  );

  describe("when publishing several feedbacks", () => {
    it("should list all published feedbacks", async () => {
      const leaFeedback = {
        author: lea,
        content: "Ça me parait beaucoup comme demande matos",
      };
      await prepare.publishFeedback(installEscapeGame.id, leaFeedback);

      const noelFeedback = {
        author: noel,
        content: "J'ai vu avec le prestataire et c'est pour lui le minimum",
      };
      const { feedbacks } = await prepare.publishFeedback(
        installEscapeGame.id,
        noelFeedback,
      );

      expect(feedbacks).toContainEqual({
        ...leaFeedback,
        publishedAt: expect.any(Date),
      });
      expect(feedbacks).toContainEqual({
        ...noelFeedback,
        publishedAt: expect.any(Date),
      });
    });
  });
});
