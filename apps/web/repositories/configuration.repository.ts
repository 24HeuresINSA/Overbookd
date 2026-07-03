import {
  VOLUNTEER_BRIEFING_TIME_WINDOW_KEY,
  type Configuration,
} from "@overbookd/configuration";
import type { IProvidePeriod } from "@overbookd/time";
import { HttpClient } from "~/utils/http/http-client";

export class ConfigurationRepository {
  private static readonly basePath = "configuration";

  static getAll() {
    return HttpClient.get<Configuration[]>(this.basePath);
  }

  static fetch(key: string) {
    return HttpClient.get<Configuration>(`${this.basePath}/${key}`);
  }

  static fetchAsUnauthenticated(key: string) {
    return HttpClient.get<Configuration>(
      `${this.basePath}/${key}/unauthenticated`,
    );
  }

  static save(config: Configuration) {
    return HttpClient.post<Configuration>(`${this.basePath}/${config.key}`, {
      value: config.value,
    });
  }

  static saveBriefingTimeWindow(period: IProvidePeriod) {
    return HttpClient.post<Configuration>(
      `${this.basePath}/${VOLUNTEER_BRIEFING_TIME_WINDOW_KEY}`,
      period,
    );
  }
}
