import { describe, expect, it } from "vitest";
import { GearSearchBuilder } from "./gear-search.builder.js";
import {
  CHAISE_WITH_CODE,
  PERCEUSE_WITH_CODE,
  TIREUSE_WITH_CODE,
} from "../catalog.test-utils.js";

describe("GearSearchBuilder", () => {
  describe("owner condition", () => {
    it("should match when gear owner code includes the search", () => {
      const builder = new GearSearchBuilder(CHAISE_WITH_CODE).addOwnerCondition(
        "matos",
      );
      expect(builder.match).toBe(true);
    });
    it("should not match when gear owner code does not include the search", () => {
      const builder = new GearSearchBuilder(CHAISE_WITH_CODE).addOwnerCondition(
        "elec",
      );
      expect(builder.match).toBe(false);
    });
    it("should match when gear has no owner but search is undefined", () => {
      const builder = new GearSearchBuilder(
        TIREUSE_WITH_CODE,
      ).addOwnerCondition(undefined);
      expect(builder.match).toBe(true);
    });
    it("should not match when gear has no owner but a search is provided", () => {
      const builder = new GearSearchBuilder(
        TIREUSE_WITH_CODE,
      ).addOwnerCondition("matos");
      expect(builder.match).toBe(false);
    });
  });

  describe("slug condition", () => {
    it("should match when gear slug includes the search", () => {
      const builder = new GearSearchBuilder(CHAISE_WITH_CODE).addSlugCondition(
        "chaise",
      );
      expect(builder.match).toBe(true);
    });
    it("should match when slugified gear code includes the search", () => {
      const builder = new GearSearchBuilder(
        PERCEUSE_WITH_CODE,
      ).addSlugCondition("br_ou_001");
      expect(builder.match).toBe(true);
    });
    it("should not match when neither slug nor code includes the search", () => {
      const builder = new GearSearchBuilder(CHAISE_WITH_CODE).addSlugCondition(
        "tireuse",
      );
      expect(builder.match).toBe(false);
    });
  });

  describe("category condition", () => {
    it("should match when gear category path includes the search", () => {
      const builder = new GearSearchBuilder(
        PERCEUSE_WITH_CODE,
      ).addCategoryCondition("bricollage");
      expect(builder.match).toBe(true);
    });
    it("should not match when gear has no category but a search is provided", () => {
      const builder = new GearSearchBuilder(
        TIREUSE_WITH_CODE,
      ).addCategoryCondition("bricollage");
      expect(builder.match).toBe(false);
    });
  });

  describe("ponctualUsage condition", () => {
    it("should match any gear when ponctualUsage is undefined", () => {
      const builder = new GearSearchBuilder(
        CHAISE_WITH_CODE,
      ).addPonctualUsageCondition(undefined);
      expect(builder.match).toBe(true);
    });
    it("should match only gears with the exact ponctualUsage value, including false", () => {
      const builder = new GearSearchBuilder(
        CHAISE_WITH_CODE,
      ).addPonctualUsageCondition(false);
      expect(builder.match).toBe(true);
    });
    it("should not match when ponctualUsage value differs", () => {
      const builder = new GearSearchBuilder(
        CHAISE_WITH_CODE,
      ).addPonctualUsageCondition(true);
      expect(builder.match).toBe(false);
    });
  });

  describe("combined conditions", () => {
    it("should match only when every added condition matches", () => {
      const builder = new GearSearchBuilder(CHAISE_WITH_CODE)
        .addOwnerCondition("matos")
        .addSlugCondition("chaise")
        .addCategoryCondition("mobilier")
        .addPonctualUsageCondition(false);
      expect(builder.match).toBe(true);
    });
    it("should not match when at least one added condition fails", () => {
      const builder = new GearSearchBuilder(CHAISE_WITH_CODE)
        .addOwnerCondition("matos")
        .addSlugCondition("chaise")
        .addCategoryCondition("electrique");
      expect(builder.match).toBe(false);
    });
  });
});
