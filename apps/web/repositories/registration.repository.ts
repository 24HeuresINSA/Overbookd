import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  Credentials,
  NewcomerToEnroll,
  RegisterForm,
} from "@overbookd/registration";
import {
  EnrollableAdherent,
  EnrollableVolunteer,
  HttpStringified,
} from "@overbookd/http";

type Context = { $axios: NuxtAxiosInstance };

export class RegistrationRepository {
  private static readonly basePath = "registrations";

  static getAdherents(context: Context) {
    return context.$axios.get<HttpStringified<EnrollableAdherent[]>>(
      `${this.basePath}/adherents`,
    );
  }

  static enrollNewAdherents(context: Context, newcomers: NewcomerToEnroll[]) {
    return context.$axios.post<void>(`${this.basePath}/adherents/enroll`, {
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

  static generateLink(context: Context) {
    return context.$axios.get<string>(
      `${this.basePath}/invite-new-adherents-link`,
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
