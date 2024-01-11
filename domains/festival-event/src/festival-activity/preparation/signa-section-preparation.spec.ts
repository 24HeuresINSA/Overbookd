import { beforeEach, describe, expect, it } from "vitest";
import { PrepareFestivalActivity } from "./prepare-festival-activity";
import { InMemoryPrepareFestivalActivityRepository } from "./festival-activities.inmemory";
import {
  baladeEnPoney,
  escapeGame,
  justDance,
  pcSecurite,
  qgOrga,
  approvedBySigna,
} from "./preparation.test-utils";
import { PrepareSignageUpdate } from "./prepare-festival-activity.model";
import { AFFICHE, BACHE, PANNEAU, SignageCatalogItem } from "../sections/signa";
import {
  SignageAlreadyExists,
  SignageNotFound,
} from "../festival-activity.error";
import { LocationIsRequired } from "./section-aggregates/signages";
import { signa } from "../../common/review";
import { PrepareError } from "./prepare-in-review-festival-activity";
import { afficheJustDanceA2 } from "../festival-activity.fake";
import { agora, creuxCgu, local24h } from "../festival-activity.fake";
import { AssignCatalogItemInDraftActivity } from "./prepare-draft-festival-activity";

const panneauEscapeGameInCatalog: SignageCatalogItem = {
  id: 1,
  name: "Panneau Escape Game",
  type: PANNEAU,
};

const afficheJustDanceInCatalog: SignageCatalogItem = {
  id: 2,
  name: "Just Dance",
  type: AFFICHE,
};

const bacheBienvenueInCatalog: SignageCatalogItem = {
  id: 3,
  name: "Grande bâche Bienvenue",
  type: BACHE,
};

describe("Signa section of festival activity preparation", () => {
  let prepareFestivalActivity: PrepareFestivalActivity;
  let prepareFestivalActivities: InMemoryPrepareFestivalActivityRepository;

  beforeEach(() => {
    prepareFestivalActivities = new InMemoryPrepareFestivalActivityRepository([
      escapeGame,
      pcSecurite,
      justDance,
      baladeEnPoney,
      qgOrga,
      approvedBySigna,
    ]);
    prepareFestivalActivity = new PrepareFestivalActivity(
      prepareFestivalActivities,
    );
  });

  describe.each`
    activityName                  | activity         | location
    ${escapeGame.general.name}    | ${escapeGame}    | ${agora}
    ${escapeGame.general.name}    | ${escapeGame}    | ${null}
    ${escapeGame.general.name}    | ${escapeGame}    | ${null}
    ${pcSecurite.general.name}    | ${pcSecurite}    | ${creuxCgu}
    ${baladeEnPoney.general.name} | ${baladeEnPoney} | ${local24h}
  `(
    "when updating $activityName location for $location",
    ({ activity, location }) => {
      it("should only update location", async () => {
        const updateLocation = { location };

        const { signa } = await prepareFestivalActivity.updateSignaSection(
          activity.id,
          updateLocation,
        );

        expect(signa.location).toEqual(updateLocation.location);
        expect(signa.signages).toEqual(activity.signa.signages);
      });
    },
  );

  describe.each`
    activityName                  | activityId
    ${pcSecurite.general.name}    | ${pcSecurite.id}
    ${baladeEnPoney.general.name} | ${baladeEnPoney.id}
    ${justDance.general.name}     | ${justDance.id}
  `(
    "when trying to reset location to null on in review one like $activityName",
    ({ activityId }) => {
      it("should indicate that a location is required", () => {
        const update = { location: null };

        expect(async () =>
          prepareFestivalActivity.updateSignaSection(activityId, update),
        ).rejects.toThrow(LocationIsRequired);
      });
    },
  );

  describe("when adherent want to add a signage", () => {
    describe.each`
      activityName               | activityId       | text                              | size       | type       | quantity | comment        | expectedId
      ${escapeGame.general.name} | ${escapeGame.id} | ${"Affiche 24"}                   | ${"A3"}    | ${AFFICHE} | ${10}    | ${undefined}   | ${"affiche-affiche-24-a3"}
      ${justDance.general.name}  | ${justDance.id}  | ${"Dance hard"}                   | ${"A0"}    | ${AFFICHE} | ${4}     | ${"Fond bleu"} | ${"affiche-dance-hard-a0"}
      ${justDance.general.name}  | ${justDance.id}  | ${"Par ici"}                      | ${"10x2m"} | ${PANNEAU} | ${1}     | ${"Fond bleu"} | ${"panneau-par-ici-10x2m"}
      ${justDance.general.name}  | ${justDance.id}  | ${"FILE 10 MINUTES / COUPE-FILE"} | ${"10/2m"} | ${PANNEAU} | ${1}     | ${"Fond bleu"} | ${"panneau-file-10-minutes-coupe-file-10-2m"}
    `(
      "when adding $type $size $text on $activityName",
      ({ activityId, text, size, type, quantity, comment, expectedId }) => {
        it("should add the signage", async () => {
          const signage = { text, size, type, quantity, comment };
          const { signa } = await prepareFestivalActivity.addSignage(
            activityId,
            signage,
          );

          const expectedSignage = {
            ...signage,
            comment: comment ?? null,
            id: expectedId,
          };
          expect(signa.signages).toContainEqual(expectedSignage);
        });
      },
    );

    describe("when adherent want to add a signage that already exists", () => {
      describe.each`
        activityName               | activityId       | text                                 | size                                 | type
        ${escapeGame.general.name} | ${escapeGame.id} | ${escapeGame.signa.signages[0].text} | ${escapeGame.signa.signages[0].size} | ${escapeGame.signa.signages[0].type}
        ${justDance.general.name}  | ${justDance.id}  | ${justDance.signa.signages[0].text}  | ${justDance.signa.signages[0].size}  | ${justDance.signa.signages[0].type}
      `(
        "when tying to add again $type $size $text on $activityName",
        ({ activityId, text, size, type }) => {
          it("should indicate that signage already exists", async () => {
            const signage = { text, size, type, quantity: 5 };

            expect(
              async () =>
                await prepareFestivalActivity.addSignage(activityId, signage),
            ).rejects.toThrow(SignageAlreadyExists);
          });
        },
      );
    });
  });

  const panneauEscapeGame = escapeGame.signa.signages[0];
  const bacheEscapeGame = escapeGame.signa.signages[1];
  const afficheJustDance = justDance.signa.signages[0];

  describe.each`
    fields                                | activityName               | activityId       | signage              | signageId               | update                                                                                                         | expectedId
    ${"comment"}                          | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ comment: "Ecris blanc sur noir" }}                                                                         | ${undefined}
    ${"quantity"}                         | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ quantity: 7 }}                                                                                             | ${undefined}
    ${"quantity"}                         | ${justDance.general.name}  | ${justDance.id}  | ${afficheJustDance}  | ${afficheJustDance.id}  | ${{ quantity: 7 }}                                                                                             | ${undefined}
    ${"text"}                             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ text: "Bienvenue à l'escape game" }}                                                                       | ${"panneau-bienvenue-a-l-escape-game-4x3"}
    ${"size"}                             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ size: "A0" }}                                                                                              | ${"panneau-escape-game-a0"}
    ${"type"}                             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ type: BACHE }}                                                                                             | ${"bache-escape-game-4x3"}
    ${"quantity and comment"}             | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ quantity: 1000, comment: "Je ne sais pas combien il m'en faut" }}                                          | ${undefined}
    ${"text and comment"}                 | ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame} | ${panneauEscapeGame.id} | ${{ text: "L'Xscape Game", comment: "C'est pas une faute, c'est sur le theme Elon Musk" }}                     | ${"panneau-l-xscape-game-4x3"}
    ${"text and comment"}                 | ${justDance.general.name}  | ${justDance.id}  | ${afficheJustDance}  | ${afficheJustDance.id}  | ${{ text: "Juste une dance", comment: "En police un peu ancienne" }}                                           | ${"affiche-juste-une-dance-a2"}
    ${"text, size and comment"}           | ${escapeGame.general.name} | ${escapeGame.id} | ${bacheEscapeGame}   | ${bacheEscapeGame.id}   | ${{ text: "L'Xscape Game =>", size: "3 héras", comment: "C'est pas une faute, c'est sur le theme Elon Musk" }} | ${"bache-l-xscape-game-=>-3-heras"}
    ${"quantity, type, size and comment"} | ${escapeGame.general.name} | ${escapeGame.id} | ${bacheEscapeGame}   | ${bacheEscapeGame.id}   | ${{ quantity: 2, type: PANNEAU, size: "2x1 metres", comment: null }}                                           | ${"panneau-bienvenue-2x1-metres"}
  `(
    "when updating $fields from $signageId in $activityName",
    ({ fields, activityId, signage, update, expectedId }) => {
      const shouldAlsoUpdatId = expectedId ? " and signage id" : "";

      it(`should only update ${fields}${shouldAlsoUpdatId}`, async () => {
        const { signa } = await prepareFestivalActivity.updateSignage(
          activityId,
          { id: signage.id, ...update },
        );
        expect(signa.signages).toContainEqual({
          ...signage,
          ...update,
          id: expectedId ?? signage.id,
        });
      });
    },
  );

  describe.each`
    activityName               | activityId       | id
    ${escapeGame.general.name} | ${escapeGame.id} | ${"bache-le-panneau-qui-n-existe-pas-a4"}
    ${justDance.general.name}  | ${justDance.id}  | ${"bache-le-panneau-qui-n-existe-pas-a4"}
  `(
    "when trying to update $id signage on $activityName even if it does not exist",
    ({ activityId, id }) => {
      it("should indicate that signage does not exist", async () => {
        const signage = {
          id,
          comment: "Oui",
        };

        expect(
          async () =>
            await prepareFestivalActivity.updateSignage(activityId, signage),
        ).rejects.toThrow(SignageNotFound);
      });
    },
  );

  describe.each`
    activityName               | activityId       | currentId               | update
    ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame.id} | ${{ text: "Bienvenue", size: "10m par 2m", type: BACHE }}
    ${justDance.general.name}  | ${justDance.id}  | ${afficheJustDance.id}  | ${{ size: "10x3" }}
  `(
    "when updating a signage with data that generate existing id",
    ({ activityId, currentId, update }) => {
      it("should indicate that signage already exists", async () => {
        const signage: PrepareSignageUpdate = {
          id: currentId,
          ...update,
        };

        expect(
          async () =>
            await prepareFestivalActivity.updateSignage(activityId, signage),
        ).rejects.toThrow(SignageAlreadyExists);
      });
    },
  );

  describe.each`
    activityName               | activityId       | signage
    ${escapeGame.general.name} | ${escapeGame.id} | ${bacheEscapeGame}
    ${escapeGame.general.name} | ${escapeGame.id} | ${panneauEscapeGame}
    ${justDance.general.name}  | ${justDance.id}  | ${afficheJustDance}
    ${pcSecurite.general.name} | ${pcSecurite.id} | ${afficheJustDance}
  `(
    "when trying to remove a signage from $activityName",
    ({ activityId, signage }) => {
      it("should remove the signage", async () => {
        const { signa } = await prepareFestivalActivity.removeSignage(
          activityId,
          signage.id,
        );

        expect(signa.signages).not.toContainEqual(signage);
      });
    },
  );

  describe(`when ${approvedBySigna.general.name} is already validated by ${signa}`, () => {
    describe("when trying to update location", () => {
      it("should indicate that signa section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateSignaSection(
              approvedBySigna.id,
              { location: agora },
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to add a signage", () => {
      it("should indicate that signa section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.addSignage(approvedBySigna.id, {
              quantity: 10,
              type: PANNEAU,
              text: "Ici",
              size: "A4",
            }),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to update a signage", () => {
      it("should indicate that signa section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.updateSignage(approvedBySigna.id, {
              id: afficheJustDanceA2.id,
              quantity: 10,
              type: PANNEAU,
              text: "Ici",
              size: "A4",
            }),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
    describe("when trying to remove a signage", () => {
      it("should indicate that signa section is locked", async () => {
        expect(
          async () =>
            await prepareFestivalActivity.removeSignage(
              approvedBySigna.id,
              afficheJustDanceA2.id,
            ),
        ).rejects.toThrow(PrepareError.AlreadyApprovedBy);
      });
    });
  });

  describe.each`
    activityName                  | activityId          | signageId                             | signage                            | catalogItemName                   | catalogItem
    ${baladeEnPoney.general.name} | ${baladeEnPoney.id} | ${baladeEnPoney.signa.signages[0].id} | ${baladeEnPoney.signa.signages[0]} | ${bacheBienvenueInCatalog.name}   | ${bacheBienvenueInCatalog}
    ${justDance.general.name}     | ${justDance.id}     | ${justDance.signa.signages[0].id}     | ${justDance.signa.signages[0]}     | ${afficheJustDanceInCatalog.name} | ${afficheJustDanceInCatalog}
  `(
    "when signa member want to link $catalogItemName as catalog item for $signageId signage in $activityName",
    ({ activityId, signageId, signage, catalogItem }) => {
      it("should link the signage to the catalog item", async () => {
        const { signa } =
          await prepareFestivalActivity.linkSignageToCatalogItem(activityId, {
            signageId,
            catalogItem,
          });
        expect(signa.signages).toContainEqual({
          id: signageId,
          quantity: signage.quantity,
          text: signage.text,
          size: signage.size,
          type: signage.type,
          comment: signage.comment,
          catalogItem,
        });
      });
    },
  );

  describe("when trying to link a catalog item to a signage request from a draft festival activity", () => {
    it("should indicate that we can't link catalog item to signage request from draft festival activity", async () => {
      expect(
        async () =>
          await prepareFestivalActivity.linkSignageToCatalogItem(
            escapeGame.id,
            {
              signageId: escapeGame.signa.signages[0].id,
              catalogItem: panneauEscapeGameInCatalog,
            },
          ),
      ).rejects.toThrow(AssignCatalogItemInDraftActivity);
    });
  });
});
