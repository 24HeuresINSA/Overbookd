import { SlugifyService as Slugify } from "@overbookd/slugify";
import { updateItemToList } from "@overbookd/list";
import { Barrels, ConfiguredBarrel, NewBarrel } from "./define-barrel-price";

export class InMemoryBarrels implements Barrels {
  private barrels: ConfiguredBarrel[];

  constructor(barrels: NewBarrel[] = []) {
    this.barrels = barrels.map((barrel) => ({
      slug: Slugify.apply(barrel.drink),
      ...barrel,
    }));
  }

  find(): Promise<ConfiguredBarrel[]> {
    return Promise.resolve(this.barrels);
  }

  findBySlug(slug: string): Promise<ConfiguredBarrel | undefined> {
    return Promise.resolve(
      this.barrels.find((barrel) => barrel.slug === Slugify.apply(slug)),
    );
  }

  create(barrel: ConfiguredBarrel): Promise<ConfiguredBarrel> {
    this.barrels = [...this.barrels, barrel];
    return Promise.resolve(barrel);
  }

  remove(slug: string): Promise<void> {
    this.barrels = this.barrels.filter(
      (barrel) => barrel.slug !== Slugify.apply(slug),
    );
    return Promise.resolve();
  }

  save(barrel: ConfiguredBarrel): Promise<ConfiguredBarrel> {
    const index = this.barrels.findIndex(
      (existingBarrel) => existingBarrel.slug === barrel.slug,
    );
    this.barrels = updateItemToList(this.barrels, index, barrel);
    return Promise.resolve(barrel);
  }
}
