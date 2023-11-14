import { Configuration } from "@overbookd/configuration";
import {
  BarrelPrices,
  ConfiguredBarrel,
  DefineBarrelPrice,
  NewBarrel,
} from "@overbookd/personal-account";

const BARREL_PRICES_CONFIGURATION_KEY = "sg";

export type Configurations = {
  save(prices: Configuration<BarrelPrices>): Promise<BarrelPrices>;
  get(key: string): Promise<BarrelPrices>;
};

export class PersonalAccountService {
  constructor(
    private readonly configurations: Configurations,
    private readonly defineBarrelPrice: DefineBarrelPrice,
  ) {}

  saveBarrelPrices(prices: BarrelPrices): Promise<BarrelPrices> {
    const key = BARREL_PRICES_CONFIGURATION_KEY;
    return this.configurations.save({ key, value: prices });
  }

  getBarrelPrices(): Promise<BarrelPrices> {
    const key = BARREL_PRICES_CONFIGURATION_KEY;
    return this.configurations.get(key);
  }

  getBarrels(): Promise<ConfiguredBarrel[]> {
    return this.defineBarrelPrice.list();
  }

  adjustPrice(slug: string, price: number): Promise<ConfiguredBarrel> {
    return this.defineBarrelPrice.adjustPrice({ slug, price });
  }

  createBarrel(barrel: NewBarrel): Promise<ConfiguredBarrel> {
    return this.defineBarrelPrice.add(barrel);
  }

  removeBarrel(slug: string): Promise<void> {
    return this.defineBarrelPrice.remove(slug);
  }
}
