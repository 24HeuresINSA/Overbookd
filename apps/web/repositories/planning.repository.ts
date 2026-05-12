import type { BreakPeriod } from "@overbookd/assignment";
import { ICAL, PDF } from "@overbookd/http";
import type {
  CreateBreakPeriodForm,
  MultiPlanningVolunteer,
  VolunteerForPlanningLeaflet,
} from "@overbookd/http";
import type { IProvidePeriod } from "@overbookd/time";
import { HttpClient } from "~/utils/http/http-client";

export class PlanningRepository {
  private static readonly basePath = "planning";

  static getBreakPeriods(volunteer: number) {
    return HttpClient.get<BreakPeriod[]>(
      `${this.basePath}/${volunteer}/break-periods`,
    );
  }

  static addBreakPeriod(volunteer: number, breakPeriod: CreateBreakPeriodForm) {
    return HttpClient.post<BreakPeriod[]>(
      `${this.basePath}/${volunteer}/break-periods`,
      breakPeriod,
    );
  }

  static removeBreakPeriod(volunteer: number, { start, end }: IProvidePeriod) {
    return HttpClient.delete<BreakPeriod[]>({
      path: `${this.basePath}/${volunteer}/break-periods`,
      params: { start, end },
    });
  }

  static getVolunteersForLeaflets() {
    return HttpClient.get<VolunteerForPlanningLeaflet[]>(
      `${this.basePath}/volunteers`,
    );
  }

  static getVolunteersForMultiPlanning(volunteerIds: number[]) {
    return HttpClient.get<MultiPlanningVolunteer[]>({
      path: `${this.basePath}/volunteers/multi`,
      params: { volunteerIds },
    });
  }

  static getPlanningSubscriptionLink() {
    return HttpClient.get<{ link: string }>(`${this.basePath}/subscribe`);
  }

  static getMyPdf(after?: Date) {
    return HttpClient.get<string>(
      { path: `${this.basePath}`, params: { after } },
      { acceptedType: PDF },
    );
  }

  static getMyIcal() {
    return HttpClient.get<string>(`${this.basePath}`, { acceptedType: ICAL });
  }

  static getVolunteerPdf(volunteerId: number, after?: Date) {
    return HttpClient.get<string>(
      { path: `${this.basePath}/${volunteerId}`, params: { after } },
      { acceptedType: PDF },
    );
  }

  static getVolunteerIcal(volunteerId: number) {
    return HttpClient.get<string>(`${this.basePath}/${volunteerId}`, {
      acceptedType: ICAL,
    });
  }

  static getVolunteerBooklet(volunteerId: number, after?: Date) {
    return HttpClient.get<string>(
      { path: `${this.basePath}/booklets/${volunteerId}`, params: { after } },
      { acceptedType: PDF },
    );
  }

  static getVolunteersBooklets(volunteerIds: number[], after?: Date) {
    return HttpClient.post<string>(
      { path: `${this.basePath}/booklets`, params: { after } },
      volunteerIds,
      { acceptedType: PDF },
    );
  }
}
