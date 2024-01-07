import { describe, it, expect, beforeEach } from "vitest";
import { MealSharing } from "./meal-sharing";
import { Adherents } from "./meal-sharing";
import { SharedMeals } from "./meal-sharing";
import { OnGoingSharedMealBuilder } from "./on-going-shared-meal.builder";
import {
  AlreadyShotguned,
  RecordExpenseByChiefOnly,
} from "./meal-sharing.error";
import { PastSharedMeal } from "./meals.model";
import { SOIR, MIDI } from "./meal-sharing";
import { Meal } from "./meal";
import { InMemorySharedMeals } from "./shared-meals.inmemory";
import { InMemoryAdherents } from "./adherents.inmemory";
import { PAST_MEAL_ERROR } from "./past-shared-meal.builder";

const julie = { id: 1, name: "Julie Reiffocex" };
const lea = { id: 2, name: "Lea Mauyno" };
const noel = { id: 3, name: "Noel Ertsemud" };
const shogosse = { id: 4, name: "Shogosse" };
const tatouin = { id: 5, name: "Tatouin Phejo" };
const adherentListing = [julie, lea, noel, shogosse, tatouin];

const meal = Meal.init("Riz cantonnais", {
  day: new Date("2023-10-12"),
  moment: "MIDI",
});
const shotguns = [
  { ...julie, date: new Date("2023-10-12 08:00") },
  { ...noel, date: new Date("2023-10-12 08:51") },
  { ...shogosse, date: new Date("2023-10-12 13:00") },
];

const rizCantonnais = OnGoingSharedMealBuilder.build({
  id: 1,
  meal,
  chef: julie,
  shotguns,
});

describe("Meal Sharing", () => {
  let sharedMeals: SharedMeals;
  let adherents: Adherents;
  let mealSharing: MealSharing;
  describe("Offer a meal", () => {
    beforeEach(() => {
      sharedMeals = new InMemorySharedMeals();
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe.each`
      menu                   | expectedChef | day                       | moment  | expectedDate
      ${"Pates pesto"}       | ${julie}     | ${new Date("2023-10-13")} | ${SOIR} | ${"vendredi 13 octobre soir"}
      ${"Dahl de lentilles"} | ${lea}       | ${new Date("2023-10-14")} | ${MIDI} | ${"samedi 14 octobre midi"}
      ${"Curry de legumes"}  | ${lea}       | ${new Date("2023-10-15")} | ${SOIR} | ${"dimanche 15 octobre soir"}
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
          expect(meal.shotgunCount).toBe(1);
          expect(meal.shotguns.at(0)).toEqual({
            ...expectedChef,
            date: expect.any(Date),
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
        expect(meal.shotgunCount).toBe(4);
        expect(meal.shotguns).toContainEqual({
          ...lea,
          date: expect.any(Date),
        });
      });
      describe("when lea does it twice", () => {
        it("should indicate that lea is already a guest", async () => {
          await mealSharing.shotgun(rizCantonnais.id, lea.id);
          expect(
            async () => await mealSharing.shotgun(rizCantonnais.id, lea.id),
          ).rejects.toThrow(AlreadyShotguned);
        });
      });
    });
    describe("when noel shotgun again for riz cantonnais", () => {
      it("should indicate that noel is already a guest", async () => {
        expect(
          async () => await mealSharing.shotgun(rizCantonnais.id, noel.id),
        ).rejects.toThrow(AlreadyShotguned);
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
      const { shotgunCount: shotguns } = await mealSharing.findById(
        rizCantonnais.id,
      );
      expect(shotguns).toBe(3);
    });
  });
  describe("Record exoense", () => {
    const expense = { amount: 1000, date: new Date("2023-10-12 12:00") };
    let pastSharedMeal: PastSharedMeal;
    beforeEach(async () => {
      sharedMeals = new InMemorySharedMeals([rizCantonnais]);
      adherents = new InMemoryAdherents([...adherentListing]);
      mealSharing = new MealSharing(sharedMeals, adherents);
    });
    describe("when adherent other than chief try to record expense", () => {
      it("should indicate that only chief can record expense", () => {
        expect(
          async () =>
            await mealSharing.recordExpense(rizCantonnais.id, lea.id, expense),
        ).rejects.toThrow(RecordExpenseByChiefOnly);
      });
    });
    describe("when chief record expense", () => {
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
        }).rejects.toThrow(PAST_MEAL_ERROR);
      });
      it("should count how many shotguns were before the expense", () => {
        expect(pastSharedMeal.inTimeShotguns).toBe(2);
      });
      it("should count how many shotguns were done", () => {
        expect(pastSharedMeal.shotgunCount).toBe(3);
      });
    });
  });
});
