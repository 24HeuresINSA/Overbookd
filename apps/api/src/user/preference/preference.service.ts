import { Injectable } from "@nestjs/common";
import {
  AssignmentPreference,
  PagesPreference,
  PlanningPreference,
  Preference,
} from "@overbookd/http";
import { PageURL } from "@overbookd/web-page";

export type Preferences = {
  findOne(userId: number): Promise<Preference>;
  savePlanningPreference(
    userId: number,
    preference: PlanningPreference,
  ): Promise<PlanningPreference>;
  saveAssignmentPreference(
    userId: number,
    preference: AssignmentPreference,
  ): Promise<AssignmentPreference>;
  addPageToFavorites(userId: number, page: PageURL): Promise<PagesPreference>;
  removePageFromFavorites(
    userId: number,
    page: PageURL,
  ): Promise<PagesPreference>;
};

@Injectable()
export class PreferenceService {
  constructor(private readonly preferences: Preferences) {}

  findOne(userId: number): Promise<Preference> {
    return this.preferences.findOne(userId);
  }

  updatePlanningPreference(
    userId: number,
    preference: PlanningPreference,
  ): Promise<PlanningPreference> {
    return this.preferences.savePlanningPreference(userId, preference);
  }

  updateAssignmentPreference(
    userId: number,
    preference: AssignmentPreference,
  ): Promise<AssignmentPreference> {
    return this.preferences.saveAssignmentPreference(userId, preference);
  }

  addPageToFavorites(userId: number, page: PageURL): Promise<PagesPreference> {
    return this.preferences.addPageToFavorites(userId, page);
  }

  removePageFromFavorites(
    userId: number,
    page: PageURL,
  ): Promise<PagesPreference> {
    return this.preferences.removePageFromFavorites(userId, page);
  }
}
