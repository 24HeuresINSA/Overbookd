import { describe, expect, it } from "vitest";
import { moveAtFirstIndex, removeItemAtIndex, updateItemToList } from "./list";

describe("list operations", () => {
  it("moves falsy values to the first position", () => {
    expect(moveAtFirstIndex([1, 0], 1)).toEqual([0, 1]);
    expect(moveAtFirstIndex([1, false], 1)).toEqual([false, 1]);
    expect(moveAtFirstIndex([1, ""], 1)).toEqual(["", 1]);
  });

  it("supports negative indexes when moving an item", () => {
    expect(moveAtFirstIndex([1, 2, 3], -1)).toEqual([3, 1, 2]);
  });

  it("leaves an empty list unchanged when moving a missing item", () => {
    expect(moveAtFirstIndex([], -1)).toEqual([]);
  });

  it("does not recurse forever when updating or removing outside a negative index range", () => {
    expect(updateItemToList([], -1, 1)).toEqual([]);
    expect(removeItemAtIndex([], -1)).toEqual([]);
    expect(updateItemToList([1, 2], -3, 3)).toEqual([1, 2]);
    expect(removeItemAtIndex([1, 2], -3)).toEqual([1, 2]);
  });
});
