import type { Configuration } from "@overbookd/configuration";
import { HttpClient } from "~/utils/http/http-client";

export class ConfigurationRepository {
  private static readonly basePath = "configuration";

  static getAll() {
    return HttpClient.get<Configuration[]>(this.basePath);
  }

  static fetch(key: string) {
    return HttpClient.get<Configuration>(`${this.basePath}/${key}`);
  }

  static save(config: Configuration) {
    return HttpClient.post<Configuration>(`${this.basePath}/${config.key}`, {
      value: config.value,
    });
  }
}
