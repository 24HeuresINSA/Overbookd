import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { SlugifyService as Slugify } from "@overbookd/slugify";
import { ConfiguredBarrel, DefineBarrelPrice } from "./define-barrel-price";
import {
  BarrelNotConfigured,
  SimilarBarrelExist,
} from "./define-barrel-price.error";
import { InMemoryBarrels } from "./barrels.inmemory";

const ambree = { drink: "Ambrée", price: 8000 };
const blonde = { drink: "Blonde", price: 8100 };
const api = { drink: "API", price: 9000 };
const triple = { drink: "Triple", price: 12000 };
const cidre = { drink: "Cidre", price: 10000 };

describe("Define barrel price", () => {
  describe.each`
    barrel    | slug
    ${ambree} | ${"ambree"}
    ${blonde} | ${"blonde"}
    ${api}    | ${"api"}
    ${triple} | ${"triple"}
    ${cidre}  | ${"cidre"}
  `("when a new barrel is configured", ({ barrel, slug }) => {
    let defineBarrelPrice: DefineBarrelPrice;
    beforeEach(() => {
      const barrels = new InMemoryBarrels();
      defineBarrelPrice = new DefineBarrelPrice(barrels);
    });
    it("should add it to the configured ones", async () => {
      const newBarrel = await defineBarrelPrice.add(barrel);

      expect(newBarrel).toEqual({ slug, ...barrel });
    });
  });
  describe("when configuring a similar barrel than an existing one", () => {
    it("should indicate that a similar barrel exist", async () => {
      const barrels = new InMemoryBarrels([ambree]);
      const defineBarrelPrice = new DefineBarrelPrice(barrels);
      expect(
        async () => await defineBarrelPrice.add({ ...ambree, price: 8500 }),
      ).rejects.toThrow(SimilarBarrelExist);
    });
  });
  describe.each`
    configuredBarrels                       | length
    ${[ambree]}                             | ${1}
    ${[ambree, blonde, api]}                | ${3}
    ${[ambree, blonde, api, cidre, triple]} | ${5}
  `(
    "when listing $length configured barrels",
    ({ configuredBarrels, length }) => {
      let defineBarrelPrice: DefineBarrelPrice;
      beforeEach(() => {
        const barrels = new InMemoryBarrels(configuredBarrels);
        defineBarrelPrice = new DefineBarrelPrice(barrels);
      });
      it(`should return ${length}`, async () => {
        const configured = await defineBarrelPrice.list();

        expect(configured).toHaveLength(length);
      });
    },
  );
  describe("after adding a new barrel", () => {
    it("should be listed in the configured ones", async () => {
      const alreadyConfigured = [ambree];
      const barrels = new InMemoryBarrels(alreadyConfigured);
      const defineBarrelPrice = new DefineBarrelPrice(barrels);
      const configuredBlonde = await defineBarrelPrice.add(blonde);

      const allConfigured = await defineBarrelPrice.list();

      expect(allConfigured).toHaveLength(alreadyConfigured.length + 1);
      expect(allConfigured).toContainEqual(configuredBlonde);
    });
  });
  describe("after removing an existing barrel", () => {
    it("shouldn't be listed in the configured ones any more", async () => {
      const alreadyConfigured = [ambree];
      const barrels = new InMemoryBarrels(alreadyConfigured);
      const defineBarrelPrice = new DefineBarrelPrice(barrels);

      const slug = Slugify.apply(ambree.drink);
      await defineBarrelPrice.remove(slug);

      const allConfigured = await defineBarrelPrice.list();
      expect(allConfigured).toHaveLength(alreadyConfigured.length - 1);
      expect(allConfigured).not.toContainEqual({ ...ambree, slug });
    });
  });
  describe("when adjusting an existing barrel price", () => {
    const alreadyConfigured = [ambree];
    const slug = Slugify.apply(ambree.drink);
    const price = ambree.price + 1000;
    let defineBarrelPrice: DefineBarrelPrice;
    let updatedBarrel: ConfiguredBarrel;
    beforeAll(async () => {
      const barrels = new InMemoryBarrels(alreadyConfigured);
      defineBarrelPrice = new DefineBarrelPrice(barrels);

      updatedBarrel = await defineBarrelPrice.adjustPrice({
        slug,
        price,
      });
    });
    it("should update the configuration", () => {
      expect(updatedBarrel).toEqual({ drink: ambree.drink, price, slug });
    });
    it("should be listed in the configurated barrel", async () => {
      const allConfigured = await defineBarrelPrice.list();
      expect(allConfigured).toHaveLength(allConfigured.length);
      expect(allConfigured).toContain(updatedBarrel);
    });
  });
  describe("when adjusting a non existing barrel price", () => {
    it("should indicate that barrel is not configured", async () => {
      const slug = Slugify.apply(ambree.drink);
      const price = ambree.price + 1000;
      const barrels = new InMemoryBarrels();
      const defineBarrelPrice = new DefineBarrelPrice(barrels);
      expect(async () => {
        await defineBarrelPrice.adjustPrice({ slug, price });
      }).rejects.toThrow(BarrelNotConfigured);
    });
  });
});
