import { SlugifyService as Slugify } from "@overbookd/slugify";
import {
  SimilarBarrelExist,
  BarrelNotConfigured,
} from "./define-barrel-price.error.js";

export type NewBarrel = {
  drink: string;
  price: number;
  openedOn: Date;
};

export type ConfiguredBarrel = {
  slug: string;
  drink: string;
  price: number;
  openedOn: Date;
};

export type AdjustPrice = {
  slug: string;
  price: number;
};

export type AdjustOpeningDate = {
  slug: string;
  openedOn: Date;
};

export type Barrels = {
  findBySlug(slug: string): Promise<ConfiguredBarrel | undefined>;
  find(): Promise<ConfiguredBarrel[]>;
  create(barrel: ConfiguredBarrel): Promise<ConfiguredBarrel>;
  save(barrel: ConfiguredBarrel): Promise<ConfiguredBarrel>;
  remove(slug: string): Promise<void>;
};

export class DefineBarrelPrice {
  constructor(private readonly barrels: Barrels) {}

  async add({ price, drink, openedOn }: NewBarrel): Promise<ConfiguredBarrel> {
    const slug = Slugify.apply(drink);
    const hasASimilarBarrel = await this.barrels.findBySlug(slug);
    if (hasASimilarBarrel) throw new SimilarBarrelExist(slug);

    const barrel = { slug, price, drink, openedOn };
    return this.barrels.create(barrel);
  }

  list(): Promise<ConfiguredBarrel[]> {
    return this.barrels.find();
  }

  remove(slug: string): Promise<void> {
    return this.barrels.remove(slug);
  }

  async adjustPrice({ slug, price }: AdjustPrice): Promise<ConfiguredBarrel> {
    const barrel = await this.barrels.findBySlug(slug);
    if (!barrel) throw new BarrelNotConfigured(slug);
    const updatedBarrel = { ...barrel, price };
    return this.barrels.save(updatedBarrel);
  }

  async adjustOpeningDate({
    slug,
    openedOn,
  }: AdjustOpeningDate): Promise<ConfiguredBarrel> {
    const barrel = await this.barrels.findBySlug(slug);
    if (!barrel) throw new BarrelNotConfigured(slug);
    const updatedBarrel = { ...barrel, openedOn };
    return this.barrels.save(updatedBarrel);
  }
}
