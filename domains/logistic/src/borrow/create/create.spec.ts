import { describe, it, expect } from "vitest";
import { CreateBorrow } from "./create";
import { InMemoryBorrows } from "./borrow.inmemory";

describe("Create borrow", () => {
  describe("when a user create a borrow from KARNA", async () => {
    const borrows = new InMemoryBorrows();
    const create = new CreateBorrow(borrows);
    const createdBorrow = await create.for("KARNA");

    it("should create a borrow from KARNA", () => {
      expect(createdBorrow.lender).toBe("KARNA");
    });
    it("should generate an id", () => {
      expect(createdBorrow.id).toEqual(expect.any(Number));
    });
    it("should save it to the repository", () => {
      expect(borrows.all).toContainEqual(createdBorrow);
    });
  });
});
