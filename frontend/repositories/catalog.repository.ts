import { NuxtAxiosInstance } from "@nuxtjs/axios";
import { GearSearchOptions } from "~/store/catalog";
import { Gear } from "~/utils/models/catalog.model";

export type Context = { $axios: NuxtAxiosInstance };

export class GearsRepository {
  private static readonly basePath = "gears";

  static searchGears(context: Context, searchOptions?: GearSearchOptions) {
    return context.$axios.get<Gear[]>(this.basePath, { params: searchOptions });
  }
}
