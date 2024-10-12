import { ICAL, PDF } from "@overbookd/http";
import type { DuringBreakPeriods, VolunteerForPlanning } from "@overbookd/http";
import type { IProvidePeriod } from "@overbookd/time";
import { HttpClient } from "~/utils/http/http-client";

export class PlanningRepository {
  private static readonly basePath = "planning";

  static getBreakPeriods(volunteer: number) {
    return HttpClient.get<IProvidePeriod[]>(
      `${this.basePath}/${volunteer}/break-periods`,
    );
  }

  static addBreakPeriod(volunteer: number, during: DuringBreakPeriods) {
    return HttpClient.post<IProvidePeriod[]>(
      `${this.basePath}/${volunteer}/break-periods`,
      { body: during },
    );
  }

  static removeBreakPeriod(volunteer: number, { start, end }: IProvidePeriod) {
    return HttpClient.delete<IProvidePeriod[]>(
      `${this.basePath}/${volunteer}/break-periods?start=${start}&end=${end}`,
    );
  }

  static getVolunteers() {
    return HttpClient.get<VolunteerForPlanning[]>(
      `${this.basePath}/volunteers`,
    );
  }

  static getPlanningSubscriptionLink() {
    return HttpClient.get<{ link: string }>(`${this.basePath}/subscribe`);
  }

  static getMyPdf() {
    return HttpClient.get<string>(`${this.basePath}`, { acceptedType: PDF });
  }

  static getMyIcal() {
    return HttpClient.get<string>(`${this.basePath}`, { acceptedType: ICAL });
  }

  static getVolunteerPdf(volunteerId: number) {
    return HttpClient.get<string>(`${this.basePath}/${volunteerId}`, {
      acceptedType: PDF,
    });
  }

  static getVolunteerIcal(volunteerId: number) {
    return HttpClient.get<string>(`${this.basePath}/${volunteerId}`, {
      acceptedType: ICAL,
    });
  }
}
