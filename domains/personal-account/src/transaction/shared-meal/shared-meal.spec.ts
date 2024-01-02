import { describe, it, expect } from "vitest";
import { SHARED_MEAL } from "../transaction.model";
import { SharedMeal } from "./shared-meal";
import { PastSharedMealBuilder } from "../../meal-sharing/past-shared-meal.builder";

const julie = { id: 1, name: "Julie" };
const lea = { id: 2, name: "Lea" };
const noel = { id: 3, name: "Noel" };
const georges = { id: 4, name: "Georges" };

describe("Generate all transactions to refound shared meal chef", () => {
  const sharedMeal = PastSharedMealBuilder.build({
    id: 1,
    expense: { amount: 2000, date: new Date("2023-12-31T10:30+02:00") },
    chef: julie,
    meal: { menu: "Something", date: "dimanche 31 decembre soir" },
    shotguns: [
      { ...julie, date: new Date("2023-12-29T21:00+02:00") },
      { ...lea, date: new Date("2023-12-30T10:00+02:00") },
      { ...noel, date: new Date("2023-12-31T09:00+02:00") },
      { ...georges, date: new Date("2023-12-31T21:00+02:00") },
    ],
  });

  it("should generate transactions with individual amount set to 5€", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(transactions.every(({ amount }) => amount === 500)).toBe(true);
  });
  it("should generate transactions only for guests that aren't chef", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(transactions).toHaveLength(3);
    expect(transactions.every(({ from }) => [2, 3, 4].includes(from)));
  });
  it("should generate transactions with 'Repas partage du dimanche 31 decembre soir' as context", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(
      transactions.every(
        ({ context }) =>
          context === "Repas partage du dimanche 31 decembre soir",
      ),
    ).toBe(true);
  });
  it("should generate transactions with chef as receiver", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(transactions.every(({ to }) => to === 1)).toBe(true);
  });
  it("should generate transactions with 'SHARED_MEAL' as type", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(transactions.every(({ type }) => type === SHARED_MEAL)).toBe(true);
  });

  describe("when meal amount can't be divided properly", () => {
    const undividibleMeal = PastSharedMealBuilder.build({
      id: 1,
      expense: { amount: 2000, date: new Date("2023-12-31T10:30+02:00") },
      chef: julie,
      meal: { menu: "Something", date: "dimanche 31 decembre soir" },
      shotguns: [
        { ...julie, date: new Date("2023-12-29T21:00+02:00") },
        { ...lea, date: new Date("2023-12-30T10:00+02:00") },
        { ...noel, date: new Date("2023-12-31T09:00+02:00") },
      ],
    });

    it("should round up to next 5cents", () => {
      const transactions = SharedMeal.refound(undividibleMeal);
      expect(transactions.every(({ amount }) => amount === 670)).toBe(true);
    });
  });
});
