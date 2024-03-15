import { describe, it, expect } from "vitest";
import { InitBorrow } from "./init";
import { InMemoryBorrows } from "./borrow.inmemory";

describe("Init borrow", () => {
  describe("when a user initialize a borrow from KARNA", async () => {
    const borrows = new InMemoryBorrows();
    const init = new InitBorrow(borrows);
    const initializedBorrow = await init.for("KARNA");

    it("should initialize a borrow from KARNA", () => {
      expect(initializedBorrow.lender).toBe("KARNA");
    });
    it("should generate an id", () => {
      expect(initializedBorrow.id).toEqual(expect.any(Number));
    });
    it("should save it to the repository", () => {
      expect(borrows.all).toContainEqual(initializedBorrow);
    });
  });
});
