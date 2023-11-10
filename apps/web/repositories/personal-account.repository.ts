import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { BarrelPrices } from "@overbookd/personal-account";
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
}
