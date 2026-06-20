import { describe, it, expect, beforeEach } from "vitest";
import { Adherents, MealSharing, SOIR, MIDI } from "./meal-sharing.js";
import { OnGoingSharedMealBuilder } from "./on-going-shared-meal.builder";
import {
  MealNotFound,
  MultipleShotgunsAlreadyAllowed,
  MultipleShotgunsAlreadyDisallowed,
  MultipleShotgunsDisallowed,
  OnlyChefCan,
  RecordExpenseOnNoShotgunedMeal,
  RecordExpenseOnPastMeal,
  ShotgunsAlreadyClosed,
  ShotgunsAlreadyOpened,
  ShotgunsClosed,
  TooManyPortions,
} from "./meal-sharing.error.js";
import { OnGoingSharedMeal, PastSharedMeal } from "./meals.model.js";
import { Meal } from "./meal.js";
import { InMemorySharedMeals } from "./shared-meals.inmemory.js";
import { InMemoryAdherents } from "./adherents.inmemory.js";
import {
  CANCEL_SHOTGUN_PAST_MEAL_ERROR,
  CLOSE_SHOTGUNS_PAST_MEAL_ERROR,
  OPEN_SHOTGUNS_PAST_MEAL_ERROR,
  PastSharedMealBuilder,
  ADD_PORTION_PAST_MEAL_ERROR,
  REMOVE_PORTION_PAST_MEAL_ERROR,
  ALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR,
  DISALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR,
} from "./past-shared-meal.builder.js";

const julie = { id: 1, name: "Julie Reiffocex" };
const lea = { id: 2, name: "Lea Mauyno" };
const noel = { id: 3, name: "Noel Ertsemud" };
const shogosse = { id: 4, name: "Shogosse" };
const tatouin = { id: 5, name: "Tatouin Phejo" };
const adherentListing = [julie, lea, noel, shogosse, tatouin];

const meal = Meal.init("Riz cantonnais", {
  day: "2023-10-12",
  moment: "MIDI",
});
const shotguns = [
  { ...julie, date: new Date("2023-10-12 08:00"), portions: 1 },
  { ...noel, date: new Date("2023-10-12 08:51"), portions: 1 },
  { ...shogosse, date: new Date("2023-10-12 13:00"), portions: 1 },
];
const multipleShotguns = [
  { ...julie, date: new Date("2023-10-12 08:00"), portions: 3 },
  { ...noel, date: new Date("2023-10-12 08:51"), portions: 1 },
  { ...shogosse, date: new Date("2023-10-12 13:00"), portions: 5 },
];

const rizCantonnais = OnGoingSharedMealBuilder.build({
  id: 1,
  meal,
  chef: julie,
  areShotgunsOpen: true,
  areMultipleShotgunsAllowed: false,
  shotguns,
});

const saladeDeFruits = OnGoingSharedMealBuilder.build({
  id: 2,
  meal,
  chef: julie,
  areShotgunsOpen: true,
  areMultipleShotgunsAllowed: true,
  shotguns: multipleShotguns,
});

const lonelyMeal = OnGoingSharedMealBuilder.build({
  id: 3,
  meal,
  chef: julie,
  areShotgunsOpen: true,
  areMultipleShotgunsAllowed: false,
  shotguns: [],
});

const closedMeal = PastSharedMealBuilder.build({
  id: 4,
  meal,
  chef: julie,
  areShotgunsOpen: true,
  areMultipleShotgunsAllowed: false,
  shotguns,
  expense: { amount: 1000, date: new Date() },
});

describe("Meal Sharing", () => {
  let sharedMeals: InMemorySharedMeals;
  let adherents: Adherents;
  let mealSharing: MealSharing;
  describe("Offer a meal", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals();
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe.each`
      menu                   | expectedChef | day             | moment  | multipleShotgunsAllowed | expectedDate
      ${"Pates pesto"}       | ${julie}     | ${"2023-10-13"} | ${SOIR} | ${false}                | ${"vendredi 13 octobre soir"}
      ${"Dahl de lentilles"} | ${lea}       | ${"2023-10-14"} | ${MIDI} | ${false}                | ${"samedi 14 octobre midi"}
      ${"Curry de legumes"}  | ${lea}       | ${"2023-10-15"} | ${SOIR} | ${false}                | ${"dimanche 15 octobre soir"}
      ${"Gnocchis"}          | ${lea}       | ${"2023-10-14"} | ${SOIR} | ${true}                 | ${"samedi 14 octobre soir"}
    `(
      "when offering a meal for $menu, on $expectedDate",
      async ({
        menu,
        day,
        moment,
        multipleShotgunsAllowed,
        expectedDate,
        expectedChef,
      }) => {
        let sharedMeal: OnGoingSharedMeal;
        beforeEach(async () => {
          sharedMeal = await mealSharing.offer(
            menu,
            { day, moment },
            expectedChef.id,
            multipleShotgunsAllowed,
          );
        });
        it(`should generate a "${menu}" meal`, async () => {
          expect(sharedMeal.meal.menu).toBe(menu);
        });
        it(`should generate a meal for "${expectedDate}"`, async () => {
          expect(sharedMeal.meal.date).toBe(expectedDate);
        });
        it("should identify meal sharing with an id", async () => {
          expect(sharedMeal.id).toBeGreaterThan(0);
        });
        it("should link meal with volunteer offering it", async () => {
          expect(sharedMeal.chef).toStrictEqual(expectedChef);
        });
        it("should open the shotgun and allow multiple shotguns accordingly", async () => {
          expect(sharedMeal.areShotgunsOpen).toBe(true);
          expect(sharedMeal.areMultipleShotgunsAllowed).toBe(
            multipleShotgunsAllowed,
          );
        });
        it("should add chef as a guest", async () => {
          expect(sharedMeal.portionCount).toBe(1);
          expect(sharedMeal.shotguns.at(0)).toEqual({
            ...expectedChef,
            date: expect.any(Date),
            portions: 1,
          });
        });
      },
    );
  });

  describe("Shotgun a meal", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais, saladeDeFruits]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when lea shotgun for riz cantonnais", () => {
      it("should add lea as a guest", async () => {
        const meal = await mealSharing.addPortion(rizCantonnais.id, lea.id);
        expect(meal.portionCount).toBe(4);
        expect(meal.shotguns.length).toBe(4);
        expect(meal.shotguns).toContainEqual({
          ...lea,
          date: expect.any(Date),
          portions: 1,
        });
      });
      describe("when lea shotguns again", () => {
        it("should indicate that lea can't shotgun again for this meal", async () => {
          await mealSharing.addPortion(rizCantonnais.id, lea.id);
          expect(
            async () => await mealSharing.addPortion(rizCantonnais.id, lea.id),
          ).rejects.toThrow(MultipleShotgunsDisallowed);
        });
      });
    });
    describe("when lea shotgun for salade de fruits", () => {
      it("should add lea as a guest", async () => {
        const meal = await mealSharing.addPortion(saladeDeFruits.id, lea.id);
        expect(meal.portionCount).toBe(10);
        expect(meal.shotguns.length).toBe(4);
        expect(meal.shotguns).toContainEqual({
          ...lea,
          date: expect.any(Date),
          portions: 1,
        });
      });
      describe("when lea shotguns again", () => {
        it("should add a portion for lea", async () => {
          await mealSharing.addPortion(saladeDeFruits.id, lea.id);
          const meal = await mealSharing.addPortion(saladeDeFruits.id, lea.id);
          expect(meal.portionCount).toBe(11);
          expect(meal.shotguns.length).toBe(4);
          expect(meal.shotguns).toContainEqual({
            ...lea,
            date: expect.any(Date),
            portions: 2,
          });
        });
      });
    });
    describe("when shogosse shotgun for salade de fruits", () => {
      it("should indicate that shogosse can't shotgun more portions for this meal", async () => {
        expect(
          async () =>
            await mealSharing.addPortion(saladeDeFruits.id, shogosse.id),
        ).rejects.toThrow(TooManyPortions);
      });
    });
  });

  describe("Unshotgun a meal", () => {
    const removeShotgun = { mealId: saladeDeFruits.id, guestId: shogosse.id };
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([saladeDeFruits]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when one of the guests tries to remove a portion", () => {
      it("should indicate only chef can remove a portion", async () => {
        const instigator = shogosse.id;
        expect(
          async () =>
            await mealSharing.removePortion(removeShotgun, instigator),
        ).rejects.toThrow(OnlyChefCan.removeShotgunFor(rizCantonnais));
      });
    });
    describe("when one of the guests tries to cancel their shotgun", () => {
      it("should indicate only chef can unshotgun", async () => {
        const instigator = shogosse.id;
        expect(
          async () =>
            await mealSharing.cancelShotgun(removeShotgun, instigator),
        ).rejects.toThrow(OnlyChefCan.cancelShotgunFor(rizCantonnais));
      });
    });
    describe("when the chef tries to remove a portion for a guest with more than one portion", () => {
      it("should remove a portion from the guests shotgun", async () => {
        const meal = await mealSharing.removePortion(
          removeShotgun,
          saladeDeFruits.chef.id,
        );
        expect(meal.portionCount).toBe(8);
        expect(meal.shotguns).toContainEqual({
          ...shogosse,
          date: expect.any(Date),
          portions: 4,
        });
      });
    });
    describe("when the chef tries to remove a portion for a guest with only one portion", () => {
      const removeShotgunForNoel = {
        mealId: saladeDeFruits.id,
        guestId: noel.id,
      };
      it("should remove the shotgun from the meal", async () => {
        const meal = await mealSharing.cancelShotgun(
          removeShotgunForNoel,
          saladeDeFruits.chef.id,
        );
        expect(meal.portionCount).toBe(8);
        expect(meal.shotguns.length).toBe(2);
        expect(meal.shotguns.find((s) => s.id === noel.id)).toBeUndefined();
      });
    });
    describe("when the chef tries to cancel a shotgun for a guest", () => {
      it("should remove the shotgun from the meal", async () => {
        const meal = await mealSharing.cancelShotgun(
          removeShotgun,
          saladeDeFruits.chef.id,
        );
        expect(meal.portionCount).toBe(4);
        expect(meal.shotguns.length).toBe(2);
        expect(meal.shotguns.find((s) => s.id === shogosse.id)).toBeUndefined();
      });
    });
  });
  describe("when chef didn't go grocery shopping yet", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([saladeDeFruits]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    it("should be able to know how many portions are shotguned", async () => {
      const { portionCount } = await mealSharing.findById(saladeDeFruits.id);
      expect(portionCount).toBe(9);
    });
  });

  describe("Record expense", () => {
    const expense = { amount: 1000, date: new Date("2023-10-12 12:00") };
    let pastSharedMeal: PastSharedMeal;
    beforeEach(async () => {
      sharedMeals = new InMemorySharedMeals([
        rizCantonnais,
        lonelyMeal,
        closedMeal,
      ]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when adherent other than chef tries to record expense", () => {
      it("should indicate that only chef can record expense", () => {
        expect(
          async () =>
            await mealSharing.recordExpense(rizCantonnais.id, lea.id, expense),
        ).rejects.toThrow(OnlyChefCan.recordExpenseFor(rizCantonnais));
      });
    });
    describe("when chef record expense", () => {
      describe("on an ongoing meal", () => {
        beforeEach(async () => {
          pastSharedMeal = await mealSharing.recordExpense(
            rizCantonnais.id,
            julie.id,
            expense,
          );
        });
        it("should record amount and date of the expense", async () => {
          expect(pastSharedMeal.expense.amount).toBe(1000);
        });
        it("should indicate shared meal is past for new adherent trying to shotgun", async () => {
          expect(async () => {
            await mealSharing.addPortion(rizCantonnais.id, tatouin.id);
          }).rejects.toThrow(ADD_PORTION_PAST_MEAL_ERROR);
        });
        it("should indicate shared meal is past for chef trying to remove a portion", async () => {
          expect(async () => {
            const cancel = { mealId: rizCantonnais.id, guestId: julie.id };
            await mealSharing.removePortion(cancel, rizCantonnais.chef.id);
          }).rejects.toThrow(REMOVE_PORTION_PAST_MEAL_ERROR);
        });
        it("should indicate shared meal is past for chef trying to cancel a shotgun", async () => {
          expect(async () => {
            const cancel = { mealId: rizCantonnais.id, guestId: julie.id };
            await mealSharing.cancelShotgun(cancel, rizCantonnais.chef.id);
          }).rejects.toThrow(CANCEL_SHOTGUN_PAST_MEAL_ERROR);
        });
        it("should indicate shared meal is past for chef trying to close the shotguns", async () => {
          expect(async () => {
            await mealSharing.closeShotguns(
              rizCantonnais.id,
              rizCantonnais.chef.id,
            );
          }).rejects.toThrow(CLOSE_SHOTGUNS_PAST_MEAL_ERROR);
        });
        it("should indicate shared meal is past for chef trying to open the shotguns", async () => {
          expect(async () => {
            await mealSharing.openShotguns(
              rizCantonnais.id,
              rizCantonnais.chef.id,
            );
          }).rejects.toThrow(OPEN_SHOTGUNS_PAST_MEAL_ERROR);
        });
        it("should indicate shared meal is past for chef trying to allow multiple shotguns", async () => {
          expect(async () => {
            await mealSharing.allowMultipleShotguns(
              rizCantonnais.id,
              rizCantonnais.chef.id,
            );
          }).rejects.toThrow(ALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR);
        });
        it("should indicate shared meal is past for chef trying to disallow multiple shotguns", async () => {
          expect(async () => {
            await mealSharing.disallowMultipleShotguns(
              rizCantonnais.id,
              rizCantonnais.chef.id,
            );
          }).rejects.toThrow(DISALLOW_MULTIPLE_SHOTGUNS_PAST_MEAL_ERROR);
        });
        it("should count how many portions were done", () => {
          expect(pastSharedMeal.portionCount).toBe(3);
        });
      });
      describe("when no one shotguns for the meal", () => {
        it("should indicate we can not record expense", () => {
          expect(
            async () =>
              await mealSharing.recordExpense(
                lonelyMeal.id,
                lonelyMeal.chef.id,
                expense,
              ),
          ).rejects.toThrow(RecordExpenseOnNoShotgunedMeal);
        });
      });
      describe("when meal is already closed", () => {
        it("should indicate that meal is already closed", async () => {
          expect(
            async () =>
              await mealSharing.recordExpense(
                closedMeal.id,
                closedMeal.chef.id,
                expense,
              ),
          ).rejects.toThrow(RecordExpenseOnPastMeal);
        });
      });
    });
  });

  describe("Cancel a meal", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when a meal is canceled by its chef", () => {
      beforeEach(async () => {
        await mealSharing.cancelMeal(rizCantonnais.id, rizCantonnais.chef.id);
      });
      it("should remove meal from the available ones", () => {
        expect(sharedMeals.all).not.toContainEqual(rizCantonnais);
      });
      it("should not be possible to shotgun it afterwards", async () => {
        expect(
          async () =>
            await mealSharing.addPortion(rizCantonnais.id, shogosse.id),
        ).rejects.toThrow(MealNotFound);
      });
    });
    describe("when someone else is trying to cancel a meal", () => {
      it("should indicate that only chef can cancel a meal", async () => {
        expect(
          async () =>
            await mealSharing.cancelMeal(rizCantonnais.id, shogosse.id),
        ).rejects.toThrow(OnlyChefCan.cancel(rizCantonnais));
      });
    });
  });

  describe("Close the shotguns", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when adherent other than chef tries to close the shotguns", () => {
      it("should indicate that only chef can close the shotguns", () => {
        expect(
          async () => await mealSharing.closeShotguns(rizCantonnais.id, lea.id),
        ).rejects.toThrow(OnlyChefCan.closeShotguns(rizCantonnais));
      });
    });
    describe("when adherent other than chef tries to open the shotguns", () => {
      it("should indicate that only chef can open the shotguns", () => {
        expect(
          async () => await mealSharing.openShotguns(rizCantonnais.id, lea.id),
        ).rejects.toThrow(OnlyChefCan.openShotguns(rizCantonnais));
      });
    });
    describe("when chef closes the shotguns", () => {
      let sharedMeal: OnGoingSharedMeal;
      beforeEach(async () => {
        sharedMeal = await mealSharing.closeShotguns(
          rizCantonnais.id,
          rizCantonnais.chef.id,
        );
      });
      describe("on a meal with shotguns opened", () => {
        it("should close the shotguns", async () => {
          expect(sharedMeal.areShotgunsOpen).toBe(false);
        });
        it("should indicate shotguns are closed for new adherent trying to shotgun", async () => {
          expect(async () => {
            await mealSharing.addPortion(rizCantonnais.id, tatouin.id);
          }).rejects.toThrow(ShotgunsClosed);
        });
        describe("when chef opens the shotguns again", () => {
          beforeEach(async () => {
            sharedMeal = await mealSharing.openShotguns(
              rizCantonnais.id,
              rizCantonnais.chef.id,
            );
          });
          it("should open the shotguns", () => {
            expect(sharedMeal.areShotgunsOpen).toBe(true);
          });
          it("should be possible for lea to shotgun", async () => {
            const meal = await mealSharing.addPortion(rizCantonnais.id, lea.id);
            expect(meal.portionCount).toBe(4);
            expect(meal.shotguns).toContainEqual({
              ...lea,
              date: expect.any(Date),
              portions: 1,
            });
          });
        });
      });
      describe("on a meal with shotguns closed", () => {
        it("should indicate that the shotguns are already closed", () => {
          expect(
            async () =>
              await mealSharing.closeShotguns(
                rizCantonnais.id,
                rizCantonnais.chef.id,
              ),
          ).rejects.toThrow(ShotgunsAlreadyClosed);
        });
      });
    });
    describe("when chef opens the shotguns", () => {
      describe("on a meal with shotguns opened", () => {
        it("should indicate that the shotguns are already opened", () => {
          expect(
            async () =>
              await mealSharing.openShotguns(
                rizCantonnais.id,
                rizCantonnais.chef.id,
              ),
          ).rejects.toThrow(ShotgunsAlreadyOpened);
        });
      });
    });
  });

  describe("Allow multiple shotguns", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais, saladeDeFruits]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when adherent other than chef tries to allow multiple shotguns", () => {
      it("should indicate that only chef can allow multiple shotguns", () => {
        expect(
          async () =>
            await mealSharing.allowMultipleShotguns(rizCantonnais.id, lea.id),
        ).rejects.toThrow(OnlyChefCan.allowMultipleShotguns(rizCantonnais));
      });
    });
    describe("when adherent other than chef tries to disallow multiple shotguns", () => {
      it("should indicate that only chef can disallow multiple shotguns", () => {
        expect(
          async () =>
            await mealSharing.disallowMultipleShotguns(
              rizCantonnais.id,
              lea.id,
            ),
        ).rejects.toThrow(OnlyChefCan.disallowMultipleShotguns(rizCantonnais));
      });
    });
    describe("when chef allows multiple shotguns", () => {
      describe("on a meal with multiple shotguns disallowed", () => {
        let sharedMeal: OnGoingSharedMeal;
        beforeEach(async () => {
          sharedMeal = await mealSharing.allowMultipleShotguns(
            rizCantonnais.id,
            rizCantonnais.chef.id,
          );
        });
        it("should allow multiple shotguns", async () => {
          expect(sharedMeal.areMultipleShotgunsAllowed).toBe(true);
        });
        it("should be possible for noel to shotgun another portion", async () => {
          const meal = await mealSharing.addPortion(rizCantonnais.id, noel.id);
          expect(meal.portionCount).toBe(4);
          expect(meal.shotguns.length).toBe(3);
          expect(meal.shotguns).toContainEqual({
            ...noel,
            date: expect.any(Date),
            portions: 2,
          });
        });
      });
      describe("on a meal with multiple shotguns allowed", () => {
        it("should indicate that multiple shotguns are already allowed", () => {
          expect(
            async () =>
              await mealSharing.allowMultipleShotguns(
                saladeDeFruits.id,
                saladeDeFruits.chef.id,
              ),
          ).rejects.toThrow(MultipleShotgunsAlreadyAllowed);
        });
      });
    });
    describe("when chef disallows multiple shotguns", () => {
      describe("on a meal with multiple shotguns allowed", () => {
        let sharedMeal: OnGoingSharedMeal;
        beforeEach(async () => {
          sharedMeal = await mealSharing.disallowMultipleShotguns(
            saladeDeFruits.id,
            saladeDeFruits.chef.id,
          );
        });
        it("should disallow multiple shotguns", async () => {
          expect(sharedMeal.areMultipleShotgunsAllowed).toBe(false);
        });
        it("should set only one portion for each guest", async () => {
          expect(sharedMeal.portionCount).toBe(3);
          expect(sharedMeal.shotguns.length).toBe(3);
          expect(
            sharedMeal.shotguns.every(({ portions }) => portions === 1),
          ).toBe(true);
        });
        it("should be not be possible for noel to shotgun another portion", async () => {
          expect(
            async () =>
              await mealSharing.addPortion(saladeDeFruits.id, noel.id),
          ).rejects.toThrow(MultipleShotgunsDisallowed);
        });
      });
      describe("on a meal with multiple shotguns disallowed", () => {
        it("should indicate that multiple shotguns are already disallowed", () => {
          expect(
            async () =>
              await mealSharing.disallowMultipleShotguns(
                rizCantonnais.id,
                rizCantonnais.chef.id,
              ),
          ).rejects.toThrow(MultipleShotgunsAlreadyDisallowed);
        });
      });
    });
  });
});
