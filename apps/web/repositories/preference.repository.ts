import type {
  AssignmentPreference,
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

  static updateAssignmentPreference(preference: AssignmentPreference) {
    return HttpClient.patch<AssignmentPreference>(
      `${this.basePath}/me/assignment`,
      preference,
    );
  }

  static addPageToFavorites(page: PageURL) {
    return HttpClient.patch<PagesPreference>(
      `${this.basePath}/me/favorite-pages`,
      { page },
    );
  }

  static removePageFromFavorites(page: PageURL) {
    return HttpClient.delete<PagesPreference>({
      path: `${this.basePath}/me/favorite-pages`,
      params: { page },
    });
  }
}
