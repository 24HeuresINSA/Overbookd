import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { ConfiguredBarrel, NewBarrel } from "@overbookd/personal-account";
import { HttpStringified } from "~/utils/types/http";

type Context = { $axios: NuxtAxiosInstance };

export class PersonalAccountRepository {
  private static readonly basePath = "personal-account";

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
