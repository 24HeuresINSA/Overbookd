import type { Preference } from "@overbookd/http";
import { HttpClient } from "~/utils/http/http-client";

export class PreferenceRepository {
  private static readonly basePath = "preferences";

  static getMyPreferences() {
    return HttpClient.get<Preference>(`${this.basePath}/me`);
  }

  static updateMyPreferences(preference: Preference) {
    return HttpClient.patch<Preference>(`${this.basePath}/me`, preference);
  }
}
