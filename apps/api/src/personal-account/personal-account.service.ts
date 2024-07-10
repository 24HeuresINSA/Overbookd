import {
  ConfiguredBarrel,
  DefineBarrelPrice,
  NewBarrel,
} from "@overbookd/personal-account";

export class PersonalAccountService {
  constructor(private readonly defineBarrelPrice: DefineBarrelPrice) {}

  getBarrels(): Promise<ConfiguredBarrel[]> {
    return this.defineBarrelPrice.list();
  }

  adjustPrice(slug: string, price: number): Promise<ConfiguredBarrel> {
    return this.defineBarrelPrice.adjustPrice({ slug, price });
  }

  adjustOpeningDate(slug: string, openedOn: Date): Promise<ConfiguredBarrel> {
    return this.defineBarrelPrice.adjustOpeningDate({ slug, openedOn });
  }

  createBarrel(barrel: NewBarrel): Promise<ConfiguredBarrel> {
    return this.defineBarrelPrice.add(barrel);
  }

  removeBarrel(slug: string): Promise<void> {
    return this.defineBarrelPrice.remove(slug);
  }
}
