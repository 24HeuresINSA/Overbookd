import { HttpStringified, Preference } from "@overbookd/http";
import { Context } from "../utils/api/axios";

export class PreferenceRepository {
  private static readonly basePath = "preferences";

  static getMyPreferences(context: Context) {
    return context.$axios.get<HttpStringified<Preference>>(
      `${this.basePath}/me`,
    );
  }

  static updateMyPreferences(context: Context, preference: Preference) {
    return context.$axios.patch<HttpStringified<Preference>>(
      `${this.basePath}/me`,
      preference,
    );
  }
}
