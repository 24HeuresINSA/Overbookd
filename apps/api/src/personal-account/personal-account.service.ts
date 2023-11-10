import { Configuration } from "@overbookd/configuration";
import { BarrelPrices } from "@overbookd/personal-account";

const BARREL_PRICES_CONFIGURATION_KEY = "sg";

export type Configurations = {
  saveConfiguraton(prices: Configuration<BarrelPrices>): Promise<BarrelPrices>;
};

export class PersonalAccountService {
  constructor(private readonly configurations: Configurations) {}

  saveBarrelPrices(prices: BarrelPrices): Promise<BarrelPrices> {
    const key = BARREL_PRICES_CONFIGURATION_KEY;
    return this.configurations.saveConfiguraton({ key, value: prices });
  }
}
