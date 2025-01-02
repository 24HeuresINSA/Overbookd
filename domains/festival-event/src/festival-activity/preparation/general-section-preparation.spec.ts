import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity.js";
import {
  FestivalActivityError,
  TimeWindowAlreadyExists,
} from "../festival-activity.error.js";
import { EndBeforeStart } from "@overbookd/time";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory.js";
import {
  baladeEnPoney,
  escapeGame,
  justDance,
  pcSecurite,
  qgOrga,
  approvedByHumain,
  approvedByCommunication,
  validatedBySecu,
  publicApprovedByHumain,
} from "./preparation.test-utils.js";
import { NOT_ASKING_TO_REVIEW, REVIEWING } from "../../common/review.js";
import { PrepareError } from "./prepare-in-review-festival-activity.js";
import {
  friday11hToFriday15h,
  sunday14hToSunday18h,
} from "../festival-activity.fake.js";
import { isDraft } from "../../festival-event.js";

describe("General section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      pcSecurite,
      justDance,
      baladeEnPoney,
      qgOrga,
      approvedByHumain,
      approvedByCommunication,
      validatedBySecu,
      publicApprovedByHumain,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe.each`
    fields                                                       | activityName               | activityId       | update                                                                                                                                                           | name                            | description                       | categories                          | toPublish                       | photoLink                         | isFlagship                       | timeWindows
    ${"name"}                                                    | ${escapeGame.general.name} | ${escapeGame.id} | ${{ name: "Laser Game" }}                                                                                                                                        | ${"Laser Game"}                 | ${escapeGame.general.description} | ${escapeGame.general.categories}    | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"name"}                                                    | ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ name: "PC Sécurité" }}                                                                                                                                       | ${"PC Sécurité"}                | ${pcSecurite.general.description} | ${pcSecurite.general.categories}    | ${pcSecurite.general.toPublish} | ${pcSecurite.general.photoLink}   | ${pcSecurite.general.isFlagship} | ${pcSecurite.general.timeWindows}
    ${"name"}                                                    | ${justDance.general.name}  | ${justDance.id}  | ${{ name: "Dance Battle" }}                                                                                                                                      | ${"Dance Battle"}               | ${justDance.general.description}  | ${justDance.general.categories}     | ${justDance.general.toPublish}  | ${justDance.general.photoLink}    | ${justDance.general.isFlagship}  | ${justDance.general.timeWindows}
    ${"description"}                                             | ${escapeGame.general.name} | ${escapeGame.id} | ${{ description: "Trouve la sortie" }}                                                                                                                           | ${escapeGame.general.name}      | ${"Trouve la sortie"}             | ${escapeGame.general.categories}    | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"description"}                                             | ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ description: "Ici le mirador" }}                                                                                                                             | ${pcSecurite.general.name}      | ${"Ici le mirador"}               | ${pcSecurite.general.categories}    | ${pcSecurite.general.toPublish} | ${pcSecurite.general.photoLink}   | ${pcSecurite.general.isFlagship} | ${pcSecurite.general.timeWindows}
    ${"categories"}                                              | ${escapeGame.general.name} | ${escapeGame.id} | ${{ categories: ["Culture", "Sport"] }}                                                                                                                          | ${escapeGame.general.name}      | ${escapeGame.general.description} | ${["Culture", "Sport"]}             | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"photoLink"}                                               | ${escapeGame.general.name} | ${escapeGame.id} | ${{ photoLink: "https://instagram.com/123456" }}                                                                                                                 | ${escapeGame.general.name}      | ${escapeGame.general.description} | ${escapeGame.general.categories}    | ${escapeGame.general.toPublish} | ${"https://instagram.com/123456"} | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"photoLink"}                                               | ${justDance.general.name}  | ${justDance.id}  | ${{ photoLink: "https://instagram.com/561724" }}                                                                                                                 | ${justDance.general.name}       | ${justDance.general.description}  | ${justDance.general.categories}     | ${justDance.general.toPublish}  | ${"https://instagram.com/561724"} | ${justDance.general.isFlagship}  | ${justDance.general.timeWindows}
    ${"isFlagship"}                                              | ${escapeGame.general.name} | ${escapeGame.id} | ${{ isFlagship: false }}                                                                                                                                         | ${escapeGame.general.name}      | ${escapeGame.general.description} | ${escapeGame.general.categories}    | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${false}                         | ${escapeGame.general.timeWindows}
    ${"isFlagship"}                                              | ${justDance.general.name}  | ${justDance.id}  | ${{ isFlagship: true }}                                                                                                                                          | ${justDance.general.name}       | ${justDance.general.description}  | ${justDance.general.categories}     | ${justDance.general.toPublish}  | ${justDance.general.photoLink}    | ${true}                          | ${justDance.general.timeWindows}
    ${"name and description"}                                    | ${escapeGame.general.name} | ${escapeGame.id} | ${{ name: "Nuit de la Qlture", description: "Montre comment tu es culturé" }}                                                                                    | ${"Nuit de la Qlture"}          | ${"Montre comment tu es culturé"} | ${escapeGame.general.categories}    | ${escapeGame.general.toPublish} | ${escapeGame.general.photoLink}   | ${escapeGame.general.isFlagship} | ${escapeGame.general.timeWindows}
    ${"toPublish and categories"}                                | ${justDance.general.name}  | ${justDance.id}  | ${{ toPublish: false, categories: ["Culture", "Orga"] }}                                                                                                         | ${justDance.general.name}       | ${justDance.general.description}  | ${["Culture", "Orga"]}              | ${false}                        | ${null}                           | ${false}                         | ${justDance.general.timeWindows}
    ${"name, description and categories"}                        | ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ name: "Poste de Contrôle Sécurité", description: "Safety fi(r)st !", categories: ["securite"] }}                                                             | ${"Poste de Contrôle Sécurité"} | ${"Safety fi(r)st !"}             | ${["securite"]}                     | ${pcSecurite.general.toPublish} | ${pcSecurite.general.photoLink}   | ${pcSecurite.general.isFlagship} | ${pcSecurite.general.timeWindows}
    ${"categories, isFlagship and photoLink"}                    | ${escapeGame.general.name} | ${escapeGame.id} | ${{ categories: ["Sport", "Enfant"], photoLink: "https://pinterest.com/12345", isFlagship: false }}                                                              | ${escapeGame.general.name}      | ${escapeGame.general.description} | ${["Sport", "Enfant"]}              | ${escapeGame.general.toPublish} | ${"https://pinterest.com/12345"}  | ${false}                         | ${escapeGame.general.timeWindows}
    ${"toPublish, isFlagship, categories and photoLink"}         | ${pcSecurite.general.name} | ${pcSecurite.id} | ${{ toPublish: true, isFlagship: true, categories: ["securite", "tour de controle"], photoLink: "https://pinterest.com/45721" }}                                 | ${pcSecurite.general.name}      | ${pcSecurite.general.description} | ${["securite", "tour de controle"]} | ${true}                         | ${"https://pinterest.com/45721"}  | ${true}                          | ${pcSecurite.general.timeWindows}
    ${"name, description, categories, isFlagship and photoLink"} | ${escapeGame.general.name} | ${escapeGame.id} | ${{ name: "Lancer de haches", description: "Réveille le Viking", categories: ["Sport", "Enfant"], photoLink: "https://pinterest.com/12345", isFlagship: false }} | ${"Lancer de haches"}           | ${"Réveille le Viking"}           | ${["Sport", "Enfant"]}              | ${escapeGame.general.toPublish} | ${"https://pinterest.com/12345"}  | ${false}                         | ${escapeGame.general.timeWindows}
  `(
    "when updating $fields from $activityName",
    ({
      fields,
      activityId,
      update,
      name,
      description,
      categories,
      toPublish,
      photoLink,
      isFlagship,
      timeWindows,
    }) => {
      it(`should only update ${fields}`, async () => {
        const { general } = await prepareFestivalActivity.updateGeneralSection(
          activityId,
          update,
        );

        expect(general.name).toBe(name);
        expect(general.description).toBe(description);
        expect(general.categories).toEqual(categories);
        expect(general.toPublish).toBe(toPublish);
        expect(general.photoLink).toBe(photoLink);
        expect(general.isFlagship).toBe(isFlagship);
        expect(general.timeWindows).toEqual(timeWindows);
      });
    },
  );

  describe("when setting a public activity as private", () => {
    describe("when activity is in review", () => {
      it("should remove communication from reviewers", async () => {
        const update = { toPublish: false };

        const activity = await prepareFestivalActivity.updateGeneralSection(
          justDance.id,
          update,
        );
        if (isDraft(activity)) throw new Error("Activity should not be draft");

        expect(activity.reviews.communication).toBe(NOT_ASKING_TO_REVIEW);
      });
    });

    it.each`
      activityId       | activityName
      ${escapeGame.id} | ${escapeGame.general.name}
      ${justDance.id}  | ${justDance.general.name}
    `(
      "should reset $activityName photolink and isFlagship",
      async ({ activityId }) => {
        const update = { toPublish: false };

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          activityId,
          update,
        );

        expect(general.isFlagship).toBe(false);
        expect(general.photoLink).toBe(null);
        expect(general.isFlagship).toBe(false);
      },
    );
  });

  describe("when setting a private activity as public", () => {
    describe("when activity is in review", () => {
      describe("when missing required public fields", () => {
        it.each`
          update                                           | field
          ${{}}                                            | ${"categories"}
          ${{ categories: ["Securite"] }}                  | ${"photoLink"}
          ${{ photoLink: "https://instagram.com/123456" }} | ${"categories"}
        `(
          "should indicate that required $field field is missing",
          async ({ update }) => {
            const toPublish = {
              toPublish: true,
              ...update,
            };
            expect(
              async () =>
                await prepareFestivalActivity.updateGeneralSection(
                  pcSecurite.id,
                  toPublish,
                ),
            ).rejects.toThrow(PrepareError.IsNotPublicActivity);
          },
        );
      });

      it("should add communication to reviewers", async () => {
        const update = {
          toPublish: true,
          photoLink: "https://pinterest.com/123",
          categories: ["secu"],
        };

        const activity = await prepareFestivalActivity.updateGeneralSection(
          pcSecurite.id,
          update,
        );
        if (isDraft(activity))
          throw new FestivalActivityError("Activity should not be draft");

        expect(activity.reviews.communication).toBe(REVIEWING);
      });
    });
  });

  describe("when adherent want to update multiple fields consecutively", () => {
    describe("when adherent want to update name then description in 2 times", () => {
      it("should update both name and description", async () => {
        const updateName = { name: "Laser game" };
        const updateDescription = {
          description: "Tire sur les gens avec un pistolet laser",
        };

        await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          updateName,
        );

        const { general } = await prepareFestivalActivity.updateGeneralSection(
          escapeGame.id,
          updateDescription,
        );

        expect(general.name).toBe(updateName.name);
        expect(general.description).toBe(updateDescription.description);
      });
    });
  });

  describe.each`
    timeWindow                                                                                | activityName               | activity      | expectedId
    ${{ start: new Date("2023-05-17T08:00+02:00"), end: new Date("2023-05-17T09:00+02:00") }} | ${escapeGame.general.name} | ${escapeGame} | ${"28071720-28071780"}
    ${{ start: new Date("2024-05-17T08:00+02:00"), end: new Date("2024-05-17T18:00+02:00") }} | ${pcSecurite.general.name} | ${pcSecurite} | ${"28598760-28599360"}
    ${{ start: new Date("2024-05-19T14:00+02:00"), end: new Date("2024-05-19T18:00+02:00") }} | ${justDance.general.name}  | ${justDance}  | ${"28602000-28602240"}
  `(
    "when adherent want to add a time window in $activityName",
    ({ timeWindow, activity, expectedId }) => {
      it("should add the time window", async () => {
        const { general } =
          await prepareFestivalActivity.addTimeWindowInGeneral(
            activity.id,
            timeWindow,
          );

        const expectedTimeWindow = { ...timeWindow, id: expectedId };
        expect(general.timeWindows).toContainEqual(expectedTimeWindow);
      });

      describe("when adherent want to add a time window that already exists", () => {
        it("should indicate that the time window already exists", async () => {
          const existingTimeWindow = activity.general.timeWindows[0];

          await expect(
            prepareFestivalActivity.addTimeWindowInGeneral(
              activity.id,
              existingTimeWindow,
            ),
          ).rejects.toThrow(TimeWindowAlreadyExists);
        });
      });

      describe("when adherent want to add a time window with end before start", () => {
        it("should indicate that end should be after start", async () => {
          const invalidTimeWindow = {
            start: new Date("2023-05-17T09:00+02:00"),
            end: new Date("2023-05-17T08:00+02:00"),
          };

          await expect(
            prepareFestivalActivity.addTimeWindowInGeneral(
              activity.id,
              invalidTimeWindow,
            ),
          ).rejects.toThrow(EndBeforeStart);
        });
      });
    },
  );

  describe.each`
    update                  | activityName                  | activity         | toUpdate                                | expectedId
    ${friday11hToFriday15h} | ${escapeGame.general.name}    | ${escapeGame}    | ${escapeGame.general.timeWindows[0]}    | ${friday11hToFriday15h.id}
    ${sunday14hToSunday18h} | ${justDance.general.name}     | ${justDance}     | ${justDance.general.timeWindows[0]}     | ${sunday14hToSunday18h.id}
    ${friday11hToFriday15h} | ${baladeEnPoney.general.name} | ${baladeEnPoney} | ${baladeEnPoney.general.timeWindows[0]} | ${friday11hToFriday15h.id}
  `(
    "when adherent want to update a time window in $activityName",
    ({ update, activity, toUpdate, expectedId }) => {
      it("should update the time window", async () => {
        const { general } =
          await prepareFestivalActivity.updateTimeWindowInGeneral(
            activity.id,
            toUpdate.id,
            update,
          );

        const expectedTimeWindow = { ...update, id: expectedId };
        expect(general.timeWindows).toContainEqual(expectedTimeWindow);
      });
      describe("when adherent want to update a time window that doesn't exist", () => {
        it("should indicate that the time window doesn't exist", async () => {
          await expect(
            prepareFestivalActivity.updateTimeWindowInGeneral(
              activity.id,
              "132-456",
              friday11hToFriday15h,
            ),
          ).rejects.toThrow(PrepareError.TimeWindowNotFound);
        });
      });
      describe("when adherent want to update a time window with end before start", () => {
        it("should indicate that end should be after start", async () => {
          const invalidTimeWindow = {
            start: new Date("2023-05-17T09:00+02:00"),
            end: new Date("2023-05-17T08:00+02:00"),
          };

          await expect(
            prepareFestivalActivity.updateTimeWindowInGeneral(
              activity.id,
              toUpdate.id,
              invalidTimeWindow,
            ),
          ).rejects.toThrow(EndBeforeStart);
        });
      });
    },
  );

  describe("when adherent want to remove a time window", () => {
    describe("when trying to remove the last one on a public in review activity", () => {
      it("should indicate that we can't remove the last time window", async () => {
        const timeWindow = justDance.general.timeWindows[0];
        expect(
          async () =>
            await prepareFestivalActivity.removeTimeWindowFromGeneral(
              justDance.id,
              timeWindow.id,
            ),
        ).rejects.toThrow(PrepareError.NeedAtLeastOneTimeWindow);
      });
    });

    it.each`
      activity           | activityName
      ${escapeGame}      | ${escapeGame.general.name}
      ${baladeEnPoney}   | ${baladeEnPoney.general.name}
      ${validatedBySecu} | ${validatedBySecu.general.name}
    `(
      "should remove the time window from $activityName",
      async ({ activity }) => {
        const timeWindowToRemove = activity.general.timeWindows[0];

        const { general } =
          await prepareFestivalActivity.removeTimeWindowFromGeneral(
            activity.id,
            timeWindowToRemove.id,
          );

        expect(general.timeWindows).not.toContainEqual(timeWindowToRemove);
      },
    );
  });

  describe.each`
    activityName                            | activityId                    | toAdd                   | timeWindow                                        | update
    ${approvedByCommunication.general.name} | ${approvedByCommunication.id} | ${sunday14hToSunday18h} | ${approvedByCommunication.general.timeWindows[0]} | ${{ description: "Awsome" }}
  `(
    "when $activityName was already validated by communication",
    ({ activityId, toAdd, timeWindow, update }) => {
      describe("when trying to add a timeWindow", () => {
        it("should be able to add time window", async () => {
          const { general } =
            await prepareFestivalActivity.addTimeWindowInGeneral(
              activityId,
              toAdd,
            );

          expect(general.timeWindows).toContainEqual(toAdd);
        });
      });
      describe("when trying to update a timeWindow", () => {
        it("should be able to update time window", async () => {
          const { general } =
            await prepareFestivalActivity.updateTimeWindowInGeneral(
              activityId,
              timeWindow.id,
              toAdd,
            );

          expect(general.timeWindows).toContainEqual(toAdd);
        });
      });
      describe("when trying to remove a timeWindow", () => {
        it("should be able to remove time window", async () => {
          const { general } =
            await prepareFestivalActivity.removeTimeWindowFromGeneral(
              activityId,
              timeWindow.id,
            );

          expect(general.timeWindows).not.toContainEqual(toAdd);
        });
      });
      describe("when trying to update general information", () => {
        it("should indicate that general section is locked", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.updateGeneralSection(
                activityId,
                update,
              ),
          ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
        });
      });
    },
  );

  describe.each`
    activityName                           | activityId                   | toAdd                   | timeWindow
    ${approvedByHumain.general.name}       | ${approvedByHumain.id}       | ${sunday14hToSunday18h} | ${approvedByHumain.general.timeWindows[0]}
    ${publicApprovedByHumain.general.name} | ${publicApprovedByHumain.id} | ${sunday14hToSunday18h} | ${publicApprovedByHumain.general.timeWindows[0]}
  `(
    "when $activityName was already validated by humain",
    ({ activityId, toAdd, timeWindow }) => {
      describe("when trying to add a timeWindow", () => {
        it("should indicate that general section is locked", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.addTimeWindowInGeneral(
                activityId,
                toAdd,
              ),
          ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
        });
      });
      describe("when trying to update a timeWindow", () => {
        it("should indicate that general section is locked", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.updateTimeWindowInGeneral(
                activityId,
                timeWindow.id,
                toAdd,
              ),
          ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
        });
      });
      describe("when trying to remove a timeWindow", () => {
        it("should indicate that general section is locked", async () => {
          expect(
            async () =>
              await prepareFestivalActivity.removeTimeWindowFromGeneral(
                activityId,
                timeWindow.id,
              ),
          ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
        });
      });
    },
  );
  describe("when trying to update 'description'", () => {
    describe("when public activity is only validated by humain", () => {
      it("should be able to update general information", async () => {
        const update = { description: "An updated description" };
        const { general } = await prepareFestivalActivity.updateGeneralSection(
          publicApprovedByHumain.id,
          update,
        );
        expect(general.description).toBe(update.description);
      });
    });
    describe("when private activity is already validated by humain", () => {
      it("should indicate that general section is locked", async () => {
        const update = { description: "An updated description" };
        expect(
          async () =>
            await prepareFestivalActivity.updateGeneralSection(
              approvedByHumain.id,
              update,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
  });
});
