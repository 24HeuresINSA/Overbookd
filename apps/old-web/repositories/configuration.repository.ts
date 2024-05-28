import { HttpStringified } from "@overbookd/http";
import { Configuration } from "@overbookd/configuration";
import { Context } from "../utils/api/axios";

export class ConfigurationRepository {
  private static readonly basePath = "configuration";

  static getAll(context: Context) {
    return context.$axios.get<HttpStringified<Configuration[]>>(this.basePath);
  }

  static fetch(context: Context, key: string) {
    return context.$axios.get<HttpStringified<Configuration>>(
      `${this.basePath}/${key}`,
    );
  }

  static save(context: Context, config: Configuration) {
    return context.$axios.post<HttpStringified<Configuration>>(
      `${this.basePath}/${config.key}`,
      { value: config.value },
    );
  }
}
