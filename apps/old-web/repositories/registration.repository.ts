import {
  Credentials,
  NewcomerToEnroll,
  RegisterForm,
} from "@overbookd/registration";
import {
  EnrollableStaff,
  EnrollableVolunteer,
  HttpStringified,
} from "@overbookd/http";
import { Context } from "../utils/api/axios";

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static getStaffs(context: Context) {
    return context.$axios.get<HttpStringified<EnrollableStaff[]>>(
      `${this.basePath}/staffs`,
    );
  }

  static enrollStaffs(context: Context, newcomers: NewcomerToEnroll[]) {
    return context.$axios.post<void>(`${this.basePath}/staffs/enroll`, {
      newcomers,
    });
  }

  static getVolunteers(context: Context) {
    return context.$axios.get<HttpStringified<EnrollableVolunteer[]>>(
      `${this.basePath}/volunteers`,
    );
  }

  static getVolunteer(
    context: Context,
    volunteerId: EnrollableVolunteer["id"],
  ) {
    return context.$axios.get<HttpStringified<EnrollableVolunteer>>(
      `${this.basePath}/volunteers/${volunteerId}`,
    );
  }

  static enrollNewVolunteers(context: Context, newcomers: NewcomerToEnroll[]) {
    return context.$axios.post<void>(`${this.basePath}/volunteers/enroll`, {
      newcomers,
    });
  }

  static generateStaffLink(context: Context) {
    return context.$axios.post<string>(`${this.basePath}/invite-staff-link`);
  }

  static fetchStaffLink(context: Context) {
    return context.$axios.get<string | undefined>(
      `${this.basePath}/invite-staff-link`,
    );
  }

  static registerNewcomer(
    context: Context,
    form: RegisterForm,
    token?: string,
  ) {
    const newcomer = form.complete();
    return context.$axios.post<void>(`${this.basePath}`, { token, newcomer });
  }

  static forgetMe(context: Context, credentials: Credentials, token: string) {
    const body = { token, credentials };
    return context.$axios.post<void>(`${this.basePath}/forget`, body);
  }

  static forgetHim(context: Context, email: string) {
    return context.$axios.delete<void>(`${this.basePath}/forget/${email}`);
  }
}
