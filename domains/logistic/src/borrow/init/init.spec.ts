import { describe, it, expect } from "vitest";
import { InitBorrow } from "./init";
import { InMemoryBorrows } from "./borrow.inmemory";
import { AvailableDateAfterUnavailableDate } from "../borrow.error";
import { friday17At12, sunday19At10 } from "../borrow.test-utils";

describe("Init borrow", () => {
  const borrows = new InMemoryBorrows();
  const init = new InitBorrow(borrows);
  describe("when initializing a valid borrow from KARNA", async () => {
    const form = {
      lender: "KARNA",
      availableOn: friday17At12,
      unavailableOn: sunday19At10,
    };
    const initializedBorrow = await init.apply(form);

    it("should initialize a borrow from KARNA", () => {
      expect(initializedBorrow.lender).toBe("KARNA");
    });
    it("should initialize the available date", () => {
      expect(initializedBorrow.availableOn).toEqual(friday17At12);
    });
    it("should initialize the unavailable date", () => {
      expect(initializedBorrow.unavailableOn).toEqual(sunday19At10);
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
  describe("when initializing a borrow with available date after unavailable date", async () => {
    const form = {
      lender: "KARNA",
      availableOn: sunday19At10,
      unavailableOn: friday17At12,
    };
    it("should indicate that available date is after unavailable date", async () => {
      await expect(init.apply(form)).rejects.toThrow(
        AvailableDateAfterUnavailableDate,
      );
    });
  });
});
