import { Configuration } from "@overbookd/configuration";
import { BarrelPrices } from "@overbookd/personal-account";

const BARREL_PRICES_CONFIGURATION_KEY = "sg";

export type Configurations = {
  save(prices: Configuration<BarrelPrices>): Promise<BarrelPrices>;
  get(key: string): Promise<BarrelPrices>;
};

export class PersonalAccountService {
  constructor(private readonly configurations: Configurations) {}

  saveBarrelPrices(prices: BarrelPrices): Promise<BarrelPrices> {
    const key = BARREL_PRICES_CONFIGURATION_KEY;
    return this.configurations.save({ key, value: prices });
  }

  getBarrelPrices(): Promise<BarrelPrices> {
    const key = BARREL_PRICES_CONFIGURATION_KEY;
    return this.configurations.get(key);
  }
}
