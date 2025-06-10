import { describe, it, expect } from "vitest";
import { InitBorrow } from "./init.js";
import { InMemoryBorrows } from "./borrow.inmemory.js";
import { friday17At12, sunday20At10 } from "../../logistic.test-utils.js";
import { NoDuration } from "../borrow.error.js";

describe("Init borrow", () => {
  const borrows = new InMemoryBorrows();
  const init = new InitBorrow(borrows);
  describe("when initializing a valid borrow for KARNA", async () => {
    const form = {
      lender: "KARNA",
      availableOn: friday17At12,
      unavailableOn: sunday20At10,
    };
    const initializedBorrow = await init.apply(form);

    it("should initialize a borrow for KARNA", () => {
      expect(initializedBorrow.lender).toBe("KARNA");
    });
    it("should initialize the available date", () => {
      expect(initializedBorrow.availableOn).toEqual(friday17At12);
    });
    it("should initialize the unavailable date", () => {
      expect(initializedBorrow.unavailableOn).toEqual(sunday20At10);
    });
    it("should generate an id", () => {
      expect(initializedBorrow.id).toEqual(expect.any(Number));
    });
    it("should save it to the repository", () => {
      expect(borrows.all).toContainEqual(initializedBorrow);
    });
    it("should generate empty gears", () => {
      expect(initializedBorrow.gears).toEqual([]);
    });
  });

  describe("when initializing a borrow with no duration", () => {
    const form = {
      lender: "KARNA",
      availableOn: friday17At12,
      unavailableOn: friday17At12,
    };

    it("should throw an error", async () => {
      await expect(init.apply(form)).rejects.toThrow(NoDuration);
    });
  });
});
