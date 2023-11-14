import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  BarrelPrices,
  ConfiguredBarrel,
  NewBarrel,
} from "@overbookd/personal-account";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class PersonalAccountRepository {
  private static readonly basePath = "personal-account";

  static saveBarrelPrices(context: Context, prices: BarrelPrices) {
    return context.$axios.post<HttpStringified<BarrelPrices>>(
      `${this.basePath}/barrel-prices`,
      prices,
    );
  }

  static getBarrelPrices(context: Context) {
    return context.$axios.get<HttpStringified<BarrelPrices>>(
      `${this.basePath}/barrel-prices`,
    );
  }

  static createBarrel(context: Context, barrel: NewBarrel) {
    return context.$axios.post<HttpStringified<ConfiguredBarrel>>(
      `${this.basePath}/barrels`,
      barrel,
    );
  }

  static getBarrels(context: Context) {
    return context.$axios.get<HttpStringified<ConfiguredBarrel[]>>(
      `${this.basePath}/barrels`,
    );
  }

  static adjustBarrelPrice(context: Context, slug: string, price: number) {
    return context.$axios.patch<HttpStringified<ConfiguredBarrel>>(
      `${this.basePath}/barrels/${slug}`,
      { price },
    );
  }

  static removeBarrelPrice(context: Context, slug: string) {
    return context.$axios.delete<void>(`${this.basePath}/barrels/${slug}`);
  }
}
