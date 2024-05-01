import {
  DuringBreakPeriods,
  HttpStringified,
  ICAL,
  PDF,
  VolunteerForPlanning,
} from "@overbookd/http";
import { IProvidePeriod } from "@overbookd/period";
import { Context } from "./context";

export class PlanningRepository {
  private static readonly basePath = "planning";

  static getBreakPeriods(context: Context, volunteer: number) {
    return context.$axios.get<HttpStringified<IProvidePeriod[]>>(
      `${this.basePath}/${volunteer}/break-periods`,
    );
  }

  static addBreakPeriod(
    context: Context,
    volunteer: number,
    during: DuringBreakPeriods,
  ) {
    return context.$axios.post<HttpStringified<IProvidePeriod[]>>(
      `${this.basePath}/${volunteer}/break-periods`,
      { ...during },
    );
  }

  static removeBreakPeriod(
    context: Context,
    volunteer: number,
    { start, end }: IProvidePeriod,
  ) {
    return context.$axios.delete<HttpStringified<IProvidePeriod[]>>(
      `${this.basePath}/${volunteer}/break-periods`,
      { params: { start, end } },
    );
  }

  static getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<VolunteerForPlanning[]>>(
      `${this.basePath}/volunteers`,
    );
  }

  static getPlanningSubscriptionLink(context: Context) {
    return context.$axios.get<HttpStringified<{ link: string }>>(
      `${this.basePath}/subscribe`,
    );
  }

  static getMyPdf(context: Context) {
    return context.$axios.get<string>(`${this.basePath}`, {
      headers: { accept: PDF },
    });
  }

  static getMyIcal(context: Context) {
    return context.$axios.get<string>(`${this.basePath}`, {
      headers: { accept: ICAL },
    });
  }

  static getVolunteerPdf(context: Context, volunteerId: number) {
    return context.$axios.get<string>(`${this.basePath}/${volunteerId}`, {
      headers: { accept: PDF },
    });
  }

  static getVolunteerIcal(context: Context, volunteerId: number) {
    return context.$axios.get<string>(`${this.basePath}/${volunteerId}`, {
      headers: { accept: ICAL },
    });
  }
}
