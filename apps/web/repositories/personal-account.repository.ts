import type { ConfiguredBarrel, NewBarrel } from "@overbookd/personal-account";
import { HttpClient } from "~/utils/http/http-client";

export class PersonalAccountRepository {
  private static readonly basePath = "personal-account";

  static createBarrel(barrel: NewBarrel) {
    return HttpClient.post<ConfiguredBarrel>(
      `${this.basePath}/barrels`,
      barrel,
    );
  }

  static getBarrels() {
    return HttpClient.get<ConfiguredBarrel[]>(`${this.basePath}/barrels`);
  }

  static adjustBarrelPrice(slug: string, price: number) {
    return HttpClient.patch<ConfiguredBarrel>(
      `${this.basePath}/barrels/${slug}/price`,
      { price },
    );
  }

  static adjustBarrelOpeningDate(slug: string, openedOn: Date) {
    return HttpClient.patch<ConfiguredBarrel>(
      `${this.basePath}/barrels/${slug}/opening`,
      { openedOn },
    );
  }

  static removeBarrel(slug: string) {
    return HttpClient.delete(`${this.basePath}/barrels/${slug}`);
  }
}
