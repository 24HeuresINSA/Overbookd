import { describe, it, expect, beforeEach } from "vitest";
import { Adherents, MealSharing, SOIR, MIDI } from "./meal-sharing.js";
import { OnGoingSharedMealBuilder } from "./on-going-shared-meal.builder";
import {
  MealNotFound,
  OnlyChefCan,
  RecordExpenseOnNoShotgunedMeal,
  RecordExpenseOnPastMeal,
  ShotgunsAlreadyClosed,
  ShotgunsAlreadyOpened,
  ShotgunsClosed,
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
  SHOTGUN_PAST_MEAL_ERROR,
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
  { ...julie, date: new Date("2023-10-12 08:00"), portion: 1 },
  { ...noel, date: new Date("2023-10-12 08:51"), portion: 1 },
  { ...shogosse, date: new Date("2023-10-12 13:00"), portion: 2 },
];

const rizCantonnais = OnGoingSharedMealBuilder.build({
  id: 1,
  meal,
  chef: julie,
  areShotgunsOpen: true,
  shotguns,
});

const lonelyMeal = OnGoingSharedMealBuilder.build({
  id: 2,
  meal,
  chef: julie,
  areShotgunsOpen: true,
  shotguns: [],
});

const closedMeal = PastSharedMealBuilder.build({
  id: 3,
  meal,
  chef: julie,
  areShotgunsOpen: true,
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
      menu                   | expectedChef | day             | moment  | expectedDate
      ${"Pates pesto"}       | ${julie}     | ${"2023-10-13"} | ${SOIR} | ${"vendredi 13 octobre soir"}
      ${"Dahl de lentilles"} | ${lea}       | ${"2023-10-14"} | ${MIDI} | ${"samedi 14 octobre midi"}
      ${"Curry de legumes"}  | ${lea}       | ${"2023-10-15"} | ${SOIR} | ${"dimanche 15 octobre soir"}
    `(
      "when offering a meal for $menu, on $expectedDate",
      async ({ menu, day, moment, expectedDate, expectedChef }) => {
        it(`should generate a "${menu}" meal`, async () => {
          const { meal } = await mealSharing.offer(
            menu,
            { day, moment },
            expectedChef.id,
          );
          expect(meal.menu).toBe(menu);
        });
        it(`should generate a meal for "${expectedDate}"`, async () => {
          const { meal } = await mealSharing.offer(
            menu,
            { day, moment },
            expectedChef.id,
          );
          expect(meal.date).toBe(expectedDate);
        });
        it("should identify meal sharing with an id", async () => {
          const { id } = await mealSharing.offer(
            menu,
            { day, moment },
            expectedChef.id,
          );
          expect(id).toBeGreaterThan(0);
        });
        it("should link meal with volunteer offering it", async () => {
          const { chef } = await mealSharing.offer(
            menu,
            { day, moment },
            expectedChef.id,
          );
          expect(chef).toStrictEqual(expectedChef);
        });
        it("should add chef as a guest", async () => {
          const meal = await mealSharing.offer(
            menu,
            { day, moment },
            expectedChef.id,
          );
          expect(meal.portionCount).toBe(1);
          expect(meal.shotguns.at(0)).toEqual({
            ...expectedChef,
            date: expect.any(Date),
            portion: 1,
          });
        });
      },
    );
  });
  describe("Shotgun a meal", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when lea shotgun for riz cantonnais", () => {
      it("should add lea as a guest", async () => {
        const meal = await mealSharing.shotgun(rizCantonnais.id, lea.id);
        expect(meal.portionCount).toBe(5);
        expect(meal.shotguns).toContainEqual({
          ...lea,
          date: expect.any(Date),
          portion: 1,
        });
      });
      describe("when lea shotguns again", () => {
        it("should add a portion for lea", async () => {
          await mealSharing.shotgun(rizCantonnais.id, lea.id);
          const meal = await mealSharing.shotgun(rizCantonnais.id, lea.id);
          expect(meal.portionCount).toBe(6);

          expect(meal.shotguns).toContainEqual({
            ...lea,
            date: expect.any(Date),
            portion: 2,
          });
        });
      });
    });
  });
  describe("Unshotgun a meal", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    const cancelShotgun = { mealId: rizCantonnais.id, guestId: shogosse.id };
    describe("when one of the guests unshotguns a meal", () => {
      it("should remove a portion of his shotgun", async () => {
        const meal = await mealSharing.cancelShotgun(cancelShotgun);
        expect(meal.portionCount).toBe(3);
        expect(meal.shotguns).toContainEqual({
          ...shogosse,
          date: expect.any(Date),
          portion: 1,
        });
      });
    });
    describe("when the chef tries to cancel a shotgun with more than one portion", () => {
      it("should remove a portion from the guests shotgun", async () => {
        const meal = await mealSharing.cancelShotgun(cancelShotgun);
        expect(meal.portionCount).toBe(3);
        expect(meal.shotguns).toContainEqual({
          ...shogosse,
          date: expect.any(Date),
          portion: 1,
        });
      });
    });
    describe("when the chef tries to cancel a shotgun with only one portion", () => {
      const cancelShotgunForJulie = {
        mealId: rizCantonnais.id,
        guestId: julie.id,
      };
      it("should remove the shotgun from the meal", async () => {
        const meal = await mealSharing.cancelShotgun(cancelShotgunForJulie);
        expect(meal.portionCount).toBe(3);
        expect(meal.shotguns.find((s) => s.id === julie.id)).toBeUndefined();
      });
    });
  });
  describe("when chef didn't go grocery shopping yet", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    it("should be able to know how many guests shotguned", async () => {
      const { portionCount } = await mealSharing.findById(rizCantonnais.id);
      expect(portionCount).toBe(4);
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
            await mealSharing.shotgun(rizCantonnais.id, tatouin.id);
          }).rejects.toThrow(SHOTGUN_PAST_MEAL_ERROR);
        });
        it("should indicate shared meal is past for chef trying to cancel shotgun", async () => {
          expect(async () => {
            const cancel = { mealId: rizCantonnais.id, guestId: julie.id };
            await mealSharing.cancelShotgun(cancel);
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
        it("should count how many shotguns were done", () => {
          expect(pastSharedMeal.portionCount).toBe(4);
        });
      });
      describe("when no one shotgun for the meal", () => {
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
          async () => await mealSharing.shotgun(rizCantonnais.id, shogosse.id),
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
        it("should indicate shotguns are closed for new adherent trying to shotgun or cancel", async () => {
          expect(async () => {
            await mealSharing.shotgun(rizCantonnais.id, tatouin.id);
          }).rejects.toThrow(ShotgunsClosed);
          expect(async () => {
            await mealSharing.cancelShotgun({
              mealId: rizCantonnais.id,
              guestId: tatouin.id,
            });
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
            const meal = await mealSharing.shotgun(rizCantonnais.id, lea.id);
            expect(meal.portionCount).toBe(5);
            expect(meal.shotguns).toContainEqual({
              ...lea,
              date: expect.any(Date),
              portion: 1,
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
});
