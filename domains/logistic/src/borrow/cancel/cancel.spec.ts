import { describe, it, expect } from "vitest";
import { InMemoryBorrows } from "./borrow.inmemory";
import { CancelBorrow } from "./cancel";
import { karnaBorrow } from "../borrow.test-utils";

describe("Cancel borrow", () => {
  describe("when a user cancel borrow from KARNA", async () => {
    const borrows = new InMemoryBorrows([karnaBorrow]);
    const cancel = new CancelBorrow(borrows);
    await cancel.apply(karnaBorrow.id);

    it("should cancel it to the repository", () => {
      expect(borrows.all).not.toContainEqual(karnaBorrow);
    });
  });
});
