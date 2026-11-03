import { describe, expect, it } from "vitest";
import { moveAtFirstIndex, removeItemAtIndex, updateItemToList } from "./list";

describe("list operations", () => {
  it("should replace an item at a positive index", () => {
    expect(
      updateItemToList(["first", "second", "third"], 1, "updated"),
    ).toEqual(["first", "updated", "third"]);
  });

  it("should remove an item at a positive index", () => {
    expect(removeItemAtIndex(["first", "second", "third"], 1)).toEqual([
      "first",
      "third",
    ]);
  });

  it("should move an item at a positive index to the first position", () => {
    expect(moveAtFirstIndex(["first", "second", "third"], 2)).toEqual([
      "third",
      "first",
      "second",
    ]);
  });

  it("should move falsy values to the first position", () => {
    expect(moveAtFirstIndex([1, 0], 1)).toEqual([0, 1]);
    expect(moveAtFirstIndex([1, false], 1)).toEqual([false, 1]);
    expect(moveAtFirstIndex([1, ""], 1)).toEqual(["", 1]);
  });

  it("should support negative indexes when moving an item", () => {
    expect(moveAtFirstIndex([1, 2, 3], -1)).toEqual([3, 1, 2]);
  });

  it("should leave an empty list unchanged when moving a missing item", () => {
    expect(moveAtFirstIndex([], -1)).toEqual([]);
  });

  it("should not recurse forever when updating or removing outside a negative index range", () => {
    expect(updateItemToList([], -1, 1)).toEqual([]);
    expect(removeItemAtIndex([], -1)).toEqual([]);
    expect(updateItemToList([1, 2], -3, 3)).toEqual([1, 2]);
    expect(removeItemAtIndex([1, 2], -3)).toEqual([1, 2]);
  });
});
