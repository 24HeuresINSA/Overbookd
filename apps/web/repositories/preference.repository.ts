import type {
  PagesPreference,
  PlanningPreference,
  Preference,
} from "@overbookd/http";
import type { PageURL } from "@overbookd/web-page";
import { HttpClient } from "~/utils/http/http-client";

export class PreferenceRepository {
  private static readonly basePath = "preferences";

  static getMyPreferences() {
    return HttpClient.get<Preference>(`${this.basePath}/me`);
  }

  static updatePlanningPreference(preference: PlanningPreference) {
    return HttpClient.patch<PlanningPreference>(
      `${this.basePath}/me/planning`,
      preference,
    );
  }

  static addPageToFavorites(page: PageURL) {
    return HttpClient.post<PagesPreference>(
      `${this.basePath}/me/favorite-pages`,
      { page },
    );
  }

  static removePageFromFavorites(page: PageURL) {
    return HttpClient.delete<PagesPreference>(
      `${this.basePath}/me/favorite-pages/${page}`,
    );
  }
}
