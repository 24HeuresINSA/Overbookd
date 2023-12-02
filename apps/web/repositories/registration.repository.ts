import { NuxtAxiosInstance } from "@nuxtjs/axios";
import {
  Credentials,
  IDefineANewcomer,
  NewcomerToEnroll,
  RegisterForm,
} from "@overbookd/registration";
import { HttpStringified } from "@overbookd/http";

type Context = { $axios: NuxtAxiosInstance };

export class RegistrationRepository {
  private static readonly basePath = "newcomers";

  static getNewcomers(context: Context) {
    return context.$axios.get<HttpStringified<IDefineANewcomer[]>>(
      this.basePath,
    );
  }

  static enrollNewAdherents(context: Context, newcomers: NewcomerToEnroll[]) {
    return context.$axios.post<void>(`${this.basePath}/enroll-adherent`, {
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
