import { describe, it, expect } from "vitest";
import { EndSharedMeal } from "../../meal-sharing/meals.model";
import { SHARED_MEAL } from "../transaction.model";
import { SharedMeal } from "./shared-meal";

describe("Generate all transactions to refound shared meal chef", () => {
  const sharedMeal: EndSharedMeal = {
    chef: { id: 1, name: "Julie" },
    date: "vendredi 13 octobre midi",
    amount: 2000,
    guests: [1, 2, 3, 4],
  };
  it("should generate transactions with individual amount set to 5€", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(transactions.every(({ amount }) => amount === 500)).toBe(true);
  });
  it("should generate transactions only for guests that aren't chef", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(transactions).toHaveLength(3);
    expect(transactions.every(({ from }) => [2, 3, 4].includes(from)));
  });
  it("should generate transactions with 'Repas partage du vendredi 13 octobre midi' as context", () => {
    const transactions = SharedMeal.refound(sharedMeal);
    expect(
      transactions.every(
        ({ context }) =>
          context === "Repas partage du vendredi 13 octobre midi",
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
    const undividibleMeal: EndSharedMeal = {
      chef: { id: 1, name: "Julie" },
      date: "vendredi 13 octobre soir",
      amount: 2000,
      guests: [1, 2, 3],
    };
    it("should round up to next 5cents", () => {
      const transactions = SharedMeal.refound(undividibleMeal);
      expect(transactions.every(({ amount }) => amount === 670)).toBe(true);
    });
  });
});
